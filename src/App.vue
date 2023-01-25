<template>
  <v-app>
    <router-view></router-view>
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      color="#337ab7"
      position="top"
    >
      {{ snackMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <LicenseModal
      v-if="!loading && (!hasValidLicense || !isActiveAccount)"
      :account-disabled="!isActiveAccount"
      fullscreen
    />
  </v-app>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import LicenseModal from '@/components/pos/manage/LicenseModal.vue';

export default {
  name: 'App',
  components: {
    LicenseModal,
  },
  data() {
    return {
      polling: null,
      snackMessage: '',
      snackbar: false,
      loading: true,
    };
  },
  computed: {
    ...mapGetters('auth', ['user', 'fbCompany']),
    ...mapGetters('network', ['isOnline']),

    isActiveAccount() {
      return this.fbCompany ? this.fbCompany.is_active : false;
    },

    daysLeft() {
      return this.user ? this.user.company_info.days_left : 0;
    },

    currentRoute() {
      return this.$route.name;
    },

    hasValidLicense() {
      return this.user ? this.user.company_info?.days_left > 0 : false;
    },
  },
  watch: {
    user: {
      async handler(USER) {
        if (USER && USER.company_id) {
          await this.loadHomeDefaults();
          const DAYS_LEFT = this.user.company_info?.days_left;

          // Check route
          if (this.currentRoute === 'login' && DAYS_LEFT >= 1) {
            this.$router.replace({ name: 'pos' });
          } else if (this.currentRoute !== 'login' && DAYS_LEFT < 1) {
            this.$router.replace({ name: 'login' });
          }
        }
      },
      immediate: true,
    },
  },
  async created() {
    if (this.user && this.user.company_info) {
      await this.loadHomeDefaults();
    }

    const toggleStatusMode = (status) => {
      const message = status ? 'Back online' : 'Became Offline';
      this.$eventBus.$emit('show-snackbar', message);
      this.setInternetConnectionStatus(status);
    };

    // Listen to connection status
    window.addEventListener('online', () => {
      toggleStatusMode(true);
    });

    window.addEventListener('offline', () => {
      toggleStatusMode(false);
    });
  },

  eventBusCallbacks: {
    'show-snackbar': 'showSnackBar',
  },

  methods: {
    ...mapActions('auth', ['getDayOpen', 'getActiveLicense', 'getFirebaseInfo']),
    ...mapActions('settings', ['fetchOutletSettings']),
    ...mapMutations('settings', ['setColtrols']),
    ...mapActions('menu', ['getDepartments']),
    ...mapActions('network', ['setConnectionStatus']),

    async loadHomeDefaults() {
      if (!this.user) return;
      await Promise.all([
        this.getDepartments('all'),
        this.getDayOpen(this.user.company_id),
        this.getActiveLicense(this.user.company_info.company_email)
      ]);
       if (this.isOnline && !this.fbCompany) await this.getFirebaseInfo();
      // Check route
      if (this.currentRoute === 'login' && this.daysLeft > 0) {
        this.$router.replace({ name: 'pos' });
      }

      if (this.daysLeft < 1) {
        this.$router.replace({ name: 'login' });
      }
    },

    async getAccessControls() {
      this.loading = true;
      const OUTLET = localStorage.getItem('smart_outlet_id');
      const controls = await this.fetchOutletSettings(
        { get_access_controls: 'all', outlet: OUTLET },
      );
      if (!controls.error) this.setColtrols(controls.data);
      this.loading = false;
    },

    showSnackBar(message) {
      this.snackMessage = message;
      this.snackbar = true;
    },

    setInternetConnectionStatus(status) {
      this.setConnectionStatus(status);
    },
  },
};
</script>
<style scoped lang="scss">
@import 'styles/main.scss';
</style>
