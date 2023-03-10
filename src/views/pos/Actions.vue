<template>
  <div v-if="user" class="actions_pane">
    <v-alert
      v-if="errorMessage"
      outlined dense
      type="info"
      class="white--text">
      {{ errorMessage }}
    </v-alert>
    <template
        v-for="(action, i) in actions">
      <div :key="`action-${i}`" class="action_item"
        @click="listen(action.name)"
        v-if="isAllowedAction(action.name)"
      >
        <v-icon class="icon">{{ getIcon(action.name) }}</v-icon>
        <p class="name">{{ action.name }}
        </p>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import ControlsMixin from '@/mixins/ControlsMixin';
import PrintMixin from '@/mixins/PrintingMixin';

export default {
  name: 'Actions',
  mixins: [ControlsMixin, PrintMixin],
  data() {
    return {
      actions: [
        { name: 'Confirm', icon: 'mdi-thumb-up-outline' },
        { name: 'Bill', icon: 'mdi-note-outline' },
        { name: 'Settle', icon: 'mdi-credit-card-outline' },
        { name: 'Discount', icon: 'mdi-sale' },
        { name: 'VAT', icon: 'mdi-bookmark-minus-outline' },
      ],
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters('pos', ['runningOrder', 'runningOrderId']),
    ...mapGetters('auth', ['user']),

    userRole() {
      return this.user.role;
    },

    allowAddWaiter() {
      return true;
    },

    company() {
      return this.user ? this.user.company_info : null;
    },

    order() {
      return this.runningOrder;
    },

    hasWaiter() {
      return this.order ? !!this.order.waiter : false;
    },

    companyType() {
      return this.user.company_info ? this.user.company_info.business_type : 0;
    },

    orderId() {
      return this.runningOrder ? this.runningOrder.order_id : null;
    },
  },
  watch: {
    errorMessage(val) {
      if (!val) return;
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    },

    companyType() {
      this.addWaiterAction();
    },
  },
  created() {
    this.$nextTick(() => {
      this.addWaiterAction();
    });
  },
  methods: {
    ...mapActions('pos', ['addOrderItem', 'filterOrders', 'post']),

    getIcon(action) {
      return this.actions.find(a => a.name === action)?.icon
    },

    addWaiterAction() {
      if (this.companyType === 1) {
        this.actions = [{ name: 'Waiter', icon: 'mdi-account-outline' }, ...this.actions]
      }
    },

    isAllowedAction(action) {
      let allowed = false;
      switch (action) {
        case 'Bill':
          allowed = this.userCanPrintBill;
          break;
        case 'Waiter':
          allowed = this.userRole !== 3;
          break;
        case 'Settle':
          allowed = this.allowSettleBill;
          break;
        case 'Discount':
          allowed = this.userCanDiscount;
          break;
        case 'VAT':
          allowed = this.allowAddVAT;
          break;
        default:
          allowed = true;
          break;
      }
      return allowed;
    },

    listen(action) {
      if (!this.order) {
        this.$eventBus.$emit('show-snackbar', 'Please select order');
        return;
      }
      this.$eventBus.$emit('fetch-orders');
      const billPrintCount = this.runningOrder.bill_printed;
      const allowedPrintTimes = this.numberOfTimesUserCanPrintABill;
      switch (action) {
        case 'Confirm':
          this.$nextTick(async () => {
            if (this.hasWaiter) {
              const controlParams = this.userKotPrintParams;
              if (controlParams.is_super) {
                this.performKotPrint();
              } else {
                // Confirm if order is still pending
                this.post({
                  get_order_by_id: this.runningOrderId,
                  company_id: this.user.company_id,
                  settlement_type: 0,
                }).then((response) => {
                  const orderInfo = response.order;

                  if (!orderInfo) throw new Error('Please check or select order');

                  if (orderInfo.last_kot_print_count < controlParams.setting.status) {
                    this.performKotPrint();
                  } else {
                    this.$eventBus.$emit('show-snackbar', `Sorry, you can only print a kot ${this.numberOfTimesUserCanPrintKOT} times.`);
                  }
                }).catch((e) => {
                  this.$eventBus.$emit('show-snackbar', e.message);
                });
              }
            } else this.$eventBus.$emit('show-snackbar', 'Please add waiter');
          });
          break;
        case 'Bill':
          if (billPrintCount < allowedPrintTimes) {
            this.$eventBus.$emit('print-bill');
          } else {
            this.$eventBus.$emit('show-snackbar', `Sorry, you can only print a bill ${allowedPrintTimes} times.`);
          }
          break;
        case 'Discount':
          this.$eventBus.$emit('discount-order');
          break;
        case 'Settle':
          this.$eventBus.$emit('settle-bill');
          break;
        case 'Waiter':
          this.$eventBus.$emit('add-waiter');
          break;
        default:
          this.$eventBus.$emit('show-snackbar', `Sorry ${action} action will be available soon!.`);
          break;
      }
    },

    async confirmOrder() {
      const params = {
        confirm_order: this.orderId,
      };
      const CONFIRM = await this.addOrderItem(params);
      if (CONFIRM.error) this.$eventBus.$emit('show-snackbar', CONFIRM.message);
      else this.$eventBus.$emit('fetch-items');
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

    .actions_pane {
        height: calc(100% - 52px);
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: top;
        align-items: center;
        padding-right: 10px;
        padding-top: 10px;
        padding-left: 5px;

        > div {
            height: 60px;
            width: 100%;
            background-color: $white;
            display: flex;
            gap: 10px;
            padding-left: 5px;
            align-items: center;
            color: $black;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 100%;
            border: 1px solid $bg_color;
            cursor: pointer;
            border-radius: 5px;
            overflow: hidden;

            .icon {
              color: $gray-25;
            }

            .name {
              margin: 0px;
            }
        }

        > div:hover {
          background-color: $blue;
          color: $white;
          .icon {
            color: $white;
          }
        }
    }
</style>
