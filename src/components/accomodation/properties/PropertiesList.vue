<template>
    <div class="properties">
        <div
            class="button-container"
        >
            <v-btn
                class="iconic transparent secondary"
                @click="$emit('add')"
            >
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </div>
        <div ref="scroll" class="tab-container">
            <div
                v-for="property in properties"
                class="tab"
                :class="selectedProperty.id == property.id ? 'active' : ''"
                :key="property.id"
                @click="setActiveProperty(property)"
                :selectedProperty="selectedProperty"
            >
                <label>
                    <span>{{ property.name }}</span>
                </label>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'PropertiesList',
  computed: {
    ...mapGetters('accomodation', ['properties', 'selectedProperty'])
  },
  methods: {
    ...mapActions('accomodation', ['setActiveProperty'])
  }
};
</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

.properties {
    height: 52px;
    width: 100%;
    background-color: $tertiary;
    display: flex;
    grid-template-columns: auto 1fr auto auto;
    box-shadow: 0 -1px 0 0 $light-grey;
    background: #F9FAFB;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    color: $black;
    cursor: pointer !important;

    >div {
        cursor: pointer !important;
    }

    .button-container {
        display: inline-flex;
        align-items: center;
        height: 56px;
        background: #F9FAFB;
        box-shadow: 1px 0 0 0 $light-grey;
        padding: 0 12px;
        transition-duration: .2s;
        cursor: pointer !important;

        .iconic {
            height: 36px;
            width: 36px;
            border-radius: 5px;

            i {
                font-size: 24px;
            }

            &:hover {
                background: lighten($light-grey, 2%);
            }
        }

        button + button {
            margin-left: 2px;
        }

        &.rs {
            box-shadow: 2px 0px 4px rgba(68, 79, 84, 0.15);
        }
    }

    .tab-container {
        width: 100%;
        white-space: nowrap;
        display: flex;
        gap: 5px;
        align-items: center;
        white-space: nowrap;
        overflow-x: auto;
        padding: 0 12px;
        scroll-behavior: smooth;
        cursor: pointer;

        .active, .active:hover {
            background-color: $accent;
            color: $white;
            cursor: pointer;
        }

        >div:hover {
            background-color: $light-grey;
            cursor: pointer;
        }

        >div {
            padding-left: 5px;
            padding-right: 5px;
            width: auto;
            height: 100%;
            border: 0.5px solid $border-color;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 1px 0 0 0 $light-grey;
            cursor: pointer;

            .tab:hover{
                background-color: $light-grey;
                cursor: pointer;
            }

            .tab {
                &:not(:last-child) {
                    margin-right: 4px;
                }

                input {
                    display: none;
                }

                label {
                    display: inline-flex;
                    align-items: center;
                    height: 36px;
                    padding: 0 12px;
                    cursor: pointer;
                    user-select: none;
                    border-radius: $corner-radius;
                    transition-duration: .2s;
                    margin: auto;
                    cursor: pointer !important;

                    i {
                        font-size: 18px;
                        margin-right: 8px;
                        color: $tertiary;
                    }

                    span {
                        display: inline-block;
                        color: $tertiary;
                    }

                    .badge {
                        margin-left: 8px;
                    }

                    &:hover {
                        background: lighten($quaternary, 2%);
                    }
                }

                input:checked + label {
                    background: $accent;

                    span,
                    i {
                        color: $white;
                    }

                    .badge {
                        background: $white;
                        color: $accent;
                    }
                }
            }
        }
    }

    .nav-controls {
            display: flex;
            align-items: center;
            padding: 0 8px;
            visibility: hidden;
            box-shadow: -1px 0 0 0 $quaternary;

            &.ls {
                box-shadow: -2px 0px 4px rgba(68, 79, 84, 0.15);
            }

            // /deep/ button {
            //     height: 36px;
            //     width: 36px;
            //     border-radius: $corner-radius;

            //     i {
            //         font-size: 24px;
            //     }

            //     &:hover {
            //         background: lighten($quaternary, 2%);
            //     }
            // }

            button + button {
                margin-left: 2px;
            }
        }

}
</style>
