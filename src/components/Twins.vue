<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import {   useTwinsStore } from '@davra/ui-core'
import type { Metric } from '../types'
import { computed,  onMounted, ref } from 'vue';

const headers = ref<any[]>([
  {
    title: 'Name',
    align: 'start',
    key: 'name',
  },

  { title: 'TwinTpye', key: 'digitalTwinTypeName' },
//   { title: 'Activity', key: 'activity', sortable: false },
  { title: '', key: 'actions', sortable: false },
])

const twinsStore = useTwinsStore()
const twins = ref<any[]>([])
const loader = ref(false)
onMounted(async () => {
    loader.value = true
    const twinRequest =  await twinsStore.pullTwins(0,10,'name','')
    twins.value =  twinRequest.records || []
    loader.value = false
})


const dialog = ref(false)

const editedIndex = ref(-1)
const editedItem = ref<any>({})
const editItem = (item: any) => {
  editedIndex.value = twins.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}


const searchString = ref('')
const filteredTwins = computed(() => {
  return twins.value.filter((m: Metric) => JSON.stringify(m).toLowerCase().includes(searchString.value.toLowerCase()))
})
</script>

<template>
  <v-container fluid data-testid="twins-list-page">
    <v-row no-gutters class="mb-3">
      <v-col>
        <span class="text-h5 mr-3">
          Twins
        </span>
        <span class="text-body-1 text-grey">Add and manage twins</span>
      </v-col>
    </v-row>

    <v-card>
      <v-card-text>
        <v-row>
          <v-col>
            <!-- <v-btn v-if="canCreate" data-testid="add-metric-btn" color="primary" prepend-icon="mdi-plus" @click="addNewItem()">
              add a metric
            </v-btn> -->
          </v-col>
          <v-spacer />
          <v-col style="max-width:400px">
            <v-text-field v-model="searchString" label="Search" />
          </v-col>
        </v-row>

        <VDataTable
          data-testid="twins-table"
          :headers="headers" :items="filteredTwins" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-0"
        >
          <template #[`item.customAttributes.errors`]="{ item }">
            {{  item.raw?.customAttributes?.errors?.join(', ') || 'No Errors'}}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn data-testid="edit-metric-btn" color="primary" size="x-small" variant="flat" icon class="me-2" @click="editItem(item.raw)">
              <v-icon>mdi-cog</v-icon>
              <v-tooltip activator="parent" location="left">
                View/Edit
              </v-tooltip>
            </v-btn>
          </template>
        </VDataTable>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="900px">
        <v-card>
            <v-card-title> 
                <span class="text-h5">View Device</span>
            </v-card-title>
            <v-card-text>
                {{ JSON.stringify(editedItem) }}
            </v-card-text>
            
        </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>