<template>
    <div class="order_items">
        <v-expansion-panels>
        <v-expansion-panel
            v-for="item in items" :key="item.id"
            :title="`${item.quantity} ${item.item_name.toUpperCase()} (${item.amount})`"
        >
            <v-expansion-panel-text>
                <div class="item_lists">
                    <div class="items" v-for="menuItem in item.items_list" :key="menuItem.id">
                        <div class="item_name">
                            <div>
                                {{ menuItem.quantity }}
                                {{ menuItem.name.toUpperCase() }}
                                <span class="item_notes" v-if="menuItem.notes">
                                    <br><strong>Notes: </strong>{{ menuItem.notes }}
                                </span>
                            </div>
                            <div>
                                {{ `Added By ${menuItem.added_by}
                                ${timeElapsed(menuItem.date_added)}` }}
                            </div>
                        </div>
                        <v-spacer></v-spacer><div class="item_amount">
                            {{ menuItem.amount }}
                        </div>
                        <v-btn v-if="false"
                            @click="$emit('cancel', menuItem)"
                            small text color="red">
                            <v-icon>mdi-delete</v-icon> Cancel item
                        </v-btn>
                        <template v-if="false">
                            <v-btn small dark color="orange">
                                <v-icon>mdi-cart</v-icon> KOT
                            </v-btn>
                            <v-btn @click="$emit('cancel', menuItem)" small dark color="orange">
                                <v-icon>mdi-close</v-icon> Delete item
                            </v-btn>

                        </template>
                    </div>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>
<script>

export default {
  name: 'OrderItems',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    timeElapsed(timestamp) {
      if (!timestamp) return '';
      return `@ ${timestamp}`;
    },
  },
};
</script>
<style scoped lang="scss">
@import '../../styles/constants.scss';

    .item_notes {
        font-family: $font-style;
        font-size: 12px;
        font-style: italic;
        color: $red;
        background-color: $light-grey;
        padding: 6px;
        border-radius: 5px;
        line-height: 1.5;
    }
    .items_expanded {
        background-color: #ebe8e8;
        padding: 5px;
    }
    .item_lists {
        display: flex;
        flex-direction: column;
        width: 100%;

        .items {
            display: inline-flex;
            flex-direction: row;
            justify-items: left;
            gap: 5px;
            background-color: rgb(255, 255, 255);
            border: 0.3px solid #c9c9c9;
            width: 100%;
            padding: 5px;
            font-size: 14px;
            font-weight: 300;
        }
    }

    .order_items {
        display: flex;
        flex-direction: column;
        min-height: 300px;
        max-height: 100%;
        overflow-y: auto;

        .item_row:first-child .item {
            font-weight: bold;
        }

        .item_row {
            max-width: 100%;
            height: auto;
            display: inline-flex;
            flex-direction: row;
            font-size: 14px;
            color: black;
            background-color: #3c3c3c;

            .item:first-child {
                width: 100px;
            }

            .item:last-child {
                width: 200px;
                justify-content: right;
                border: none;
            }

            .item {
                display: inline-flex;
                align-items: center;
                justify-content: left;
                height: 36px;
                width: 100%;
                color: black;
                border: 0.2px solid #e2e2e2;
                background-color: white;
                // font-family: $font-style;
                padding: 10px;
            }
        }
    }
</style>
