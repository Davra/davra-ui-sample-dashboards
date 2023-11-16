<script setup lang="ts">
import { DashboardPage } from '@davra/ui-dashboards'

const props = defineProps<{ uuid: string }>()


</script>

<template>
  <DashboardPage :uuid="props.uuid"></DashboardPage>
</template>