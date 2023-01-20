import { mapGetters } from 'vuex';

export default {
  name: 'ExternalLinkMixin',
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('network', ['serverIP']),

    companyInfo() {
      return this.user.company_info;
    },
  },
  methods: {
    openExternalLink(path) {
      window.open(`${this.serverIP}/papi/${path}`, '_blank').focus();
    },
  },
};
