<script setup>
defineProps({
  activity: { type: Object, required: true },
})

function availablePlaces(activity) {
  return Math.max(activity.capacity - activity.placesBooked, 0)
}
</script>

<template>
  <a class="activity-card" :href="`#/activities/${activity._id}`" :aria-label="`View ${activity.name}`">
    <div class="activity-card__top">
      <span class="activity-card__category">{{ activity.category }}</span>
      <span class="activity-card__price">₦{{ Number(activity.price).toLocaleString('en-NG') }} per session</span>
    </div>
    <h3>{{ activity.name }}</h3>
    <p>{{ activity.description }}</p>
    <div class="activity-card__meta" aria-label="Activity details">
      <span>Ages {{ activity.minAge }} to {{ activity.maxAge }}</span>
      <span>{{ activity.schedule }}</span>
      <span>{{ availablePlaces(activity) }} places left</span>
    </div>
  </a>
</template>
