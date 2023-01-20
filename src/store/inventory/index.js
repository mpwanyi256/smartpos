import API from '@/api';

const PATH = 'inventory/';

export default {
  namespaced: true,
  state: {
    storeItems: [],
    totalStoreItems: 0,
    measures: [],
    categories: [],
    loading: false,
    hasNext: true,
  },
  mutations: {
    setStoreItems(state, { items, page }) {
      if (page > 1) state.storeItems = [...state.storeItems, ...items.data];
      else state.storeItems = [...items.data];
      state.totalStoreItems = items.total_items;
      state.hasNext = items.has_next;
    },
    setMeasures(state, payload) {
      state.measures = payload;
    },
    setCategories(state, payload) {
      state.categories = payload;
    },
    loading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {

    async getItemRecipe({ commit }, payload) {
      commit('loading', true);
      const filters = new FormData();
      filters.append('get_recipe', payload.menu_item_id);
      const recipe = await API.smart(PATH, filters);
      commit('loading', false);
      return recipe.data || [];
    },

    fetchPurchaseItems(context, payload) {
      const params = new FormData();
      params.append('get_store_items', payload.type || 'all');
      params.append('company_id', payload.company_id);
      params.append('page', payload.page);
      params.append('search', payload.search);
      return API.smart(PATH, params);
    },

    async getStoreItems({ commit }, payload) {
      const {
        type, company_id, page, search,
      } = payload;
      const params = new FormData();
      params.append('get_store_items', type || 'all');
      params.append('company_id', company_id);
      params.append('page', page);
      params.append('search', search);
      const items = await API.smart(PATH, params);
      if (!items.error) {
        commit('setStoreItems', { items, page });
      }
    },

    getPaginatedSToreItemsList({}, payload) {
      const {
        type, company_id, page, search,
      } = payload;
      const params = new FormData();
      params.append('get_store_items', type || 'all');
      params.append('company_id', company_id);
      params.append('page', page);
      params.append('search', search);
      return API.smart(PATH, params);
    },

    async getStoreMeasures({ commit }, payload) {
      const params = new FormData();
      params.append('get_measures', payload);
      const items = await API.smart(PATH, params);
      if (!items.error) commit('setMeasures', items.data);
    },

    async getStoreCategories({ commit }, payload) {
      const params = new FormData();
      params.append('get_store_categories', payload.category_id);
      const categories = await API.smart(PATH, params);
      if (!categories.error) commit('setCategories', categories.data);
    },

    updateItem({ commit }, payload) {
      const params = new FormData();
      const updateKeys = Object.keys(payload);
      updateKeys.forEach((key) => {
        params.append(key, payload[key]);
      });
      if (!payload.company_id) params.append('company_id', localStorage.getItem('smart_company_id'));
      commit('loading', true);
      return API.smart(PATH, params);
    },

    createItem({ commit }, payload) {
      const params = new FormData();
      const updateKeys = Object.keys(payload);
      updateKeys.forEach((key) => {
        params.append(key, payload[key]);
      });
      params.append('create_store_item', 'new');
      commit('loading', true);
      return API.smart(PATH, params);
    },
  },
  getters: {
    storeItems: (state) => state.storeItems,
    storeMeasures: (state) => state.measures,
    categories: (state) => state.categories,
    totalStoreItems: (state) => state.totalStoreItems,
    hasNext: (state) => state.hasNext,
  },
};
