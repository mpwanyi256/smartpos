<template>
    <Basemodal
      :title="`Book room ${room.name.toUpperCase()}`"
      :size="1020" @close="$emit('close')">
      <div class="manager_actions">
          <div class="actions_list">
            <div class="frm_entry">
                <div>
                    <label>First name</label>
                      <BaseTextfield
                        @value="firstname = $event"
                        :preset="firstname"
                        :disabled="selectedClientByEmail"
                        placeholder="First name"
                      />
                </div><div>
                  <label>Last name</label>
                  <BaseTextfield
                      @value="lastname = $event"
                      :preset="lastname"
                      :disabled="selectedClientByEmail"
                      placeholder="Last name"
                  />
                </div>
            </div>
            <div class="frm_entry">
                <div>
                    <label>Address</label>
                    <BaseTextfield
                      @value="address = $event"
                      :preset="address"
                      :disabled="selectedClientByEmail"
                      placeholder="Address"
                    />
                </div><div>
                    <label>Email address</label>
                    <BaseTextfield
                      @value="email = $event"
                      :preset="email"
                      placeholder="email"
                    />
                    <div
                      v-if="selectedClientByEmail"
                      @click="setClientInfo(isKnownClient)"
                      class="known_client">
                      {{isKnownClient.full_name}}
                    </div>
                </div>
            </div>
            <div class="frm_entry">
                <div>
                    <label>Contact number</label>
                    <BaseTextfield
                      @value="contactNumber = $event"
                      :preset="contactNumber"
                      :disabled="selectedClientByEmail"
                      placeholder="+256780101601"
                    />
                </div>
                <div>
                    <label>Booking method</label>
                    <v-select
                      outlined dense
                      :items="methods"
                      v-model="bookingMethod"
                      item-value="id"
                      item-text="method"
                    />
                </div>
            </div>
            <div class="frm_entry">
                <div>
                  <label>Adults</label>
                  <BaseTextfield
                    @value="adults = $event"
                    inputType="number"
                    placeholder="Number of adults"
                  />
                </div>
                <div>
                  <label>Kids</label>
                  <BaseTextfield
                    @value="kids = $event"
                    inputType="number"
                    placeholder="number of kids"
                  />
                </div>
            </div>
            <div class="frm_entry">
                <div>
                    <div>
                      <DatePickerBeta
                        message="Check in date"
                        @picked="checkInDate = $event"
                        :min="checkin"
                      />
                      <TimePicker
                        label="Check in time"
                        @time="setCheckInTime"
                        :min="checkinTimePicked"
                      />
                    </div>
                </div>
                <div>
                  <div>
                    <DatePickerBeta
                      message="Check out"
                      @picked="checkoutDate = $event"
                      :min="checkInDate"
                    />
                    <TimePicker
                      label="Check out time"
                      @time="setCheckOutTime"
                      :min="checkInTime"
                    />
                  </div>
                </div>
            </div>
            <div class="frm_entry">
                <div>
                    <label>Daily rate {{ `${room.daily_rate_display} ${room.currency}` }}</label>
                    <BaseTextfield
                      @value="dailyCharge = $event"
                      :preset="dailyCharge"
                      inputType="number"
                      placeholder="Charge per day"
                    />
                </div>
                <div>
                    <label>Client notes</label>
                    <BaseTextfield
                      @value="remarks = $event"
                      placeholder="Client remarks"
                    />
                </div>
            </div>
            <div class="frm_entry">
                <div>
                    <h2>
                        Total Bill: {{ `${totalCharges} ${room.currency}` }}
                    </h2>
                </div>
                <div>
                    <label>{{ message }}</label>
                <div>
                    <v-btn
                        :disabled="!isValid || disableResubmission"
                        class="float-right"
                        @click="bookRoom"
                    >
                        Save
                    </v-btn>
                </div>
                </div>
            </div>
          </div>
      </div>
    </Basemodal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import Basemodal from '@/components/generics/Basemodal.vue';
import BaseTextfield from '@/components/generics/BaseTextfield.vue';
import DatePickerBeta from '@/components/generics/DatePickerBeta.vue';
import TimePicker from '@/components/generics/TimePicker.vue';

