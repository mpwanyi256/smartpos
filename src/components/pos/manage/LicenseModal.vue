<template>
    <Basemodal
      title="Extend License"
      :fullscreen="fullscreen"
      :size="700" @close="$emit('close')">
      <template v-if="accountDisabled">
        <div class="day_switch">
          <h3>Account disabled</h3>
          <p class="red--text mt-3">
            Your account has been disabled.<br>
            If you think we made a mistake, kindly contact us.
          </p>
          <p class="grey--text">
            <span>
              <v-icon small>mdi-whatsapp</v-icon>
              +256-780101601
            </span>
            <span>
              <v-icon small>mdi-email</v-icon>
              pos@prodevkampala.com
            </span>
          </p>
        </div>
      </template>
      <template v-else>
        <div class="day_switch" v-if="license">
            <h1 class="green--text">You have a new license pending activation</h1>
            <h4 class="grey--text mt-3">
                {{ license.key }}
            </h4>
            <div class="mt-3">
                <v-btn small text @click="extendLicense">
                  <v-icon small>mdi-cursor-default-click</v-icon>
                  Click here to extend License by {{ license.duration }} Days
                </v-btn>
            </div>
            <p>{{ errorMessage }}</p>
        </div>
        <div class="day_switch" v-else>
            <h1>You have no license pending activation</h1>
            <p class="grey--text mt-3">
              Kindly contact us for a new license key.
              If you already paid your subscription fee, kindly connect
              to the internet to get your activation code.
            </p>
            <p class="black--text">
                <v-btn text
                  small
                  :loading="loading"
                  @click="fetchUserLicense"
                >
                  <v-icon left>mdi-reload</v-icon>
                  Click to Retry fetching key
                </v-btn>
            </p>
            <p class="grey--text">
                <span>
                  <v-icon small>mdi-whatsapp</v-icon>
                  +256-780101601
                </span>
                <span>
                  <v-icon small>mdi-email</v-icon>
                  pos@prodevkampala.com
                </span>
            </p>
            <p class="red--text">
                {{ errorMessage }}
            </p>
        </div>
      </template>
        <LinearLoader v-if="loading" class="mt-2" />
    </Basemodal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Basemodal from '@/components/generics/Basemodal.vue';
import LinearLoader from '@/components/generics/Loading.vue';

export default {
  name: 'LicenseModal',
  props: {
    message: {
      type: String,
      required: false,
    },
    fullscreen: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    accountDisabled: {
      type: Boolean,
      required: false,
      default: () => false,
    }
  },
  components: {
    Basemodal,
    LinearLoader,
  },
  data() {
    return {
      selectedDate: '',
      loading: false,
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters('auth', ['license']),

    companyId() {
      return localStorage.getItem('smart_company_id');
    },
  },
  watch: {
    errorMessage(val) {
      if (!val) return;
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    },
  },
  methods: {
    ...mapActions('auth',
      ['performLicenseExtension',
        'updateFbLicense',
        'getUserById',
        'getActiveLicense',
      ]),

    async fetchUserLicense() {
      this.loading = true;
      const compEmail = localStorage.getItem('smart_company_email');
      if (compEmail) await this.getActiveLicense(compEmail);
      this.loading = false;
    },

    extendLicense() {
      this.loading = true;
      const license = {
        extend_license: this.license.key,
        duration: this.license.duration,
        company_id: this.companyId,
      };
      this.performLicenseExtension(license)
        .then(async (res) => {
          if (res.extended || res.exists) {
            await this.updateFbLicense({ id: this.license.id, end_date: res.end_date });
            // this.errorMessage = res.message;
            const loggedinUser = localStorage.getItem('smart_user_id');
            if (loggedinUser) await this.getUserById();
            this.loading = false;
          }
          this.errorMessage = res.message;
        }).catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped lang="scss">
.day_switch {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
        display:block;
        max-width: 550px;
        word-wrap:break-word;
        white-space: normal;
        text-align: center;
    }

    .err_message {
        color: red;
    }
}
</style>
