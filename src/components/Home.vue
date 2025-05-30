<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrganisationsStore } from '../stores/organisations';
import { useDevicesStore, useTwinsStore } from '@davra/ui-core';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useDashboardsStore } from '@davra/ui-dashboards';
const { currentOrg, organisationTheme } = storeToRefs(useOrganisationsStore())

const deviceSotre = useDevicesStore()
const twinsStore = useTwinsStore()
const dashbaordsStore  = useDashboardsStore()
const loading = ref(false)
const deviceCounters = ref(0)
const twinCounters = ref(0)
const {dashboardsCount} = storeToRefs(dashbaordsStore)
onMounted(async () => {
    loading.value = true
    const deviceReq = await deviceSotre.pullDevices(0, 1, '', '')
    deviceCounters.value = deviceReq.totalRecords

    const twinReq = await twinsStore.pullTwins(0, 1, '', '')
    twinCounters.value = twinReq.totalRecords

    await dashbaordsStore.pullDashboards()

    loading.value = false

})
</script>

<template>
    <v-container>

        <template v-if="currentOrg">
            <div>
                Welcome your are currently logged in the following organisation : <h1> {{ currentOrg.name }}</h1>
                <pre> {{ organisationTheme }}</pre>
            </div>
        </template>

        <template v-else>
            <h2 class="my-3"> 
                Welcome to TLS custom app starter
            </h2>
            <v-row align="start" justify="start">
                <v-col cols="auto">

                    <v-card color="primary" variant="flat" class="mx-auto" max-width="344" :loading="loading">
                        <v-card-item>
                            <div>
                                <div class="text-overline mb-1">
                                    Devices count
                                </div>
                                <div class="text-h2 mb-1">
                                    {{ deviceCounters }}
                                </div>
                                <div class="text-caption">This is the number of devices you have access to </div>
                            </div>
                        </v-card-item>

                        <v-card-actions>
                            <v-btn :to="{ name: 'devices' }">
                                Go to devices
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col cols="auto">
                    <v-card color="primary" variant="flat" class="mx-auto" :loading="loading" max-width="344">
                        <v-card-item>
                            <div>
                                <div class="text-overline mb-1">
                                    Twins count
                                </div>
                                <div class="text-h2 mb-1">
                                    {{ twinCounters }}
                                </div>
                                <div class="text-caption">This is the number of twins you have access to </div>
                            </div>
                        </v-card-item>

                        <v-card-actions>
                            <v-btn :to="{ name: 'twins' }">
                                Go to twins
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col cols="auto">
                    <v-card color="primary" variant="flat" class="mx-auto" :loading="loading" max-width="344">
                        <v-card-item>
                            <div>
                                <div class="text-overline mb-1">
                                    Dashboards count
                                </div>
                                <div class="text-h2 mb-1">
                                    {{ dashboardsCount }}
                                </div>
                                <div class="text-caption">This is the number of dashboards you have access to </div>
                            </div>
                        </v-card-item>

                        <v-card-actions>
                            <v-btn :to="{ name: 'dashboards' }">
                                Go to Dashboards
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </v-container>

</template>
<style scoped></style>