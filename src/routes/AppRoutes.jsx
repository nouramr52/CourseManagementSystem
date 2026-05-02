import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import InstructorDashboard from '../pages/InstructorDashboard/InstructorDashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
    </Routes>
  )
}
