import { mapGetters } from 'vuex';

export default {
  name: 'ShowPDFMixin',

  computed: {
    ...mapGetters('network', ['serverIP']),
  },

  methods: {
    openPDF(url) {
      try {
        const SERVERURL = `${this.serverIP}/papi/pdf/${url}`;
        window.open(SERVERURL, '_blank').focus();
      } catch (e) {
        this.$eventBus.$emit('show-snackbar', `Error opening pdf window, ${e}`);
      }
    },
  },
};
