<script setup lang="ts">
import { DashboardPage } from '@connecthing.io/davra-ui'

const props = defineProps<{ uuid: string }>()


</script>

<template>
  <DashboardPage :uuid="props.uuid"></DashboardPage>
</template>