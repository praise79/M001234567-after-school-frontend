<script setup>
import { onMounted, ref } from 'vue'
import BookingForm from '../components/BookingForm.vue'
import { getActivity } from '../services/api'

const props = defineProps({
  activityId: { type: String, required: true },
})

const activity = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

async function loadActivity() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    activity.value = await getActivity(props.activityId)
  } catch (error) {
    errorMessage.value = error.message || 'This activity could not be loaded.'
  } finally {
    isLoading.value = false
  }
}

function handleBooked(reference) {
  sessionStorage.setItem('bright-futures-last-booking', reference)
  window.location.hash = `#/booking-confirmation/${encodeURIComponent(reference)}`
}

onMounted(loadActivity)
</script>

<template>
  <section class="page-section">
    <a class="back-link" href="#/activities">← Back to activities</a>

    <div v-if="isLoading" class="state" role="status" aria-live="polite">
      <div><div class="loading-indicator" aria-hidden="true"></div><p>Loading activity details…</p></div>
    </div>

    <div v-else-if="errorMessage" class="state state-error" role="alert">
      <div>
        <h1>We could not find that activity.</h1>
        <p>{{ errorMessage }}</p>
        <div class="retry-row">
          <button class="button button-primary" type="button" @click="loadActivity">Try again</button>
          <a class="button button-secondary" href="#/activities">View all activities</a>
        </div>
      </div>
    </div>

    <div v-else-if="activity" class="detail-layout">
      <div>
        <p class="eyebrow">{{ activity.category }}</p>
        <h1>{{ activity.name }}</h1>
        <p class="detail-description">{{ activity.description }}</p>
        <ul class="detail-list" aria-label="Activity information">
          <li><strong>Age range</strong> {{ activity.minAge }}–{{ activity.maxAge }} years</li>
          <li><strong>Schedule</strong> {{ activity.schedule }}</li>
          <li><strong>Price</strong> £{{ activity.price }} per session</li>
          <li><strong>Availability</strong> {{ Math.max(activity.capacity - activity.placesBooked, 0) }} places left</li>
        </ul>
      </div>
      <aside class="booking-panel">
        <h2>Reserve a place</h2>
        <p>Complete the details below. Your booking is only confirmed after the service responds with a reference.</p>
        <BookingForm :activity="activity" @booked="handleBooked" />
      </aside>
    </div>
  </section>
</template>
