<script setup>
import { computed, ref } from 'vue'
import { submitOrder, updateLessonSpace } from '../services/api'

const props = defineProps({ cart: { type: Array, default: () => [] } })
const emit = defineEmits(['cart-updated'])
const name = ref('')
const phone = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const submitted = ref(false)
const nameValid = computed(() => /^[a-zA-Z\s]+$/.test(name.value.trim()))
const phoneValid = computed(() => /^[0-9]+$/.test(phone.value))
const canSubmit = computed(() => props.cart.length > 0 && nameValid.value && phoneValid.value && !isSubmitting.value)

async function removeLesson(lesson) {
  errorMessage.value = ''
  try {
    await updateLessonSpace(lesson.id || lesson._id, Number(lesson.space) + 1)
    emit('cart-updated', props.cart.filter((item) => (item.id || item._id) !== (lesson.id || lesson._id)))
  } catch (error) { errorMessage.value = error.message }
}

async function checkout() {
  if (!canSubmit.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    await submitOrder({ name: name.value.trim(), phone: phone.value, lessonIDs: props.cart.map((lesson) => lesson.id || lesson._id), numberOfSpaces: props.cart.length })
    emit('cart-updated', [])
    submitted.value = true
  } catch (error) { errorMessage.value = error.message } finally { isSubmitting.value = false }
}
</script>

<template>
  <section class="page-section cart-page">
    <p class="eyebrow">Your lessons</p><h1>Cart and checkout</h1>
    <div v-if="submitted" class="state confirmation" role="status"><div><div class="confirmation-mark" aria-hidden="true">✓</div><h2>Order submitted</h2><p>Your lessons are reserved. We will contact you with the next steps.</p><a class="button button-primary" href="#/activities">Choose more lessons</a></div></div>
    <div v-else-if="cart.length === 0" class="state"><div><h2>Your cart is empty.</h2><p>Add a lesson before checking out.</p><a class="button button-primary" href="#/activities">Browse lessons</a></div></div>
    <div v-else class="cart-layout">
      <div class="cart-list"><article v-for="lesson in cart" :key="lesson.id || lesson._id" class="cart-item"><div><p class="activity-card__category">{{ lesson.subject }}</p><h2>{{ lesson.topic }}</h2><p>{{ lesson.location }} · ₦{{ Number(lesson.price).toLocaleString('en-NG') }}</p></div><button class="button button-secondary" type="button" @click="removeLesson(lesson)">Remove</button></article></div>
      <form class="booking-panel booking-form" @submit.prevent="checkout"><h2>Parent details</h2><label class="field">Name<input v-model="name" type="text" autocomplete="name" required pattern="[a-zA-Z\s]+" /><span v-if="name && !nameValid" class="field-error">Use letters and spaces only.</span></label><label class="field">Phone<input v-model="phone" type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9]+" /><span v-if="phone && !phoneValid" class="field-error">Use numbers only.</span></label><p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p><button class="button button-primary" type="submit" :disabled="!canSubmit">{{ isSubmitting ? 'Submitting…' : 'Submit order' }}</button></form>
    </div>
  </section>
</template>
