import { createApp } from 'vue';
import App from './App.vue';
import Dashboards from './components/Dashboards.vue';
import Dashboard from './components/Dashboard.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomeVue from './components/Home.vue';

import { createPinia } from 'pinia';

import '@davra/ui-dashboards/dist/style.css';

import '@mdi/font/css/materialdesignicons.css';
import { DavraApiConfig } from './services/davraApi';

DavraApiConfig.baseURL = import.meta.env.VITE_PLATFROM_URL;
if (import.meta.env.VITE_TOKEN) {
  DavraApiConfig.headers = {
    Authorization: `bearer ${import.meta.env.VITE_TOKEN}`,
  };
}

import { DavraApiConfig as DashApiConfig } from '@davra/ui-dashboards';

DashApiConfig.baseURL = import.meta.env.VITE_PLATFROM_URL;

if (import.meta.env.VITE_TOKEN) {
  DashApiConfig.headers = {
    Authorization: `bearer ${import.meta.env.VITE_TOKEN}`,
  };
}

// Vuetify
import 'vuetify/styles';
import { createVuetify, ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: 'grey',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      lightTheme,
    },
  },
  components,
  directives,
});

const base = import.meta.env.VITE_MS_BASE;
const routes = [
  { name: 'home', path: '/', component: HomeVue },
  { name: 'dashboards', path: '/dashboards/', component: Dashboards },
  {
    path: '/dashboards/:uuid',
    name: 'Dashboard',
    component: Dashboard,
    props: true,
  },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(base),
  routes, // short for `routes: routes`
});

createApp(App).use(vuetify).use(router).use(createPinia()).mount('#app');
