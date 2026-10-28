<script setup>
import { computed } from 'vue'

const props = defineProps({
  reference: { type: String, required: true },
})

const isConfirmed = computed(() => sessionStorage.getItem('bright-futures-last-booking') === props.reference)
</script>

<template>
  <section class="page-section confirmation">
    <template v-if="isConfirmed">
      <div class="confirmation-mark" aria-hidden="true">✓</div>
      <p class="eyebrow">Booking confirmed</p>
      <h1>Your place has been reserved.</h1>
      <p class="lede">Keep this booking reference for your records. We will use the contact details you provided for any updates.</p>
      <p class="reference" aria-label="Booking reference">{{ reference }}</p>
      <p><a class="button button-primary" href="#/activities">Browse more activities</a></p>
    </template>
    <template v-else>
      <p class="eyebrow">Confirmation unavailable</p>
      <h1>We cannot verify that booking reference.</h1>
      <p class="lede">For privacy, confirmation details appear only immediately after a successful booking.</p>
      <a class="button button-primary" href="#/activities">Browse activities</a>
    </template>
  </section>
</template>
