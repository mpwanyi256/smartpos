import API from '@/api';

const PATH = 'accomodation/';

export default {
  namespaced: true,
  state: {
    loading: false,
    properties: [],
    selectedProperty: null,
  },
  mutations: {
    loading(state, payload) {
      state.loading = payload;
    },
    setProperties(state, propertiesList) {
      state.properties = propertiesList;
      state.selectedProperty = propertiesList[0];
    },
    setSelectedProperty(state, property) {
      state.selectedProperty = property;
    }
  },
  actions: {
    setActiveProperty({ commit }, property) {
      commit('setSelectedProperty', property)
    },
    async getProperties({ commit }) {
      try {
        const companyId = localStorage.getItem('smart_company_id');
        const params = new FormData();
        params.append('get_properties', companyId);
        params.append('company_id', companyId);
        const response = await API.smart(PATH, params);
        commit('setProperties', response.data);
      } catch(e) {
        console.log(e)
      }
    },
    post({ commit }, payload) {
      const companyId = localStorage.getItem('smart_company_id');
      commit('loading', true);
      const params = new FormData();
      params.append('company_id', companyId);
      const updateKeys = Object.keys(payload);
      updateKeys.forEach((key) => {
        params.append(key, payload[`${key}`]);
      });
      commit('loading', false);
      return API.smart(PATH, params);
    },
  },
  getters: {
    properties: (state) => state.properties,
    selectedProperty: (state) => state.selectedProperty
  },
};
