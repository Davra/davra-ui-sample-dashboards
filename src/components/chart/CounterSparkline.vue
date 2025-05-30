<script setup lang="ts">
import { computed, ref } from 'vue';

const { counter } = defineProps<{ counter: any }>()
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

  const { offsetLeft: positionX, offsetTop: positionY, offsetWidth: canvasWidth } = chart.canvas
  // Display, position, and set styles for font
  let tooltipLeft = positionX + tooltip.caretX
  if (tooltipLeft < 100)
    tooltipLeft = 100

  if (tooltipLeft + 100 > canvasWidth)
    tooltipLeft = canvasWidth - 100

  tooltipEl.value.style.opacity = '1'
  tooltipEl.value.style.left = `${tooltipLeft}px`
  tooltipEl.value.style.top = `${positionY + tooltip.caretY}px`
  tooltipEl.value.style.font = tooltip.options.bodyFont.string
  tooltipEl.value.style.padding = `${tooltip.options.padding}px ${tooltip.options.padding}px`
  tooltipEl.value.style.width = '200px'
  tooltipEl.value.style.textAlign = 'center'
}
const chartData: any = computed(() => ({
  datasets: [
    {
      data: counter.values.map(([date, value]: [string, number]) => ({ x: new Date(parseInt(date)), y: value })) || [],
      borderColor: '#57A6B9',
      backgroundColor: '#57A6B9',
      minBarLength: 2,
      borderRadius: {
        topRight: 4,
        topLeft: 4,
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
    style="position:relative ; width:100%; height:50px"
  >
    <DavraChart :options="chartOptions" :data="chartData" type="bar" />
    <div v-show="tooltipValue" ref="tooltipEl" class="custom-tooltip">
      {{ tooltipValue }}&nbsp;datapoints
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
