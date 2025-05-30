import { createRouter, createWebHashHistory } from "vue-router";
import HomeVue from "./components/Home.vue";
import Devices from "./components/Devices.vue";
import Dashboards from "./components/Dashboards.vue";
import Dashboard from "./components/Dashboard.vue";
import Metrics from "./components/Metrics.vue";
import Twins from "./components/Twins.vue";

const routes = [
    { name: 'home', path: '/', component: HomeVue },
    { name: 'devices', path: '/devices/', component: Devices },
    { name: 'twins', path: '/twins/', component: Twins },
    { name: 'dashboards', path: '/dashboards/', component: Dashboards },
    {
        path: '/dashboards/:uuid',
        name: 'Dashboard',
        component: Dashboard,
        props: true,
    },
    { name: 'metrics', path: '/metrics/', component: Metrics },
  ];
  
  const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  });
  

  export default router