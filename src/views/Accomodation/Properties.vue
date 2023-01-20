<template>
    <Page title="Properties">
        <template #options>
            <PageOptionItem>
                <BaseTooltip
                    @button="addProperty = true"
                    message="Create new property" icon="plus"
                />
            </PageOptionItem>
            <PageOptionItem>
                <v-text-field dense outlined label="Search" v-model="search" />
            </PageOptionItem>
        </template>
        <template #content>
            <Table>
                <template #header>
                    <th v-for="(head, index) in tableHeaders" :key="index">
                        {{ head }}
                    </th>
                </template>
                <template slot="body">
                    <tr v-for="(property, idx) in properties" :key="`properties-listing${property.id}`">
                        <td>{{ page*(idx+1) }}</td>
                        <td>{{ property.name }}</td>
                        <td>{{ property.address }}</td>
                        <td><v-btn text x-small @click="viewRooms(property)">view rooms</v-btn></td>
                        <td>
                            <v-btn x-small icon class="red">
                            <v-icon small class="white--text">
                                mdi-plus
                            </v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </Table>
            <CreateProperty
                v-if="addProperty"
                @close="addProperty = false"
                @reload="getProperties"
            />
            <RoomsModal
                v-if="viewPropertyRooms"
                :property="selectedProperty"
                @close="viewPropertyRooms = false"
            />
            <CreateNewUnit
              v-if="createUnit"
              :property="selectedProperty"
            />
        </template>
    </Page>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Page from '@/components/generics/new/Page.vue';
import PageOptionItem from '@/components/generics/new/PageOptionItem.vue';
import Table from '@/components/generics/new/Table.vue';
import CreateProperty from '@/components/accomodation/manage/CreateProperty.vue';
import BaseTooltip from '@/components/generics/BaseTooltip.vue';
import RoomsModal from '@/components/accomodation/properties/Rooms.vue';
import CreateNewUnit from '@/components/accomodation/dashboard/CreateNewUnit.vue'

export default {
    name: 'Properties',
    components: {
        Page,
        PageOptionItem,
        Table,
        CreateProperty,
        BaseTooltip,
        RoomsModal,
        CreateNewUnit
    },
    data() {
        return {
            search: '',
            tableHeaders: [
                '#',
                'Property Name',
                'Address',
                'Rooms',
                '',
            ],
            page: 1,
            addProperty: false,
            selectedProperty: null,
            viewPropertyRooms: false,
            createUnit: false,
        }
    },
    computed: {
        ...mapGetters('accomodation', ['properties'])
    },
    methods: {
        ...mapActions('accomodation', ['getProperties']),

        viewRooms(property) {
            this.selectedProperty = property;
            this.viewPropertyRooms = true;
        }
    }
}

</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

.properties {
  height: calc(100vh - 104px);
  width: 100%;
  background-color: #f7f7f7;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
}
</style>
