<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { UserSessionService, useLabelsStore, useMetricsStore, useUserSessionStore } from '@davra/ui-core'
import type { Metric } from '../types'
import { computed, nextTick, ref } from 'vue';
import MetricForm from './MetricForm.vue'
import MetricSparkline from './MetricSparkline.vue'
const { getPermission } = storeToRefs(useUserSessionStore())
const canCreate = computed(() => getPermission.value('metrics.CREATE_METRIC'))
const headers = ref<any[]>([
  {
    title: 'Name',
    align: 'start',
    key: 'name',
  },

  { title: 'Display Name', key: 'label' },
  { title: 'Units', key: 'units' },
  { title: 'Description', key: 'description' },
  { title: 'Activity', key: 'activity', sortable: false },
  { title: '', key: 'actions', sortable: false },
])

const { updateLabels } = useLabelsStore()
const metricStore = useMetricsStore()
metricStore.pullMetrics()
metricStore.pullMetricsCounters()

const { metrics } = storeToRefs(metricStore)
const dialog = ref(false)

const editedIndex = ref(-1)

const defaultItem: Metric = {
  name: '',
  semantics: 'metric',
  units: '',
  label: '',
  description: '',
  labels: {},
}
const canEditItem = ref(false)
const editedItem = ref<Metric>(Object.assign({}, defaultItem))
const addNewItem = () => {
  editedIndex.value = -1
  canEditItem.value = true
  editedItem.value = Object.assign({}, defaultItem)
  dialog.value = true
}

const editItem = async (item: Metric) => {
  editedIndex.value = metrics.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  canEditItem.value = (canCreate.value && (await UserSessionService.getUserPermissions([{ Action: 'metrics.EDIT', Resource: `metrics/${item.name}` }]))?.[0]?.Allowed) || false
  dialog.value = true
}

const close = async () => {
  dialog.value = false
  await nextTick()
  editedItem.value = Object.assign({}, defaultItem)
  editedIndex.value = -1
}
const saveBtnLoading = ref(false)
const save = async () => {
  saveBtnLoading.value = true
  editedItem.value.name = editedItem.value.name.trim()
  await updateLabels({ ...editedItem.value.labels })
  await metricStore.saveMetric(editedItem.value)

  saveBtnLoading.value = false
  close()
}
const searchString = ref('')
const filteredMetrics = computed(() => {
  return metrics.value.filter((m: Metric) => JSON.stringify(m).toLowerCase().includes(searchString.value.toLowerCase()))
})
</script>

<template>
  <v-container fluid data-testid="metrics-list-page">
    <v-row no-gutters class="mb-3">
      <v-col>
        <span class="text-h5 mr-3">
          Metrics
        </span>
        <span class="text-body-1 text-grey">Add and manage metrics</span>
      </v-col>
    </v-row>

    <v-card>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn v-if="canCreate" data-testid="add-metric-btn" color="primary" prepend-icon="mdi-plus" @click="addNewItem()">
              add a metric
            </v-btn>
          </v-col>
          <v-spacer />
          <v-col style="max-width:400px">
            <v-text-field v-model="searchString" label="Search" />
          </v-col>
        </v-row>

        <VDataTable
          data-testid="metrics-table"
          :headers="headers" :items="filteredMetrics" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-0"
        >
          <template #[`item.actions`]="{ item }">
            <v-btn data-testid="edit-metric-btn" color="primary" size="x-small" variant="flat" icon class="me-2" @click="editItem(item.raw)">
              <v-icon>mdi-cog</v-icon>
              <v-tooltip activator="parent" location="left">
                View/Edit
              </v-tooltip>
            </v-btn>
          </template>
          <template #[`item.activity`]="{ item }">
            <MetricSparkline :metric="item.raw" />
          </template>
        </VDataTable>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="900px">
      <MetricForm v-model="editedItem" :loading="saveBtnLoading" :is-editing="editedIndex > -1" :readonly="!canEditItem" @close="close" @save="save" />
    </v-dialog>
  </v-container>
</template>

<style scoped>

</style>
