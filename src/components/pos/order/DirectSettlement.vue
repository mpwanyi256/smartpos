<template>
    <div class="direct_settle">
        <div class="option">
            <h2>Bill: {{ billTotal }}</h2>
            <v-select outlined class="settle_options"
              v-model="settlementId"
              :items="paymentSettlements"
              item-title="name"
              item-value="id"
              single-line
            />
        </div>
        <v-btn block
          class="btn_settle"
          :disabled="!settlementId"
          @click="settleBill">
            Settle Bill
        </v-btn>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'DirectSettlement',
  props: {
    order: {
      type: Object,
      required: true,
    },
    paymentSettlements: {
      type: Array,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      settlementId: 1,
    };
  },
  computed: {
    billTotal() {
      return this.order.final_amount;
    },
  },
  methods: {
    ...mapActions('pos', ['updateOrder', 'setRunningOrderId', 'setRunningOrder']),

    async settleBill() {
      const order = {
        order_id: this.order.order_id,
        settlement_id: this.settlementId,
        settled_by: this.user.id,
        settle_order: 'direct',
      };
      this.$emit('pay', order);
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

    .direct_settle {
        display: inline-flex;
        flex-direction: column;
        width: 100%;

        > div {
            width: 100%;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 30px;
            padding: 10px;

            .settle_options {
              width: 300px;
            }
        }

      .btn_settle {
        background-color: $blue !important;
        color: $white;
        height: 56px !important;
        margin: 10px;
      }
    }
</style>
