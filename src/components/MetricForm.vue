<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { LabelsSelector, useMetricsStore } from '@davra/ui-core'
import {useVModel} from '@vueuse/core'
import type { Metric } from '../types'
import { computed, onMounted, ref } from 'vue';
const props = defineProps< { modelValue: Metric; loading?: boolean; isEditing?: boolean; readonly?: boolean }>()
const emit = defineEmits(['update:modelValue', 'save', 'close'])
const metric = useVModel(props, 'modelValue', emit)
if (metric.value.labels === undefined)
  metric.value.labels = {}
const metricsStore = useMetricsStore()

const { metrics } = storeToRefs(metricsStore)

const rules = {
  noDuplicate: (value: any) => !metrics.value.find((m: Metric) => m.name === value) || 'Known metric with this name already exists',
  required: (value: any) => !!value || 'Field is required',
}
const metricForm = ref<HTMLFormElement | null>(null)
const validate = async () => {
  const { valid } = await metricForm.value?.validate()
  if (valid)
    emit('save')
}
const title = computed(() => {
  return props.isEditing ? 'Metric Settings' : 'Add a Metric'
})
const saveText = computed(() => {
  return props.isEditing ? 'Save Metric' : 'Add Metric'
})

onMounted(async () => await metricsStore.pullMetrics())
</script>

<template>
  <v-card data-testid="metric-form">
    <v-toolbar color="grey-darken-4" height="88">
      <v-list-item class="mx-2">
        <v-list-item-title class="text-h5 px-3 my-2 text-color-white">
          {{ title }}
        </v-list-item-title>
      </v-list-item>
    </v-toolbar>
    <v-divider />
    <v-card-text>
      <div v-if="!!readonly" class="pa-3">
        <v-alert variant="outlined" color="warning">
          <v-icon>mdi-alert</v-icon>
          Your User account is not authorised to edit this metric's settings
        </v-alert>
      </div>
      <v-form ref="metricForm" :readonly="readonly" @submit.prevent="$emit('save')">
        <div class="pa-3">
          <v-row>
            <v-col class="py-1">
              <v-text-field v-model="metric.name" density="compact" variant="outlined" data-testid="metric-name-input" :rules="!isEditing ? [rules.noDuplicate, rules.required] : []" label="Name" :disabled="isEditing" />
            </v-col>
            <v-col style="max-width: 50px;" class="px-0">
              <div class="mx-3">
                <v-icon size="xs" color="primary" icon="mdi-information" />
                <v-tooltip activator="parent" location="left" max-width="200px">
                  Enter a unique name for your metric
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-1">
              <v-text-field v-model="metric.label" density="compact" variant="outlined" data-testid="metric-label-input" label="Display Name" :rules="[rules.required]" />
            </v-col>
            <v-col style="max-width: 50px;" class="px-0">
              <div class="mx-3">
                <v-icon size="xs" color="primary" icon="mdi-information" />
                <v-tooltip activator="parent" location="left" max-width="200px">
                  Enter a display name that will appear in the UI for this metric
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-1">
              <v-text-field v-model="metric.units" density="compact" variant="outlined" data-testid="metric-units-input" label="Units" />
            </v-col>
            <v-col style="max-width: 50px;" class="px-0">
              <div class="mx-3">
                <v-icon size="xs" color="primary" icon="mdi-information" />
                <v-tooltip activator="parent" location="left" max-width="200px">
                  Specify the units that will be used with your metrics. Eg. MPH
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-1">
              <v-textarea v-model="metric.description" data-testid="metric-description-input" label="Description" style="background-color:transparent;" />
            </v-col>
            <v-col style="max-width: 50px;" class="px-0">
              <div class="mx-3">
                <v-icon size="xs" color="primary" icon="mdi-information" />
                <v-tooltip activator="parent" location="left" max-width="200px">
                  Describe your metric
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
        </div>
        <LabelsSelector
          v-if="metric.labels"
          v-model="metric.labels"
          :readonly="readonly"
          class="mt-3 ma-3"
        />
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-actions class="bg-grey-lighten-4 py-4 px-6">
      <v-spacer />
      <v-btn color="primary" data-testid="cancel-btn" @click="$emit('close')">
        Cancel
      </v-btn>
      <v-btn
        :disabled="readonly"
        color="primary"
        class="dashboard-form-submit  mx-3"
        data-testid="submit-btn"
        variant="elevated" :loading="loading"
        @click="validate"
      >
        {{ saveText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

