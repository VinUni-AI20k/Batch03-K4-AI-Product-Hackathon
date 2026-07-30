const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options)
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }
  return response.json()
}

export function getCourseInfo() {
  return request('/course/info')
}

export function getCourseDays() {
  return request('/course/days')
}

export function toggleDay(id) {
  return request(`/course/toggle-day/${id}`, { method: 'POST' })
}

export function sendChatMessage(payload) {
  return request('/v1/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
