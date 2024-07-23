import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import axiosInstance from './axios'; // Import the axios instance

const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();

const app = createApp(App);
app.config.globalProperties.$axios = axiosInstance; // Add axios instance to Vue global properties

app.use(pinia)
  .use(vuetify)
  .use(router)
  .mount('#app');
