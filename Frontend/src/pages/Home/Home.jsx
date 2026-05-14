import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import Hero from '../../components/home/Hero/Hero'
import Features from '../../components/home/Features/Features'
import Roles from '../../components/home/Roles/Roles'
import Courses from '../../components/home/Courses/Courses'
import Testimonials from '../../components/home/Testimonials/Testimonials'
import CallToAction from '../../components/home/CallToAction/CallToAction'
import LoggedInHome from './LoggedInHome'

function getUser() {
  try {
    const token = localStorage.getItem('token')
    const raw   = localStorage.getItem('user')
    if (token && raw && raw !== 'undefined') return JSON.parse(raw)
  } catch {}
  return null
}

export default function Home() {
  const location = useLocation()
  const [user, setUser] = useState(getUser)   // initialise synchronously — no flash

  // Re-check whenever the route changes (covers navigate('/') after logout)
  useEffect(() => {
    setUser(getUser())
  }, [location])

  // Also re-check when another tab or the Navbar dispatches a storage event
  useEffect(() => {
    const onStorage = () => setUser(getUser())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  if (user) return <LoggedInHome user={user} />

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Roles />
        <Courses />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
