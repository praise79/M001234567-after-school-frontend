<script setup>
defineProps({
  activity: { type: Object, required: true },
})

function availablePlaces(activity) {
  return Math.max(activity.capacity - activity.placesBooked, 0)
}
</script>

<template>
  <article class="activity-card">
    <div class="activity-card__top">
      <span class="activity-card__category">{{ activity.category }}</span>
      <span class="activity-card__price">£{{ activity.price }} / session</span>
    </div>
    <h3>{{ activity.name }}</h3>
    <p>{{ activity.description }}</p>
    <div class="activity-card__meta" aria-label="Activity details">
      <span>Ages {{ activity.minAge }}–{{ activity.maxAge }}</span>
      <span>{{ activity.schedule }}</span>
      <span>{{ availablePlaces(activity) }} places left</span>
    </div>
    <a class="text-link" :href="`#/activities/${activity._id}`">View activity<span class="sr-only">: {{ activity.name }}</span></a>
  </article>
</template>
