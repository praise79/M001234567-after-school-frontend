<script setup>
import { onMounted, ref } from 'vue'
import ActivityCard from '../components/ActivityCard.vue'
import { getActivities } from '../services/api'

const activities = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadActivities() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    activities.value = await getActivities()
  } catch (error) {
    errorMessage.value = error.message || 'Activities could not be loaded.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadActivities)
</script>

<template>
  <section class="page-section">
    <p class="eyebrow">Find a session</p>
    <h1>Activities for active, creative afternoons.</h1>
    <p class="lede">Each group has limited spaces, a clear age range and a friendly instructor-led session.</p>

    <div v-if="isLoading" class="state" role="status" aria-live="polite">
      <div><div class="loading-indicator" aria-hidden="true"></div><p>Loading activities…</p></div>
    </div>

    <div v-else-if="errorMessage" class="state state-error" role="alert">
      <div>
        <h2>We could not load the activities.</h2>
        <p>{{ errorMessage }}</p>
        <div class="retry-row"><button class="button button-primary" type="button" @click="loadActivities">Try again</button></div>
      </div>
    </div>

    <div v-else-if="activities.length === 0" class="state">
      <div>
        <h2>No activities are available just now.</h2>
        <p>Please check again soon, or contact us if you need help choosing a session.</p>
      </div>
    </div>

    <div v-else class="activity-grid">
      <ActivityCard v-for="activity in activities" :key="activity._id" :activity="activity" />
    </div>
  </section>
</template>
