import { createApp } from 'vue'
import App from './App.vue'
import HellowWorld from './components/HelloWorld.vue'
import Dashboards from './components/Dashboards.vue'
import Dashboard from './components/Dashboard.vue'
import { createRouter, createWebHistory } from 'vue-router'

import { createPinia } from 'pinia'


const routes = [
    { name:'home', path: '/', component: HellowWorld },
    { name:'dashboards', path: '/dashboards', component: Dashboards },
    {        
        path: '/dashboards/:uuid',
        name: 'Dashboard',
        component: Dashboard,
        props:true
    }
  ]


  const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
  })
// Vuetify
import 'vuetify/styles'
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

 
const myCustomLightTheme: ThemeDefinition = {
    dark: false,
    colors: {

      primary: '#8403fc',
      'primary-darken-1': '#3700B3',
      secondary: '#03DAC6',
      'secondary-darken-1': '#018786',
      error: '#B00020',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
    },
  }
import '@davra/ui-dashboards/dist/style.css'

import '@mdi/font/css/materialdesignicons.css'
  
const vuetify =  createVuetify({
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
        myCustomLightTheme,
      },
    },
    components,
    directives,
  })

  import { DavraApiConfig } from '@davra/ui-dashboards'

  DavraApiConfig.baseURL = import.meta.env.VITE_PLATFROM_URL
  DavraApiConfig.auth = { username: import.meta.env.VITE_USERNAME, password:import.meta.env.VITE_PASSWORD}


createApp(App).use(vuetify).use(router).use(createPinia()).mount('#app')