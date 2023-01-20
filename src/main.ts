import { createApp } from 'vue'
import axios from 'axios'
import '@mdi/font/css/materialdesignicons.css'

import "./style.css"
import App from './App.vue'
import './samples/node-api'
require('dotenv').config();

// Vuetify
import 'vuetify/styles'
import vuetify from './plugins/vuetify'

// Event bus
import eventBus from './plugins/Eventbus'

// Setup axios
const addressSet = localStorage.getItem('smartpos_ipaddress_set');
const serverUrlToUse = addressSet || process.env.VUE_APP_SERVER_URL;
axios.defaults.baseURL = `${serverUrlToUse}/papi/`;

const app = createApp(App)
app.use(vuetify)
eventBus(app)
app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })