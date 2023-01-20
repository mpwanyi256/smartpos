<template>
    <div class="packages_list">
        <template v-if="loading">
            <div class="loading_spinner">
              <LoadingSpinner class="large" />
            </div>
        </template>
        <template v-else>
        <div class="header_section">
          <p>
            <v-btn icon left dark @click="$emit('previous')">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            Please Select package to continue
          </p>
        </div>
        <div class="listing">
            <div class="package"
              v-for="pkg in packages"
              :key="pkg.id"
              @click="selectedPackage = pkg.id"
              :class="selectedPackage == pkg.id ? 'selected' : ''"
            >
              <h3>{{ pkg.name }}
                <span class="float-right">${{ pkg.amount }} Per Month</span>
              </h3>
              <p class="gre--text">{{ pkg.description }}</p>
            </div>
        </div>
        <div class="pa-3 text-center">
          <p>All packages come with a <span><strong>30 Days</strong></span> Free trial.
          <br> No payment is required within the trial period.</p>
        </div>
        <div v-if="errorMessage" class="continue_div text-center red--text">
          {{ errorMessage }}
        </div>
        <div class="continue_div">
            <v-btn block class="primary"
              :disabled="!selectedPackage != 0"
              @click="continueToAccount"
            >
              Continue to account
            </v-btn>
        </div>
        </template>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import LoadingSpinner from '@/components/generics/LoadingSpinner.vue';
import idb from '@/utilities/idb';

export default {
  name: 'SelectPackage',
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      selectedPackage: 0,
      loading: true,
      idb_key: 'smart_business_info',
      companyInfo: null,
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters('auth', ['packages']),

    routeOn() {
      return this.$route.name;
    },

    dayToday() {
      return moment().format('Y-mm-D');
    },
  },
  async created() {
    await Promise.all([
      this.getPackages(),
      this.getDataSync(),
    ]);
    this.loading = false;
  },
  methods: {
    ...mapActions('auth', ['getPackages',
      'addCompanyFirebase', 'getUserById', 'post', 'performLogin']),
    ...mapActions('mail', ['sendEmail']),

    async getDataSync() {
      this.companyInfo = await idb.get(this.idb_key).catch(() => null);
    },

    async continueToAccount() {
      this.errorMessage = '';
      this.loading = true;
      const companyData = {
        company_name: this.companyInfo.name,
        company_location: this.companyInfo.address,
        company_mobile: this.companyInfo.contact,
        email_address: this.companyInfo.email,
        business_type: this.companyInfo.business_type,
        package: this.selectedPackage,
        password: this.companyInfo.password,
        create_new_company: this.companyInfo.name,
      };

      this.post(companyData)
        .then(async (newAccount) => {
          if (newAccount.error) {
            this.errorMessage = newAccount.message;
            throw new Error('Account creation failed');
          } else {
            // Create Firebase account
            const fbAccount = {
              DayOpen: this.dayToday,
              DaysLeft: 30,
              Email: this.companyInfo.email,
              HomeServer: '',
              LiveUrl: `${this.companyInfo.email}_Live`,
              Location: this.companyInfo.address,
              Name: this.companyInfo.name,
              TimeZone: 'Africa/Kampala',
              package: this.selectedPackage,
            };

            await this.addCompanyFirebase(fbAccount);
            return { ...companyData, ...newAccount };
          }
        })
        .then(async (company) => {
          const authParams = {
            user_id: company.user_id,
            new_account: 'new account',
          };

          // Send Verification Code
          await this.sendEmail({
            send_verification_code: true,
            company_name: company.company_name,
            company_email: company.email_address,
            company_id: company.company_id,
          });
          return authParams;
        })
        .then((authParams) => {
          this.$router.replace({
            name: 'verification',
            params: authParams,
          });
        })
        .catch((e) => {
          this.errorMessage = e;
        })
        .finally(async () => {
          this.loading = false;
          await Promise.all([
            idb.delete(this.idb_key),
            idb.delete('smart_auth'),
          ]);
        });
    },
  },
};
</script>
<style scoped lang="scss">
@import '../../styles/constants.scss';

.packages_list {
    display: flex;
    flex-direction: column;
    // gap: 10px;
    min-height: 300px;

    .loading_spinner {
        height: 300px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header_section {
        min-height: 50px;
        display: inline-flex;
        width: 100%;
        justify-content: left;
        align-items: center;
        background-color: #204a63;
        color: $white;
        font-size: 18px;
        padding-top: 16px;
    }

    .listing {
        display: flex;
        flex-direction: column;
        max-height: 300px;
        overflow-y: auto;

        .selected, .selected:hover {
            background-color: $blue !important;
            color: $white !important;
        }

        > div {
            min-height: 56px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: left;
            border-bottom: 0.5px solid $border-color;
            cursor: pointer;
            padding: 16px;
        }

        .package:hover {
            background-color: $lighter-blue;
        }
    }

    .continue_div {
      padding: 8px;
      margin-top: 10px;
    }
}

</style>
