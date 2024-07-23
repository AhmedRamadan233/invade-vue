import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Ensure Pinia is imported
import router from './router';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS

// Expose bootstrap globally
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

// Vuetify
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
});

// Create Pinia instance
const pinia = createPinia();

// Create Vue app and use Pinia, Vuetify, and Router
createApp(App)
  .use(pinia) // Add Pinia store
  .use(vuetify) // Add Vuetify
  .use(router) // Add Vue Router
  .mount('#app');
