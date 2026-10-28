<script setup>
import { reactive, ref } from 'vue'
import { createBooking } from '../services/api'

const props = defineProps({
  activity: { type: Object, required: true },
})
const emit = defineEmits(['booked'])

const form = reactive({
  studentName: '',
  parentName: '',
  contactEmail: '',
  contactPhone: '',
  places: 1,
})
const errors = ref({})
const submitError = ref('')
const isSubmitting = ref(false)

function validate() {
  const nextErrors = {}
  if (form.studentName.trim().length < 2) nextErrors.studentName = 'Enter the student’s full name.'
  if (form.parentName.trim().length < 2) nextErrors.parentName = 'Enter the parent or guardian’s name.'
  if (!/^\S+@\S+\.\S+$/.test(form.contactEmail.trim())) nextErrors.contactEmail = 'Enter a valid email address.'
  if (form.contactPhone.trim().length < 7) nextErrors.contactPhone = 'Enter a valid phone number.'
  if (!Number.isInteger(Number(form.places)) || Number(form.places) < 1 || Number(form.places) > availablePlaces()) {
    nextErrors.places = `Choose between 1 and ${availablePlaces()} places.`
  }
  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function availablePlaces() {
  return Math.max(props.activity.capacity - props.activity.placesBooked, 0)
}

async function submitBooking() {
  submitError.value = ''
  if (!validate()) return

  isSubmitting.value = true
  try {
    const result = await createBooking({
      activityId: props.activity._id,
      studentName: form.studentName.trim(),
      parentName: form.parentName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      places: Number(form.places),
    })
    const reference = result.reference
    if (!reference) throw new Error('The booking service did not return a confirmation reference.')
    emit('booked', reference)
  } catch (error) {
    submitError.value = error.message || 'Your booking could not be completed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="booking-form" novalidate @submit.prevent="submitBooking">
    <p v-if="submitError" class="form-error" role="alert">{{ submitError }}</p>
    <div class="form-row">
      <label class="field">
        Student’s name
        <input v-model="form.studentName" autocomplete="name" :aria-invalid="Boolean(errors.studentName)" />
        <span v-if="errors.studentName" class="field-error">{{ errors.studentName }}</span>
      </label>
      <label class="field">
        Parent / guardian name
        <input v-model="form.parentName" autocomplete="name" :aria-invalid="Boolean(errors.parentName)" />
        <span v-if="errors.parentName" class="field-error">{{ errors.parentName }}</span>
      </label>
    </div>
    <div class="form-row">
      <label class="field">
        Email address
        <input v-model="form.contactEmail" type="email" autocomplete="email" :aria-invalid="Boolean(errors.contactEmail)" />
        <span v-if="errors.contactEmail" class="field-error">{{ errors.contactEmail }}</span>
      </label>
      <label class="field">
        Phone number
        <input v-model="form.contactPhone" type="tel" autocomplete="tel" :aria-invalid="Boolean(errors.contactPhone)" />
        <span v-if="errors.contactPhone" class="field-error">{{ errors.contactPhone }}</span>
      </label>
    </div>
    <label class="field">
      Number of places
      <select v-model.number="form.places" :aria-invalid="Boolean(errors.places)">
        <option v-for="place in availablePlaces()" :key="place" :value="place">{{ place }}</option>
      </select>
      <span v-if="errors.places" class="field-error">{{ errors.places }}</span>
    </label>
    <button class="button button-primary" type="submit" :disabled="isSubmitting || availablePlaces() === 0">
      {{ isSubmitting ? 'Confirming booking…' : availablePlaces() === 0 ? 'This activity is full' : 'Confirm booking' }}
    </button>
  </form>
</template>