/* eslint-disable prefer-destructuring */
export default {
  name: 'BookRoomModal',
  props: {
    room: {
      type: Object,
      required: true,
    },
    checkin: {
      type: String,
      required: true,
    },
    checkinTimePicked: {
      type: String,
      required: false,
      default: '',
    },
  },
  components: {
    Basemodal,
    BaseTextfield,
    DatePickerBeta,
    TimePicker,
  },
  data() {
    return {
      loading: false,
      message: '',
      methods: [],
      bookingMethod: '',
      firstname: '',
      lastname: '',
      address: '',
      email: '',
      contactNumber: '',
      checkInDate: '',
      checkoutDate: '',
      adults: '',
      kids: '',
      dailyCharge: '',
      totalBill: 0,
      clientId: '',
      clients: [],
      remarks: '',
      knownclientSet: false,
      disableResubmission: false,
      checkInTime: '',
      checkOutTime: '',
    };
  },
  watch: {
    message() {
      setTimeout(() => {
        this.message = '';
      }, 3000);
    },
    isKnownClient() {
      this.knownclientSet = false;
    },
    email() {
      this.knownclientSet = false;
    },
  },
  computed: {
    ...mapGetters('auth', ['user']),

    userTimezone() {
      return new Date().getTimezoneOffset();
    },

    checkinFormatted() {
      return moment(`${this.checkInDate} ${this.checkInTime}`).format();
    },

    checkoutFormatted() {
      return moment(`${this.checkoutDate} ${this.checkOutTime}`).format();
    },

    daysOfStay() {
      const oneDay = 24 * 60 * 60 * 1000;
      const firstDate = new Date(this.checkInDate);
      const secondDate = new Date(this.checkoutDate);

      const days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
      return days + 1;
    },

    totalCharges() {
      return this.daysOfStay * this.dailyCharge;
    },

    selectedClientByEmail() {
      if (!this.email) return null;
      return this.clients.find((client) => client.email === this.email);
    },

    selectedClientByContactNumber() {
      if (!this.contactNumber) return null;
      return this.clients.find((client) => client.contact === this.contactNumber);
    },

    isKnownClient() {
      return this.selectedClientByEmail ? this.selectedClientByEmail
        : this.selectedClientByContactNumber;
    },

    isValid() { //  adjust this
      return this.firstname && this.lastname
      && (this.email || this.contactNumber)
      && this.bookingMethod && this.adults && this.kids && (parseInt(this.totalCharges, 10) > 0);
    },
  },
  created() {
    this.getBookingMethods();
    this.dailyCharge = this.room.daily_rate;
    this.checkInTime = this.checkinTimePicked;
  },
  methods: {
    ...mapActions('accomodation', ['post']),
    ...mapActions('sales', ['getClients']),

    setCheckInTime(timePicked) {
      this.checkInTime = timePicked;
    },

    setCheckOutTime(timePicked) {
      this.checkOutTime = timePicked;
    },

    setClientInfo(client) {
      this.knownclientSet = true;
      this.firstname = client.first_name;
      this.lastname = client.last_name;
      this.address = client.address;
      this.contactNumber = client.contact;
      this.email = client.email;
    },

    async fetchClients() {
      const posClients = await this.getClients('all');
      if (!posClients.error) this.clients = posClients.data;
    },

    getBookingMethods() {
      this.post({
        get_booking_methods: 'all',
      }).then(async (response) => {
        this.methods = response.data;
        await this.fetchClients();
      });
    },

    bookRoom() {
      this.loading = true;
      this.disableResubmission = true;
      this.post({
        room_booking: this.room.id,
        firstname: this.firstname.toUpperCase(),
        lastname: this.lastname.toUpperCase(),
        address: this.address.toUpperCase(),
        email: this.email,
        contact_number: this.contactNumber,
        booking_method: this.bookingMethod,
        adults: parseInt(this.adults, 10),
        kids: parseInt(this.kids, 10),
        check_in: this.checkInDate,
        check_out: this.checkoutDate,
        daily_charge: this.dailyCharge,
        days: this.daysOfStay,
        total_bill: this.totalCharges,
        client_id: this.knownclientSet ? this.isKnownClient.id : 0,
        remarks: this.remarks,
        company_id: this.user.company_id,
        user_id: this.user.id,
        currency_id: this.room.currency_id,
        start: this.checkinFormatted,
        end: this.checkoutFormatted,
        checkin_time: this.checkInTime,
        checkout_time: this.checkOutTime,
        is_timed: !!(this.checkInTime.trim() && this.checkOutTime.trim()),
      }).then((response) => {
        this.$eventBus.$emit('reload-rooms');
        this.message = response.message;
        this.loading = false;
        setTimeout(() => {
          if (!response.error) this.$emit('close');
        }, 1000);
      }).catch(() => {
        this.disableResubmission = false;
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

.manager_actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 400px;
  color: $black;
  padding: 15px;

  .actions_list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 15px;

        .frm_entry {
            display: flex;
            // grid-template-columns: 50% 50%;
            flex-direction: row;
            gap: 15px;
            padding: 0;
            top: 0;
            bottom: 0;

            >div {
                display: flex;
                flex-direction: column;
                width: 100%;
                gap: 15px;

                >div {
                  display: flex;
                  flex-direction: row;
                  gap: inherit;
                  max-width: 100%;
                  width: 100%;
                }

                >div:last-child {
                  margin-right: 10px;
                }

                .known_client {
                    color: $white;
                    font-weight: bold;
                    padding: 10px;
                    background-color: $green;
                    cursor: pointer;
                    margin-right: 10px;
                    border-radius: 5px;
                }
            }
        }

    }

  }

</style>
