<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'

import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-moment'
import { computed, withDefaults } from 'vue'
import { useElementSize } from '@vueuse/core'

import { ref } from 'vue';
const props = withDefaults(defineProps<{
  data?: any
  options?: any
  enableZoom?: boolean
  type?: string
}>(), { enableZoom: false, type: 'line' })

Chart.register(...registerables)
Chart.register(zoomPlugin)
const chartContainer = ref(null)
const charthHeight = useElementSize(chartContainer).height

const chart = ref<any>(null)
const showDeZoomBtn = ref(false)
const checkIfZoomed = () => {
  if (chart.value?.chart.getZoomLevel() !== 1)
    showDeZoomBtn.value = true
  else
    showDeZoomBtn.value = false
}
const dezoom = () => {
  chart.value?.chart?.resetZoom()
  showDeZoomBtn.value = false
}

const legendItems = ref<any[]>([])
const selectedLegends = ref<any>([])
const chartPlugins = [{
  id: 'htmlLegend',
  afterUpdate(chart: any) {
    legendItems.value = chart.legend.legendItems
    selectedLegends.value = chart.legend.legendItems.filter((l: any) => l.hidden === false).map((l: any) => l.datasetIndex)
  },
}]
const legendClicked = (id: number) => {
  chart.value?.chart.setDatasetVisibility(id, !chart.value?.chart.isDatasetVisible(id))
  chart.value?.chart.update()
}
const legendContainer = ref(null)
const { height } = useElementSize(legendContainer)
const legengContainerHeight = computed(() => {
  if (!height.value)
    return '0px'

  return `${height.value}px`
})

const chartOptions = computed(() => {
  const resOptions = { ...props.options }
  if (props.enableZoom) {
    resOptions.plugins.zoom = {
      zoom: {
        wheel: {
          enabled: false,
        },
        drag: {
          enabled: true,
        },
        mode: 'x',
        onZoomComplete: checkIfZoomed,
      },
    }
  }
  return resOptions
})
</script>

<template>
  <div ref="chartContainer" style="position:absolute; top:0;left:0;right: 0; bottom:0">
    <div style="position:absolute; top:0;left:0;right: 0; " :style="{ bottom: legengContainerHeight }">
      <v-btn
        v-if="showDeZoomBtn" icon="mdi-magnify-minus-outline" color="primary" style="position:absolute; right: 40px;z-index: 999;"
        @click="dezoom"
      />
      <component
        :is="type === 'bar' ? Bar : Line" id="my-chart-id" ref="chart" :options="chartOptions" :data="data"
        :plugins="chartPlugins" style="position: relative; width: 100%; "
      />
    </div>
    <div
      v-if="charthHeight > 300" id="legend-container" ref="legendContainer" class="ma-3 custom-scrollbar"
      style=" position: absolute;  right: 0px; left:0px; bottom: 0px;max-height: 25%; "
    >
      <v-row align="start" no-gutters class="pa-2">
        <v-col v-for="(legendItem) in legendItems" :key="`legend${legendItem.datasetIndex}`" class="flex-grow-0 px-1">
          <div class="pointer text-truncate " style="width: 280px;" @click="legendClicked(legendItem.datasetIndex)">
            <span
              class="little-square"
              :style="{ background: legendItem.hidden ? 'white' : legendItem.fillStyle, borderColor: legendItem.strokeStyle }"
            />
            <span
              class="mx-1 text-body-2 " :class="{ 'text-grey': legendItem.hidden }"
              :style="{ textDecoration: legendItem.hidden ? 'line-through' : '' }"
            >
              {{ legendItem.text }}
            </span>
          </div>
        </v-col>
        <v-spacer />
      </v-row>

      <!-- <span class="little-square" :style="{ background: legendItem.strokeStyle }" /> -->
    </div>
  </div>
</template>

<style scoped>
.little-square {
  width: 25px;
  height: 16px;
  display: inline-flex;
  border: 1px solid;
  vertical-align: middle;
}
</style>

