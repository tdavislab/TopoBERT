import {createApp} from 'vue'
import App from './App.vue'
import store from './store'
import "bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css"
import "bootstrap/dist/css/bootstrap.min.css"

import {library} from '@fortawesome/fontawesome-svg-core'
import {faFilter, faTimesCircle, faQuestionCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faFilter, faTimesCircle, faQuestionCircle);

const vm = createApp(App)
  .use(store)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');

