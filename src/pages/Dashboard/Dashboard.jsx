import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  // Sample course data
  const [courses] = useState([
    {
      id: 1,
      name: 'Database Systems',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      schedule: 'Mon / Wed',
      time: '10:00 AM',
      color: '#4f46e5',
      assignments: 8,
      completedAssignments: 6,
      nextClass: 'Monday, 10:00 AM',
      description: 'Learn database design, SQL, and data management',
      modules: 12,
      completedModules: 9
    },
    {
      id: 2,
      name: 'Software Engineering',
      instructor: 'Prof. Michael Chen',
      progress: 60,
      schedule: 'Tue / Thu',
      time: '1:00 PM',
      color: '#06b6d4',
      assignments: 10,
      completedAssignments: 6,
      nextClass: 'Tuesday, 1:00 PM',
      description: 'Software development lifecycle and best practices',
      modules: 15,
      completedModules: 9
    },
    {
      id: 3,
      name: 'Operating Systems',
      instructor: 'Dr. Emily Rodriguez',
      progress: 45,
      schedule: 'Mon / Fri',
      time: '3:00 PM',
      color: '#10b981',
      assignments: 6,
      completedAssignments: 3,
      nextClass: 'Monday, 3:00 PM',
      description: 'OS concepts, processes, and memory management',
      modules: 10,
      completedModules: 4
    },
    {
      id: 4,
      name: 'Web Development',
      instructor: 'Prof. David Kim',
      progress: 90,
      schedule: 'Wed / Fri',
      time: '11:00 AM',
      color: '#8b5cf6',
      assignments: 12,
      completedAssignments: 11,
      nextClass: 'Wednesday, 11:00 AM',
      description: 'Modern web technologies and frameworks',
      modules: 14,
      completedModules: 13
    }
  ])

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [navigate])

  const totalAssignments = courses.reduce((sum, course) => sum + course.assignments, 0)
  const completedAssignments = courses.reduce((sum, course) => sum + course.completedAssignments, 0)
  const averageProgress = Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`)
  }

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <div className="dashboard__container">
          <div className="dashboard__header">
            <div>
              <h1 className="dashboard__title">
                Welcome back, <span className="dashboard__highlight">{user.name || 'User'}</span>!
              </h1>
              <p className="dashboard__subtitle">
                Here's your learning progress and upcoming classes.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="dashboard__grid">
            <div className="dashboard__card">
              <div className="dashboard__card-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                📚
              </div>
              <h3 className="dashboard__card-title">Enrolled Courses</h3>
              <p className="dashboard__card-value">{courses.length}</p>
              <p className="dashboard__card-label">Active courses</p>
            </div>

            <div className="dashboard__card">
              <div className="dashboard__card-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>
                ✅
              </div>
              <h3 className="dashboard__card-title">Completed</h3>
              <p className="dashboard__card-value">{completedAssignments}</p>
              <p className="dashboard__card-label">Out of {totalAssignments} assignments</p>
            </div>

            <div className="dashboard__card">
              <div className="dashboard__card-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                ⏰
              </div>
              <h3 className="dashboard__card-title">Pending</h3>
              <p className="dashboard__card-value">{totalAssignments - completedAssignments}</p>
              <p className="dashboard__card-label">Tasks remaining</p>
            </div>

            <div className="dashboard__card">
              <div className="dashboard__card-icon" style={{ background: '#ecfeff', color: '#06b6d4' }}>
                📊
              </div>
              <h3 className="dashboard__card-title">Average Progress</h3>
              <p className="dashboard__card-value">{averageProgress}%</p>
              <p className="dashboard__card-label">Overall completion</p>
            </div>
          </div>

          {/* Course Progress Section */}
          <div className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">My Courses</h2>
              <p className="dashboard__section-subtitle">Click on a course to view details</p>
            </div>

            <div className="dashboard__courses">
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className="course-card"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="course-card__header">
                    <div className="course-card__icon" style={{ background: `${course.color}15`, color: course.color }}>
                      📖
                    </div>
                    <div className="course-card__info">
                      <h3 className="course-card__title">{course.name}</h3>
                      <p className="course-card__instructor">{course.instructor}</p>
                    </div>
                    <div className="course-card__progress-badge" style={{ background: `${course.color}15`, color: course.color }}>
                      {course.progress}%
                    </div>
                  </div>

                  <p className="course-card__description">{course.description}</p>

                  <div className="course-card__stats">
                    <div className="course-card__stat">
                      <span className="course-card__stat-label">Modules</span>
                      <span className="course-card__stat-value">{course.completedModules}/{course.modules}</span>
                    </div>
                    <div className="course-card__stat">
                      <span className="course-card__stat-label">Assignments</span>
                      <span className="course-card__stat-value">{course.completedAssignments}/{course.assignments}</span>
                    </div>
                    <div className="course-card__stat">
                      <span className="course-card__stat-label">Schedule</span>
                      <span className="course-card__stat-value">{course.schedule}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="course-card__progress">
                    <div className="course-card__progress-label">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="course-card__progress-bar">
                      <div 
                        className="course-card__progress-fill" 
                        style={{ width: `${course.progress}%`, background: course.color }}
                      />
                    </div>
                  </div>

                  <div className="course-card__footer">
                    <div className="course-card__next">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Next: {course.nextClass}
                    </div>
                    <button className="course-card__button">
                      View Details
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Progress Chart */}
          <div className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Overall Progress</h2>
              <p className="dashboard__section-subtitle">Your completion rate across all courses</p>
            </div>

            <div className="progress-chart">
              {courses.map((course) => (
                <div key={course.id} className="progress-chart__item">
                  <div className="progress-chart__info">
                    <span className="progress-chart__name">{course.name}</span>
                    <span className="progress-chart__percentage">{course.progress}%</span>
                  </div>
                  <div className="progress-chart__bar">
                    <div 
                      className="progress-chart__fill" 
                      style={{ width: `${course.progress}%`, background: course.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
