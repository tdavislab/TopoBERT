import {createApp} from 'vue'
import App from './App.vue'
// import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import store from './store'

const vm = createApp(App)
  .use(store)
  .mount('#app');

// console.log(vm)