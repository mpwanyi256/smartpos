<template>
    <div class="company_settlement">
        <div class="client_search_area">
            <BaseTextfield
              class="client_search"
                placeholder="Search for a client"
                inputType="text"
                @value="clientName = $event"
            />
            <div class="clients_list">
              <Client
                  v-for="client in filteredClients"
                  :key="`client-${client.id}`"
                  :client="client"
                  @select="selectClient(client)"
                />
            </div>
        </div>
        <div class="settlement_area">
          {{ selected_client ? selected_client.full_name: '' }}
          <v-btn :disabled="!selected_client"
            small class="float-right"
            @click="savePayment"
          >
            Save payment
          </v-btn>
        </div>
    </div>
</template>
<script>
import BaseTextfield from '@/components/generics/BaseTextfield.vue';
import Client from '@/components/pos/manage/Client.vue';

export default {
  name: 'CompanySettlement',
  props: {
    order: {
      type: Object,
      required: true,
    },
    clients: {
      type: Array,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    BaseTextfield,
    Client,
  },
  data() {
    return {
      selected_client: null,
      clientName: '',
    };
  },
  computed: {
    filteredClients() {
      return this.clients.filter((c) => c.full_name
        .toLowerCase().match(this.clientName.toLowerCase()));
    },
  },
  methods: {
    savePayment() {
      const payment = {
        settlement_id: 4,
        order_id: this.order.order_id,
        settled_by: this.user.id,
        settle_order: 'company',
        client_id: this.selected_client.id,
      };
      this.$emit('pay', payment);
    },
    selectClient(client) {
      this.selected_client = client;
    },
    isSelected(clientId) {
      return this.selected_client ? this.selected_client.id === clientId : false;
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

  .company_settlement {
    height: 500px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: $black;

    .client_search_area {
      display: flex;
      flex-direction: column;
      height: calc(300px - 40px);

      .client_search {
        margin: 15px;
      }

      .clients_list {
        overflow: auto;
        display: flex;
        flex-direction: column;

        .client_list_item {
          display: flex;
          height: 50px;
          padding: 5px;
          border: 1px solid $border-color;

          p {
            text-align: left;
          }
        }

        .client_list_item:hover, .selected {
          box-shadow: $shadow;
          cursor: pointer;
          background-color: $blue;
          color: $white;
        }
      }

    }

    .settlement_area {
      padding-right: 15px;
      padding-left: 15px;
      color: $blue;
    }
  }
</style>
