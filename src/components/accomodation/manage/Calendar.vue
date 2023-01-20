<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat class="tool_bar"
        >
          <!-- <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn> -->
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }} | {{ property.name }}

            <!-- <v-btn fab
              text small
              color="grey darken-2"
            >
              <v-icon small>
              mdi-pencil
              </v-icon>
            </v-btn> -->
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="tool_bar_options">
            <v-menu
              bottom
              right
            >
                <template v-slot:activator="{ on, attrs }">
                <v-btn
                    outlined
                    color="grey darken-2"
                    v-bind="attrs"
                    v-on="on"
                >
                    <span>{{ type }}</span>
                    <v-icon right>
                    mdi-menu-down
                    </v-icon>
                </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(option, idx) in calendarDisplayTypes"
                    :key="idx"
                    @click="type = option"
                  >
                    <v-list-item-title>{{ option }}</v-list-item-title>
                  </v-list-item>
                </v-list>
            </v-menu>
            <v-select
              class="rooms_chooser"
              :items="rooms"
              item-text="name"
              item-value="id"
              outlined dense
              v-model="selectedRoom"
            />
            <!-- <BaseTooltip
              @button="addUnit = true"
              message="Add unit"
              icon="plus"
              color="blue"
            /> -->
          </div>
        </v-toolbar>
      </v-sheet>
      <v-sheet class="calendar_view">
        <v-calendar
          ref="calendar"
          v-model="focus"
          :events="eventsClean"
          :event-color="getEventColor"
          :type="type"
          :categories="eventCategories"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @click:time="bookATime"
          @change="updateRange"
        />
      </v-sheet>
    </v-col>

    <ViewBookingModal
      v-if="viewBooking"
      @close="closeBookingModal"
      :booking="selectedEvent"
    />
    <CreateNewUnit
      v-if="addUnit"
      @close="addUnit = false"
      @reload="$emit('reload')"
      :property="property"
    />
    <SelectRoom
      v-if="pickRoom"
      :rooms="rooms"
      @close="pickRoom = false"
      @picked="openBookingModal"
    />
    <BookRoomModal
      v-if="bookRoom && roomPicked && checkinDatePicked"
      :room="roomPicked"
      :checkin="checkinDatePicked"
      :checkin-time-picked="checkinTimePicked"
      @close="bookRoom = false"
    />
  </v-row>
</template>
<script>
import { mapActions } from 'vuex';
import ViewBookingModal from '@/components/accomodation/manage/ViewBookingModal.vue';
import CreateNewUnit from '@/components/accomodation/dashboard/CreateNewUnit.vue';
import SelectRoom from '@/components/accomodation/manage/SelectRoom.vue';
import BookRoomModal from '@/components/accomodation/manage/BookRoomModal.vue';

export default {
  name: 'Calendar',
  props: {
    rooms: {
      type: Array,
      required: true,
    },
    property: {
      type: Object,
      required: false,
    },
  },
  components: {
    ViewBookingModal,
    CreateNewUnit,
    BookRoomModal,
    SelectRoom,
  },
  data() {
    return {
      focus: '',
      type: 'week',
      selectedOpen: false,
      selectedEventId: 0,
      viewBooking: false,
      calendarStartDate: '',
      calendarEndDate: '',
      selectedRoom: 0,
      addUnit: false,
      bookings: [],
      bookRoom: false,
      pickRoom: false,
      roomPicked: null,
      checkinDatePicked: '',
      checkinTimePicked: '',
      mode: 'stack',
      modes: ['stack', 'column'],
      eventCategories: [
        'CONFIRMED',
        'CANCELLED',
        'CHECKED OUT',
        'PENDING',
      ],
      calendarDisplayTypes: [
        'day',
        'week',
        'month',
        '4day',
        'category',
      ],
    };
  },
  computed: {
    selectedPropertyId() {
      return this.property.id;
    },
    selectedEvent() {
      return this.bookings.find((event) => event.booking_id === this.selectedEventId.booking_id);
    },
    eventsClean() {
      const cleanBookings = this.bookings.map(({
        color, check_out, check_in,
        client_fullname, category,
        booking_id, room_id,
        room_name, is_timed,
      }) => ({
        color,
        end: new Date(check_out),
        start: new Date(check_in),
        name: `${client_fullname} | Room: ${room_name}`,
        timed: is_timed,
        booking_id,
        room_id,
        category,
      }));
      const filtered = cleanBookings.filter((b) => b.room_id === this.selectedRoom);
      return this.selectedRoom === 0 ? cleanBookings : filtered;
    },

  },
  watch: {
    selectedPropertyId() {
      this.selectedRoom = 0;
      this.triggerFetchBookings();
    },
    async type() {
      await this.triggerFetchBookings();
    },
    async calendarEndDate() {
      await this.triggerFetchBookings();
    },
  },
  eventBusCallbacks: {
    'load-calendar': 'triggerFetchBookings',
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    ...mapActions('accomodation', ['post']),

    getEventColor(event) {
      return event.color;
    },

    async closeBookingModal() {
      this.viewBooking = false;
      this.selectedEventId = null;
      await this.triggerFetchBookings();
    },

    openBookingModal(room) {
      this.roomPicked = room;
      this.pickRoom = false;
      this.bookRoom = true;
    },

    triggerFetchBookings() {
      const params = {
        start: this.calendarStartDate,
        end: this.calendarEndDate,
        fetch_bookings: this.property.id,
        room_id: this.selectedRoom,
      };
      this.post(params).then((response) => {
        this.bookings = response.data;
      });
    },

    bookATime({ date, time }) {
      this.checkinDatePicked = date;
      this.checkinTimePicked = time;
      this.viewDay({ date });
    },

    viewDay({ date }) {
      this.focus = date;
      this.checkinDatePicked = date;
      this.$nextTick(() => {
        if (this.selectedEventId) return;
        this.pickRoom = true;
        this.type = '4day';
      });
    },
    setToday() {
      this.focus = '';
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ event }) {
      this.selectedEventId = event;
      this.viewBooking = true;
    },
    updateRange({ start, end }) {
      this.calendarStartDate = start.date;
      this.calendarEndDate = end.date;
    },
  },
};
</script>
<style scoped lang="scss">
.calendar_view {
  height: calc(100vh - 168px);
  overflow-y: auto;
}

::v-deep .v-calendar-daily__day-interval {
  cursor: pointer;
}

.tool_bar_options {
    display: inherit;
    gap: 10px;

    .rooms_chooser {
        height: 36px !important;
        margin: 0;
        top: 0;
        bottom: 0;
    }
}
</style>
