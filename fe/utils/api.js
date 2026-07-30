const API_BASE = 'http://localhost:8000/api'

export async function getCourseInfo(){
  const r = await fetch(`${API_BASE}/course/info`)
  return r.json()
}

export async function getCourseDays(){
  const r = await fetch(`${API_BASE}/course/days`)
  return r.json()
}

export async function toggleDay(id){
  const r = await fetch(`${API_BASE}/course/toggle-day/${id}`,{method:'POST'})
  return r.json()
}
