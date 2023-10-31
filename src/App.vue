<template>
  <v-app id="inspire">
    <v-app-bar flat color="primary">
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-avatar
          class="me-4 "
          color="grey-darken-1"
          size="32"
        ></v-avatar>

        <v-btn
          v-for="link in links"
          :key="link.title"
          :text="link.title"
          :to="{ name: link.to}"
          variant="text"
        ></v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="160">
          <v-text-field
            density="compact"
            flat
            hide-details
            label="Search"
            rounded="lg"
            single-line
            variant="solo-filled"
          ></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-2">
     
        <router-view></router-view>
      
    </v-main>
  </v-app>
</template>

<script setup>
  const links = [
    { title: 'Home', to:'home'},
    { title: 'Dashboards', to:'dashboards'},

  ]

  import { useDashboardsStore, useUserSessionStore } from '@connecthing.io/davra-ui'
  import { onMounted } from 'vue';
    onMounted( () => {
      useUserSessionStore()
      const dashbaordsStore = useDashboardsStore()
      dashbaordsStore.dashboardsPagePath = '/dashboards'
    })
</script>
