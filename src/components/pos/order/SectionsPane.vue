<template>
    <div class="sections">
      <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel
        v-for="(section,i) in sections"
        :key="`smart-pos-section${section.id}__${i}`"
      >
      <v-expansion-panel-title :class="section.has_orders ? 'has-orders' : ''">
        <div>
          <span v-if="section.has_orders">
            {{ ordersCount(section) }}
          </span>
          {{ section.name }}
        </div>
      </v-expansion-panel-title>
      <v-expansion-panel-text style="padding: 0 !important;">
      <div class="tables_display">
        <TableComponent
          v-for="table in activeTables(section)"
          :key="`postable${table.id}`"
          :table="table"
          @order="confirmOrderCreation(table)"
          :ref="`table-${table.id}`"
        />
      </div>
    </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
      <ConfirmModal
        v-if="dialog && tableSelected"
        :title="`Create new order for ${tableSelected.name}`"
        @close="cancelCreate"
        @yes="createOrder"
      />
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import TableComponent from '@/components/pos/order/TableComponent.vue';
import ConfirmModal from '@/components/generics/ConfirmModal.vue';
import TimezoneMixin from '@/mixins/TimezoneMixin';

export default {
  name: 'SectionsPane',

  mixins: [
    TimezoneMixin,
  ],

  components: {
    TableComponent,
    ConfirmModal,
  },

  props: {
    sections: {
      type: Array,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    dayOpen: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      tableSelected: null,
      dialog: false,
      panel: [0, 1]
    };
  },

  methods: {
    ...mapActions('pos', ['setRunningOrderId', 'setRunningOrder', 'checkTableStatus', 'togglePOSLoading']),

    cancelCreate() {
      this.tableSelected = null;
      this.dialog = false;
    },

    activeTables(section) {
      return section.tables.filter((Table) => Table.hidden === false);
    },

    ordersCount(section) {
      return section.tables.filter((Table) => Table.order.id !== null).length;
    },

    async setOrder(orderId) {
      await this.$eventBus.$emit('fetch-orders');
      this.setRunningOrderId(orderId);
      this.$nextTick(() => {
      });
    },

    confirmOrderCreation(table) {
      this.togglePOSLoading(true);
      this.checkTableStatus(table.id)
        .then((response) => {
          if (!response.error) { // Has order ID
            this.setOrder(response.order_id);
            this.$nextTick(async () => {
              await this.$eventBus.$emit('get-order-details', response.order_id);
              await this.$eventBus.$emit('fetch-orders');
            });
          } else {
            this.tableSelected = table;
            this.dialog = true;
          }
        })
        .catch((e) => {
          this.$eventBus.$emit('show-snackbar', `Error fetching table status, ${e}`);
        })
        .finally(() => {
          this.togglePOSLoading(false);
        });
    },

    async createOrder() {
      if (!this.user) return;
      const filters = {
        table_id: this.tableSelected.id,
      };
      this.$eventBus.$emit('create-table-order', filters);
      this.dialog = false;
      this.tableSelected = null;
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

.sections {
  display: flex;
  margin: 5px;
  color: $black;
  font-size: 14px;
}

.has-orders {
  background-color: $header !important;
  font-weight: bold;
  font-size: 12px;
  border-bottom: 1px solid $border-color;

  span {
    color: $accent-color;
    margin-right: 5px;
    font-size: 14px;
  }
}

.tables_display {
  max-height: 210px;
  overflow-y: auto;
  overflow-x: hidden;
  display: grid;
  padding: 10px;
  margin-bottom: 10px;

  // Desktop view
  @media screen and (max-width: 1440px) {
    grid-template-columns: 100%;
  }

  @media screen and (min-width: 1441px) {
    grid-template-columns: 50% 50%;
  }

}

</style>
