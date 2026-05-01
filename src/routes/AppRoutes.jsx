import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import Dashboard from '../pages/Dashboard/Dashboard'
import CourseDetails from '../pages/CourseDetails/CourseDetails'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/course/:id" element={<CourseDetails />} />
    </Routes>
  )
}
