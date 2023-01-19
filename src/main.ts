import { createApp } from 'vue'
import axios from 'axios'
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import "./style.css"
import App from './App.vue'
import './samples/node-api'
require('dotenv').config();

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Plugins
import eventBus from './plugins/event-bus'
import EventBusCallbacks from './plugins/Eventbus'

// Setup axios
const addressSet = localStorage.getItem('smartpos_ipaddress_set');
const serverUrlToUse = addressSet || process.env.VUE_APP_SERVER_URL;
axios.defaults.baseURL = `${serverUrlToUse}/papi/`;

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  }
})

createApp(App)
  .use(vuetify)
  .use(EventBusCallbacks, eventBus)
  .provide('$eventBus', eventBus)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })