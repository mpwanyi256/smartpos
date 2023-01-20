import { mapGetters, mapActions } from 'vuex';
import idb from '@/utilities/idb';

const IDB_MENU_KEY = 'smart_pos_menu_sync';
const IDB_MENU_CATEGORIES_KEY = 'smart_pos_menu_categories_sync';

export default {
  name: 'posSync',

  computed: {
    ...mapGetters('auth', ['user']),
  },

  methods: {
    ...mapActions('pos', ['getMenuItems', 'fetchMenuCategories']),

    showAlertMessage(msg) {
      this.$eventBus.$emit('show-snackbar', msg);
    },

    async performPOSsync() {
      // Sync POS with Indexed Database
      this.showAlertMessage('Syncing POS...');
      await this.syncPOSMenu();
      await this.posMenuCategories();
    },

    async posMenuCategories() {
      this.fetchMenuCategories()
        .then((Categories) => {
          idb.collection(IDB_MENU_CATEGORIES_KEY)
            .add(Categories.data)
            .then(() => {
              this.$eventBus.$emit('show-snackbar', 'Successfuly synced menu categories..');
            })
            .catch(() => {
              idb.collection(IDB_MENU_CATEGORIES_KEY)
                .update(Categories.data)
                .then(() => {
                  this.$eventBus.$emit('show-snackbar', 'Updated menu items categories Cache');
                })
                .catch((er) => {
                  this.$eventBus.$emit('show-snackbar', `Error adding items, ${er}`);
                });
            });
        }).catch((e) => {
          this.showAlertMessage(`Error fetching menu categories ${e}`);
        });
    },

    syncPOSMenu() {
      this.getMenuItems({ category_id: 'download', item_name: 'all' })
        .then((menuItems) => {
          const ITEMS = menuItems.data;
          idb.collection(IDB_MENU_KEY)
            .add(ITEMS)
            .then(() => {
              this.$eventBus.$emit('show-snackbar', 'Successfuly synced menu..');
            })
            .catch(() => {
              idb.collection(IDB_MENU_KEY)
                .update(ITEMS)
                .then(() => {
                  this.$eventBus.$emit('show-snackbar', 'Updated menu items Cache');
                })
                .catch((er) => {
                  this.$eventBus.$emit('show-snackbar', 'Error adding items ', er);
                });
            });
        }).catch((e) => {
          this.showAlertMessage(`Error fetching menu Items ${e}`);
        });
    },
  },
};
