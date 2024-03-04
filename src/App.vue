<template>
  <v-app>
    <v-app-bar color="primary">

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Davra Custom App Starter</v-app-bar-title>
      <OrgSelector></OrgSelector>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer">
      <v-sheet color="grey-lighten-4" class="pa-4">
        <v-avatar class="mb-4" color="grey-darken-1" size="64">{{ currentUser?.name.slice(0, 1).toUpperCase()
        }}</v-avatar>

        <div>{{ currentUser?.name }}</div>
      </v-sheet>
      <v-list>
        <v-list-item title="Home" :to="{ name: 'home' }"></v-list-item>
        <v-list-item title="Dashboards" :to="{ name: 'dashboards' }"></v-list-item>
      </v-list>
      <!--  -->
    </v-navigation-drawer>
    <v-main>
      <!--  -->
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">


import { onMounted, ref } from 'vue'
import OrgSelector from './components/OrgSelector.vue';
import { useOrganisationsStore } from './stores/organisations';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useDashboardsStore } from '@davra/ui-dashboards';

const drawer = ref(true)

const theme = useTheme()
const { organisationTheme, currentUser } = storeToRefs(useOrganisationsStore())
onMounted(async () => {
  await useOrganisationsStore().pullUserOrganisations()
  if (organisationTheme.value) {
    theme.themes.value.lightTheme.colors.primary = organisationTheme.value.primaryColor;
  }

  const dashbaordsStore = useDashboardsStore()
  dashbaordsStore.dashboardsPagePath = '/dashboards'

})


</script>