<script setup>
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
defineProps({ lesson: { type: Object, required: true }, inCart: { type: Boolean, default: false } })
defineEmits(['add'])

function imageUrl(path) {
  if (!path) return `${apiBaseUrl}/images/lesson.svg`
  return path.startsWith('http') ? path : `${apiBaseUrl}${path}`
}
</script>

<template>
  <article class="lesson-card">
    <img class="lesson-card__image" :src="imageUrl(lesson.image)" :alt="`${lesson.topic} lesson`" />
    <div class="lesson-card__body">
      <div class="activity-card__top"><span class="activity-card__category">{{ lesson.subject }}</span><span class="activity-card__price">${{ Number(lesson.price).toLocaleString('en-US') }}</span></div>
      <h2>{{ lesson.topic }}</h2>
      <p>{{ lesson.description || 'A practical, friendly session led by an experienced teacher.' }}</p>
      <div class="activity-card__meta"><span>{{ lesson.location }}</span><span>{{ lesson.space }} spaces left</span><span>{{ lesson.teacherFirstName }} {{ lesson.teacherLastName }}</span></div>
      <button class="button button-primary lesson-card__button" type="button" :aria-label="`${lesson.topic}: ${inCart ? 'already in cart' : lesson.space === 0 ? 'no spaces left' : 'add to cart'}`" :disabled="lesson.space === 0 || inCart" @click="$emit('add', lesson)">{{ inCart ? 'In cart' : lesson.space === 0 ? 'Full' : 'Add to cart' }}</button>
    </div>
  </article>
</template>
