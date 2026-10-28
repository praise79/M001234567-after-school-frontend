import { mockActivities } from '../data/mockActivities'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true'

function makeReference() {
  return `BF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
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
