<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import HomeView from './views/HomeView.vue'
import ActivitiesView from './views/ActivitiesView.vue'
import ActivityDetailsView from './views/ActivityDetailsView.vue'
import BookingConfirmationView from './views/BookingConfirmationView.vue'

const route = ref(window.location.hash || '#/')
const theme = ref('light')

const currentView = computed(() => {
  const path = route.value.slice(1) || '/'

  if (path === '/') return { component: HomeView, key: 'home' }
  if (path === '/activities') return { component: ActivitiesView, key: 'activities' }
  if (path.startsWith('/activities/')) {
    return {
      component: ActivityDetailsView,
      key: 'details',
      activityId: decodeURIComponent(path.replace('/activities/', '')),
    }
  }
  if (path.startsWith('/booking-confirmation/')) {
    return {
      component: BookingConfirmationView,
      key: 'confirmation',
      reference: decodeURIComponent(path.replace('/booking-confirmation/', '')),
    }
  }

  return { component: HomeView, key: 'not-found', notFound: true }
})

function updateRoute() {
  route.value = window.location.hash || '#/'
}

function setTheme(nextTheme) {
  theme.value = nextTheme
  document.documentElement.dataset.theme = nextTheme
  localStorage.setItem('bright-futures-theme', nextTheme)
}

function toggleTheme() {
  setTheme(theme.value === 'light' ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('bright-futures-theme')
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  setTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemTheme)
  window.addEventListener('hashchange', updateRoute)
})
onUnmounted(() => window.removeEventListener('hashchange', updateRoute))
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <header class="site-header">
    <a class="brand" href="#/" aria-label="Bright Futures home">Bright Futures</a>
    <nav aria-label="Main navigation">
      <a href="#/" :aria-current="currentView.key === 'home' ? 'page' : undefined">Home</a>
      <a href="#/activities" :aria-current="currentView.key === 'activities' ? 'page' : undefined">
        Activities
      </a>
      <button
        class="theme-toggle"
        type="button"
        :aria-label="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
        :aria-pressed="theme === 'dark'"
        @click="toggleTheme"
      >
        <span aria-hidden="true">{{ theme === 'light' ? '☾' : '☀' }}</span>
        <span class="theme-toggle__label">{{ theme === 'light' ? 'Dark' : 'Light' }}</span>
      </button>
    </nav>
  </header>

  <main id="main-content">
    <section v-if="currentView.notFound" class="not-found page-section">
      <p class="eyebrow">Page not found</p>
      <h1>That page has moved or does not exist.</h1>
      <a class="button button-primary" href="#/activities">Browse activities</a>
    </section>
    <component
      v-else
      :is="currentView.component"
      :key="route"
      :activity-id="currentView.activityId"
      :reference="currentView.reference"
    />
  </main>

  <footer class="site-footer">
    <p>Bright Futures After-School Classes</p>
    <a href="mailto:hello@brightfutures.example">hello@brightfutures.example</a>
  </footer>
</template>
