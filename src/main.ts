import { createApp } from 'vue'
import axios from 'axios'
import firebase from 'firebase'
import '@mdi/font/css/materialdesignicons.css'
import dotEnv from 'dotenv'
dotEnv.config()
// require('dotenv').config();

import "./style.css"
import App from './App.vue'
import './samples/node-api'
import router from './router'
import store from './store'

// Styles
import 'vuetify/styles'
import vuetify from './plugins/vuetify'
import './styles/main.scss';

// Event bus
import eventBus from './plugins/Eventbus'

// Setup axios
const addressSet = localStorage.getItem('smartpos_ipaddress_set');
const serverUrlToUse = addressSet || process.env.VUE_APP_SERVER_URL;
axios.defaults.baseURL = `${serverUrlToUse}/papi/`;

const firebaseAccountConfig = {
  apiKey: process.env.VUE_APP_FB_API_KEY,
  authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FB_DB_URL,
  projectId: process.env.VUE_APP_FB_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FB_MESSAGESENDER_ID,
  appId: process.env.VUE_APP_FB_APP_ID,
  measurementId: process.env.VUE_APP_FB_MEASUREMENT_ID,
};

const app = createApp(App)
app.use(vuetify)
eventBus(app)
app.use(router)
app.use(store)

// App setup
import initializeApp from './plugins/initializeApp'

const isOnline = window.navigator.onLine;
store.dispatch('network/setConnectionStatus', isOnline);

// initialize firebase
if (isOnline) {
    // initialize firebase
    firebase.initializeApp(firebaseAccountConfig);
    firebase.firestore().settings({
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    });
  
    firebase.analytics();
    firebase.firestore().enablePersistence();
  }

initializeApp()
app.mount('#smartpos')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })