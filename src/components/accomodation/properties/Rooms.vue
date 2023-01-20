<template>
    <Basemodal
      :title="property.name"
      :size="700" @close="$emit('close')">
        <div class="rooms">
            <Table>
                <template #header>
                    <th
                        v-for="(head, idx) in tableHeaders"
                        :key="`property-rooms__${idx}`"
                    >
                        {{ head }}
                    </th>
                </template>
                <template slot="body">
                    <tr v-for="(room, idx) in propertyRooms" :key="`properties-listing${room.id}`">
                        <td>{{ idx+1 }}</td>
                        <td>{{ room.name }}</td>
                        <td>{{ room.property }}</td>
                        <td>{{ room.daily_rate_display }}</td>
                        <td>{{ room.currency }}</td>
                        <td>&nbsp;</td>
                    </tr>
                </template>
            </Table>
        </div>
    </Basemodal>
</template>
<script>
import { mapActions } from 'vuex';
import Basemodal from '@/components/generics/Basemodal.vue';
import Table from '@/components/generics/new/Table.vue';

export default {
    name: 'RoomsModal',
    components: {
        Basemodal,
        Table
    },
    props: {
        property: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tableHeaders: [
                '#',
                'Name',
                'Property',
                'Day Rate',
                'Currency',
                ''
            ],
            propertyRooms: []
        }
    },
    created() {
        console.log('create....')
        this.getPropertyRooms();
    },
    methods: {
        ...mapActions('accomodation', ['post']),

        async getPropertyRooms() {
            console.log('get rooms', this.property)
            const response = await this.post({
                fetch_rooms: this.property.id
            });
            console.log(response)
            this.propertyRooms = response.data;
        }
    }
}
</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

.rooms {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 200px;
  color: $black;
}

</style>
