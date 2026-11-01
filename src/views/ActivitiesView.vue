<script setup>
import { onMounted, ref } from 'vue'
import LessonCard from '../components/LessonCard.vue'
import { getLessons, updateLessonSpace } from '../services/api'

const props = defineProps({ cart: { type: Array, default: () => [] } })
const emit = defineEmits(['cart-updated'])
const lessons = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const search = ref('')
const teacher = ref('')
const sortBy = ref('subject')
const direction = ref('asc')
const filterMessage = ref('')
const filterMessageType = ref('success')
const hasAppliedFilters = ref(false)
const addingId = ref('')

async function loadLessons(showFeedback = false) {
  isLoading.value = true
  errorMessage.value = ''
  if (showFeedback) {
    hasAppliedFilters.value = true
    filterMessage.value = ''
  }
  try {
    lessons.value = await getLessons({ search: search.value, teacher: teacher.value, sortBy: sortBy.value, direction: direction.value })
    if (showFeedback) {
      filterMessageType.value = lessons.value.length ? 'success' : 'empty'
      filterMessage.value = lessons.value.length
        ? `${lessons.value.length} lesson${lessons.value.length === 1 ? '' : 's'} found. Your filters were applied.`
        : 'No lessons match those filters. Try a different search or teacher name.'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Lessons could not be loaded.'
    if (showFeedback) {
      filterMessageType.value = 'error'
      filterMessage.value = 'The filters could not be applied. Please try again.'
    }
  } finally { isLoading.value = false }
}

async function addToCart(lesson) {
  errorMessage.value = ''
  addingId.value = lesson.id || lesson._id
  try {
    const updated = await updateLessonSpace(lesson.id || lesson._id, Number(lesson.space) - 1)
    const nextLesson = { ...lesson, ...updated, space: Number(updated.space) }
    lessons.value = lessons.value.map((item) => (item.id || item._id) === (lesson.id || lesson._id) ? nextLesson : item)
    emit('cart-updated', [...props.cart, nextLesson])
  } catch (error) { errorMessage.value = error.message } finally { addingId.value = '' }
}

function inCart(lesson) { return props.cart.some((item) => (item.id || item._id) === (lesson.id || lesson._id)) }
onMounted(loadLessons)
</script>

<template>
  <section class="page-section">
    <p class="eyebrow">Find a session</p><h1>Lessons for active, creative afternoons.</h1><p class="lede">Choose from practical sessions with clear prices, locations, teachers and spaces left.</p>
    <form class="lesson-toolbar" @submit.prevent="loadLessons(true)"><label class="field">Search<input v-model="search" type="search" placeholder="Topic, location, price or spaces" /></label><label class="field">Teacher<input v-model="teacher" type="search" placeholder="First or last name" /></label><label class="field">Sort by<select v-model="sortBy"><option value="subject">Subject</option><option value="location">Location</option><option value="price">Price</option><option value="space">Spaces</option></select></label><label class="field">Order<select v-model="direction"><option value="asc">Ascending</option><option value="desc">Descending</option></select></label><button class="button button-primary" type="submit" :disabled="isLoading">{{ isLoading ? 'Applying…' : 'Apply filters' }}</button></form>
    <p v-if="hasAppliedFilters && filterMessage" class="filter-feedback" :class="`filter-feedback--${filterMessageType}`" role="status" aria-live="polite">{{ filterMessage }}</p>
    <div v-if="isLoading" class="state" role="status" aria-live="polite"><div><div class="loading-indicator" aria-hidden="true"></div><p>Loading lessons…</p></div></div>
    <div v-else-if="errorMessage" class="state state-error" role="alert"><div><h2>We could not load the lessons.</h2><p>{{ errorMessage }}</p><button class="button button-primary" type="button" @click="loadLessons">Try again</button></div></div>
    <div v-else-if="lessons.length === 0" class="state"><div><h2>No lessons match those filters.</h2><p>Try a different search or teacher name.</p></div></div>
    <div v-else class="lesson-grid"><LessonCard v-for="lesson in lessons" :key="lesson.id || lesson._id" :lesson="lesson" :in-cart="inCart(lesson)" :is-adding="addingId === (lesson.id || lesson._id)" @add="addToCart" /></div>
  </section>
</template>
