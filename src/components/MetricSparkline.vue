<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMetricsStore } from '@davra/ui-core'
import type { Metric } from '../types'
import { computed, ref } from 'vue';
import DavraChart from './chart/DavraChart.vue'

const props = defineProps<{ metric: Metric }>()
const { getMetricCounter } = storeToRefs(useMetricsStore())

const metricCounter = computed(() => {
  return getMetricCounter.value(props.metric.name)
})

const tooltipEl = ref<HTMLElement | null>(null)
// custom tootlip to show outside of canvas
const tooltipValue = ref('')
const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context

  if (!tooltipEl.value)
    return

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.value.style.opacity = '0'
    return
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || []

    const tooltipDiv = document.createElement('div')
    tooltipDiv.classList.add('custom-tooltip')
    const textString = `${titleLines[0]} ${tooltip.body[0].lines}`

    tooltipValue.value = textString
    // tableRoot.appendChild(tableBody)
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

  // Display, position, and set styles for font
  tooltipEl.value.style.opacity = '1'
  tooltipEl.value.style.left = `${positionX + tooltip.caretX}px`
  tooltipEl.value.style.top = `${positionY + tooltip.caretY}px`
  tooltipEl.value.style.font = tooltip.options.bodyFont.string
  tooltipEl.value.style.padding = `${tooltip.options.padding}px ${tooltip.options.padding}px`
  tooltipEl.value.style.width = '200px'
  tooltipEl.value.style.textAlign = 'center'
}

const chartData: any = computed(() => ({
  datasets: [
    {
      data: metricCounter.value?.values.map(([date, value]: [any,any]) => ({ x: new Date(date), y: value })) || [],
      borderColor: '#57A6B9',
      backgroundColor: '#57A6B9',
      minBarLength: 2,
      borderRadius: {
        topRight: 300,
        topLeft: 300,
      },
    }],
}))

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: externalTooltipHandler,
      },
    },

    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
        type: 'time',

        time: {
          displayFormats: {
            hour: 'HH:mm',
            minute: 'HH:mm',
            second: 'HH:mm:ss',
          },
        },
      },
    },
  } as any
})
</script>

<template>
  <div
    style="position:relative ; width:200px; height:36px"
  >
    <DavraChart v-if="metricCounter" :options="chartOptions" :data="chartData" type="bar" />
    <div ref="tooltipEl" class="custom-tooltip">
      {{ tooltipValue }}
    </div>
  </div>
</template>

<style scoped>
.custom-tooltip{
    background: rgba(0, 0, 0, 0.7);
    border-radius: 3px;
    color: white;
    opacity: 1;
    pointer-events: none;
    position: absolute;
    transform: translate(-50%, 0);
    transition: all .1s ease;
    z-index: 9999;

}
</style>
