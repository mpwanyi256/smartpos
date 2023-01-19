import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

// const app = createApp(App)
// app.use(vuetify)
// app.mount('#app').$nextTick(() => {
//   postMessage({ payload: 'removeLoading' }, '*')
// })

createApp(App)
  .use(vuetify)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })

// new Vue({
//   // router,
//   // store,
//   // vuetify,
//   render: (h) => h(App),
// }).$mount('#app');
