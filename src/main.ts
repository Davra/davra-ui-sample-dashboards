import { createApp } from 'vue'
import App from './App.vue'
import HellowWorld from './components/HelloWorld.vue'
import Dashboards from './components/Dashboards.vue'
import { createRouter, createWebHistory } from 'vue-router'

import { createPinia } from 'pinia'


const routes = [
    { name:'home', path: '/', component: HellowWorld },
    { name:'dashboards', path: '/dashboards', component: Dashboards },
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
    dark: true,
    colors: {
      background: '#fffff',
      surface: '#fffff',
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



createApp(App).use(vuetify).use(router).use(createPinia()).mount('#app')