import { createApp } from 'vue';
import App from './App.vue';
import { store, key } from './store/store';
import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronUp, faChevronDown, faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChevronUp, faChevronDown, faSearch, faTimesCircle);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(store, key);
app.mount('#app');
