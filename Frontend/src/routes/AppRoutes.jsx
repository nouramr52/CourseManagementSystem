import React from 'react'
import { Routes, Route } from 'react-router-dom'
import InstructorDashboard from '../pages/InstructorDashboard/InstructorDashboard'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import VerifyEmail from '../pages/VerifyEmail/VerifyEmail'
import Dashboard from '../pages/Dashboard/Dashboard'
import CourseDetails from '../pages/CourseDetails/CourseDetails'
import StudentCourses from '../pages/StudentCourses/StudentCourses'
import MyCourses from '../pages/MyCourses/MyCourses'
import StudentSchedule from '../pages/StudentSchedule/StudentSchedule'
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard'
import AuthCallback from '../pages/AuthCallback/AuthCallback'
import CompleteProfile from '../pages/CompleteProfile/CompleteProfile'
import PublicCatalog from '../pages/PublicCatalog/PublicCatalog'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                     element={<Home />} />
      <Route path="/login"                element={<Login />} />
      <Route path="/signup"               element={<SignUp />} />
      <Route path="/verify-email"         element={<VerifyEmail />} />
      <Route path="/dashboard"            element={<Dashboard />} />
      <Route path="/courses"              element={<PublicCatalog />} />
      <Route path="/course/:id"           element={<CourseDetails />} />
      <Route path="/student/courses"      element={<StudentCourses />} />
      <Route path="/student/my-courses"   element={<MyCourses />} />
      <Route path="/student/schedule"     element={<StudentSchedule />} />
      <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
      <Route path="/admin/dashboard"      element={<AdminDashboard />} />
      <Route path="/auth/callback"        element={<AuthCallback />} />
      <Route path="/complete-profile"     element={<CompleteProfile />} />
    </Routes>
  )
}
