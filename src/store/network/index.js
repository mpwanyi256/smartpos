export default {
  namespaced: true,
  state: {
    online: false,
  },
  mutations: {
    toggleStatus(state, onlineStatus) {
      state.online = onlineStatus;
    },
  },
  actions: {
    setConnectionStatus({ commit }, status) {
      commit('toggleStatus', status);
    },
  },
  getters: {
    isOnline: (state) => state.online,
    serverIP() {
      const addressSet = localStorage.getItem('smartpos_ipaddress_set');
      return addressSet || process.env.VUE_APP_SERVER_URL;
    },
  },
};
