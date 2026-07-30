'use client';
import Header from '../../components/Header'
import DayCard from '../../components/DayCard'
import CourseHeader from '../../components/CourseHeader'
import { useEffect, useState } from 'react'
import { getCourseInfo, getCourseDays, toggleDay } from '../../utils/api'
import { useApp } from '../../context/AppContext'

export default function MyCoursesPage() {
  const [info, setInfo] = useState(null)
  const [days, setDays] = useState([])
  const { lang } = useApp()

  useEffect(()=>{
    fetchData()
  },[])

  async function fetchData(){
    const ci = await getCourseInfo()
    const ds = await getCourseDays()
    setInfo(ci)
    setDays(ds)
  }

  async function handleStart(){
    const next = days.find(d=>!d.is_completed)
    if(!next) return
    await toggleDay(next.id)
    fetchData()
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0F172A] transition-colors duration-200">
      <Header />
      <CourseHeader info={info} progressPercent={info ? Math.round((info.progress_completed/info.progress_total)*100) : 0} onStart={handleStart} />
      <main className="container-centered p-6">
        <div className="space-y-4">
          {days.length > 0 ? days.map(d=> (
            <DayCard key={d.id} day={{seq: d.seq, title: d.title, slides: d.slides, is_completed: d.is_completed, id: d.id}} onToggle={async ()=>{await toggleDay(d.id); fetchData()}} />
          )) : (
            [
              {id:1, seq:'01', title:'Day01', slides:2, is_completed:false},
              {id:2, seq:'02', title:'Day02', slides:1, is_completed:false},
              {id:3, seq:'03', title:'Day03', slides:2, is_completed:false},
              {id:4, seq:'04', title:'Day04', slides:3, is_completed:false},
            ].map(d=> <DayCard key={d.id} day={d} onToggle={()=>{}} />)
          )}
        </div>
      </main>
    </div>
  )
}
