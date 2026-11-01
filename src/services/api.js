import { mockActivities } from '../data/mockActivities'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true'

function makeReference() {
  return `BF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function requestWithThen(path, options = {}) {
  if (!apiBaseUrl) {
    return Promise.reject(new Error('The API address has not been configured. Add VITE_API_BASE_URL and try again.'))
  }

  return fetch(`${apiBaseUrl}${path}`, options)
    .catch(() => {
      throw new Error('We could not reach the service. Check your connection and try again.')
    })
    .then((response) => response.json().catch(() => {
      throw new Error('The service returned an invalid response. Please try again later.')
    }).then((result) => {
      if (!response.ok || !result.success) throw new Error(result.message || 'Something went wrong. Please try again.')
      return result.data
    }))
}

function toLesson(activity) {
  return {
    _id: activity._id,
    id: activity._id,
    topic: activity.name,
    subject: activity.category,
    location: activity.location || 'Main campus',
    price: activity.price * 1000,
    space: Math.max(0, (activity.capacity || 0) - (activity.placesBooked || 0)),
    teacherFirstName: activity.teacherFirstName || 'Course',
    teacherLastName: activity.teacherLastName || 'team',
    image: activity.image || '/images/lesson.svg',
    description: activity.description,
    schedule: activity.schedule,
  }
}

async function request(path, options = {}) {
  if (!apiBaseUrl) {
    throw new Error('The API address has not been configured. Add VITE_API_BASE_URL and try again.')
  }

  let response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, options)
  } catch {
    throw new Error('We could not reach the service. Check your connection and try again.')
  }

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error('The service returned an invalid response. Please try again later.')
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Something went wrong. Please try again.')
  }

  return result.data
}

export async function getActivities() {
  if (useMockData) return mockActivities.filter((activity) => activity.isActive)
  return request('/api/activities')
}

export async function getActivity(id) {
  if (useMockData) {
    const activity = mockActivities.find((item) => item._id === id && item.isActive)
    if (!activity) throw new Error('Activity not found.')
    return activity
  }
  return request(`/api/activities/${encodeURIComponent(id)}`)
}

export async function createBooking(booking) {
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 450))
    return { reference: makeReference() }
  }

  return request('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
}

export function getLessons(filters = {}) {
  if (useMockData) {
    let lessons = mockActivities.filter((activity) => activity.isActive).map(toLesson)
    const search = String(filters.search || '').toLowerCase()
    const teacher = String(filters.teacher || '').toLowerCase()
    if (search) lessons = lessons.filter((lesson) => [lesson.topic, lesson.location, lesson.price, lesson.space].join(' ').toLowerCase().includes(search))
    if (teacher) lessons = lessons.filter((lesson) => `${lesson.teacherFirstName} ${lesson.teacherLastName}`.toLowerCase().includes(teacher))
    const direction = filters.direction === 'desc' ? -1 : 1
    lessons.sort((a, b) => {
      const field = filters.sortBy === 'price' ? 'price' : filters.sortBy === 'space' ? 'space' : filters.sortBy === 'location' ? 'location' : 'subject'
      return String(a[field]).localeCompare(String(b[field]), undefined, { numeric: true }) * direction
    })
    return Promise.resolve(lessons)
  }

  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value) })
  return requestWithThen(`/lessons?${params.toString()}`)
}

export function updateLessonSpace(id, space) {
  if (useMockData) return Promise.resolve({ id, _id: id, space })
  return requestWithThen(`/lessons/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ space }),
  })
}

export function submitOrder(order) {
  if (useMockData) return Promise.resolve({ reference: makeReference(), ...order })
  return requestWithThen('/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
}
