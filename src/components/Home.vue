<template>
    <v-container>

        <template v-if="currentOrg">
            <div>

                Welcome your are currently logged in the following organisation : <h1> {{ currentOrg.name }}</h1>
            </div>
        </template>

        <template v-else>
            <div>
                Welcome your are not currently logged in any organisation
            </div>
        </template>
    </v-container>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrganisationsStore } from '../stores/organisations';

const { currentOrg } = storeToRefs(useOrganisationsStore())
</script>

<style scoped></style>