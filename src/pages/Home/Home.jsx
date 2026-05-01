import React from 'react'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import Hero from '../../components/home/Hero/Hero'
import Features from '../../components/home/Features/Features'
import Roles from '../../components/home/Roles/Roles'
import Courses from '../../components/home/Courses/Courses'
import Testimonials from '../../components/home/Testimonials/Testimonials'
import CallToAction from '../../components/home/CallToAction/CallToAction'

export default function Home() {
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
