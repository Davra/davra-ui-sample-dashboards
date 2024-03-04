<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOrganisationsStore } from '../stores/organisations';
import { computed, ref } from 'vue';
import { Organisation } from '../types';

const organisationStore = useOrganisationsStore()

const { userOrganisations, currentOrg } = storeToRefs(organisationStore)
const changeOrganisation = (uuid: string) => {
  if (uuid !== currentOrg.value?.UUID)
    organisationStore.switchOrganisation(uuid)
}

const hasMultipleOrg = computed(() => {
  return userOrganisations.value.length > 1
})
const searchOrgString = ref<string>('')

const filteredOrganisations = computed(() => {
  return userOrganisations.value.filter((org: Organisation) => org.name.toLowerCase().includes(searchOrgString.value.toLowerCase()))
})
</script>

<template>
  <v-btn v-if="currentOrg" data-testid="org-selector" variant="text" size="small">
    {{ currentOrg?.name }}<v-icon v-if="hasMultipleOrg">
      mdi:mdi-chevron-down
    </v-icon>
    <v-menu v-if="hasMultipleOrg" activator="parent" width="300px" max-width="400px">
      <v-card>
        <v-card-text class="bg-grey-lighten-3" @click.prevent.stop>
          <div class="pb-2">
            <b>Switch Organisation</b>
          </div>
          <div>
            <v-text-field v-model="searchOrgString" data-testid="search-org-input" prepend-inner-icon="mdi-magnify"
              density="compact" hide-details placeholder="Search organisations" />
          </div>
        </v-card-text>
        <v-list class="py-0" style="max-height:300px">
          <v-list-item v-for="org in filteredOrganisations" :key="org.UUID" class="text-medium-emphasis"
            :active="org.UUID === currentOrg?.UUID" active-color="primary" @click="changeOrganisation(org.UUID)">
            {{ org.name }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-btn>
</template>
