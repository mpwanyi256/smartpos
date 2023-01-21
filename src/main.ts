import { createApp } from 'vue'
import axios from 'axios'
import firebase from 'firebase'
import '@mdi/font/css/materialdesignicons.css'
// import dotEnv from 'dotenv'
// dotEnv.config()
require('dotenv').config();

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
const serverUrlToUse = addressSet || 'https://www.pos.prodevkampala.com';
axios.defaults.baseURL = `${serverUrlToUse}/papi/`;

const firebaseAccountConfig = {
  apiKey: 'AIzaSyDZFzAHQ7C_ShR_hrMfsUkbV2ty-PDayO8',
  authDomain: 'poslive-49d9d.firebaseapp.com',
  databaseURL: 'https://poslive-49d9d.firebaseio.com',
  projectId: 'poslive-49d9d',
  storageBucket: 'poslive-49d9d.appspot.com',
  messagingSenderId: '800880700138',
  appId: '1:800880700138:web:9f1036fd5e3ec415e30593',
  measurementId: 'G-SE4P60CNHD',
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