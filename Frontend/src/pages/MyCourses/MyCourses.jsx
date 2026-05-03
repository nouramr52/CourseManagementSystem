import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import './MyCourses.css'

// Shared catalog — same data as StudentCourses
const ALL_COURSES = [
  {
    id: 101,
    name: 'Database Systems',
    instructor: 'Dr. Sarah Johnson',
    dept: 'Computer Science',
    color: '#4f46e5',
    deptBg: '#eef2ff',
    icon: '🗄️',
    schedule: 'Mon / Wed',
    time: '10:00 AM – 11:30 AM',
    credits: 3,
    level: 'Intermediate',
    description: 'Comprehensive course covering database design, SQL, normalization, and data management principles.',
    modules: 12,
    duration: '16 weeks',
    progress: 75,
    assignments: 8,
    completedAssignments: 6,
    nextClass: 'Monday, 10:00 AM',
  },
  {
    id: 102,
    name: 'Software Engineering',
    instructor: 'Prof. Michael Chen',
    dept: 'Computer Science',
    color: '#06b6d4',
    deptBg: '#ecfeff',
    icon: '⚙️',
    schedule: 'Tue / Thu',
    time: '1:00 PM – 2:30 PM',
    credits: 3,
    level: 'Intermediate',
    description: 'Learn software development lifecycle, agile methodologies, and best practices for building scalable applications.',
    modules: 15,
    duration: '16 weeks',
    progress: 60,
    assignments: 10,
    completedAssignments: 6,
    nextClass: 'Tuesday, 1:00 PM',
  },
  {
    id: 103,
    name: 'Operating Systems',
    instructor: 'Dr. Emily Rodriguez',
    dept: 'Computer Science',
    color: '#10b981',
    deptBg: '#ecfdf5',
    icon: '💻',
    schedule: 'Mon / Fri',
    time: '3:00 PM – 4:30 PM',
    credits: 3,
    level: 'Advanced',
    description: 'Deep dive into OS concepts including processes, threads, memory management, file systems, and concurrency.',
    modules: 10,
    duration: '16 weeks',
    progress: 45,
    assignments: 6,
    completedAssignments: 3,
    nextClass: 'Monday, 3:00 PM',
  },
  {
    id: 104,
    name: 'Web Development',
    instructor: 'Prof. David Kim',
    dept: 'Information Systems',
    color: '#8b5cf6',
    deptBg: '#f5f3ff',
    icon: '🌐',
    schedule: 'Wed / Fri',
    time: '11:00 AM – 12:30 PM',
    credits: 3,
    level: 'Beginner',
    description: 'Modern web technologies including HTML5, CSS3, JavaScript, React, and Node.js.',
    modules: 14,
    duration: '16 weeks',
    progress: 90,
    assignments: 12,
    completedAssignments: 11,
    nextClass: 'Wednesday, 11:00 AM',
  },
  {
    id: 105,
    name: 'Data Structures & Algorithms',
    instructor: 'Dr. James Carter',
    dept: 'Computer Science',
    color: '#f59e0b',
    deptBg: '#fffbeb',
    icon: '🧮',
    schedule: 'Mon / Wed / Fri',
    time: '9:00 AM – 10:00 AM',
    credits: 4,
    level: 'Intermediate',
    description: 'Fundamental data structures and algorithm design techniques.',
    modules: 18,
    duration: '16 weeks',
    progress: 30,
    assignments: 9,
    completedAssignments: 3,
    nextClass: 'Monday, 9:00 AM',
  },
  {
    id: 106,
    name: 'Machine Learning',
    instructor: 'Prof. Aisha Patel',
    dept: 'Data Science',
    color: '#ef4444',
    deptBg: '#fef2f2',
    icon: '🤖',
    schedule: 'Tue / Thu',
    time: '10:00 AM – 11:30 AM',
    credits: 4,
    level: 'Advanced',
    description: 'Introduction to machine learning algorithms, neural networks, and practical applications.',
    modules: 16,
    duration: '16 weeks',
    progress: 20,
    assignments: 8,
    completedAssignments: 2,
    nextClass: 'Tuesday, 10:00 AM',
  },
  {
    id: 107,
    name: 'Computer Networks',
    instructor: 'Dr. Lisa Wang',
    dept: 'Computer Science',
    color: '#06b6d4',
    deptBg: '#ecfeff',
    icon: '🔗',
    schedule: 'Mon / Wed',
    time: '2:00 PM – 3:30 PM',
    credits: 3,
    level: 'Intermediate',
    description: 'Fundamentals of computer networking including TCP/IP, routing, switching, and network security.',
    modules: 12,
    duration: '16 weeks',
    progress: 55,
    assignments: 7,
    completedAssignments: 4,
    nextClass: 'Monday, 2:00 PM',
  },
  {
    id: 108,
    name: 'Cybersecurity Fundamentals',
    instructor: 'Prof. Robert Hayes',
    dept: 'Information Security',
    color: '#10b981',
    deptBg: '#ecfdf5',
    icon: '🔒',
    schedule: 'Tue / Thu',
    time: '3:00 PM – 4:30 PM',
    credits: 3,
    level: 'Beginner',
    description: 'Core concepts of cybersecurity including threat analysis, cryptography, and ethical hacking.',
    modules: 11,
    duration: '16 weeks',
    progress: 10,
    assignments: 5,
    completedAssignments: 1,
    nextClass: 'Tuesday, 3:00 PM',
  },
]

export default function MyCourses() {
  const navigate = useNavigate()
  const [enrolledIds, setEnrolledIds] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    const stored = localStorage.getItem('enrolledCourses')
    if (stored) setEnrolledIds(JSON.parse(stored))
  }, [navigate])

  const enrolledCourses = ALL_COURSES.filter(c => enrolledIds.includes(c.id))

  const filtered = enrolledCourses.filter(c => {
    if (filter === 'in-progress') return c.progress > 0 && c.progress < 100
    if (filter === 'completed') return c.progress === 100
    if (filter === 'not-started') return c.progress === 0
    return true
  })

  const totalCredits = enrolledCourses.reduce((s, c) => s + c.credits, 0)
  const totalAssignments = enrolledCourses.reduce((s, c) => s + c.assignments, 0)
  const completedAssignments = enrolledCourses.reduce((s, c) => s + c.completedAssignments, 0)
  const avgProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((s, c) => s + c.progress, 0) / enrolledCourses.length)
    : 0

  const handleUnenroll = (courseId) => {
    const updated = enrolledIds.filter(id => id !== courseId)
    setEnrolledIds(updated)
    localStorage.setItem('enrolledCourses', JSON.stringify(updated))
  }

  return (
    <>
      <Navbar />
      <main className="mc-page">
        <div className="mc-container">

          {/* Header */}
          <div className="mc-header">
            <div>
              <h1 className="mc-title">
                My <span className="mc-highlight">Courses</span>
              </h1>
              <p className="mc-subtitle">
                Track your progress and manage your enrolled courses.
              </p>
            </div>
            <button className="mc-browse-btn" onClick={() => navigate('/student/courses')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              Browse Courses
            </button>
          </div>

          {/* Stats */}
          {enrolledCourses.length > 0 && (
            <div className="mc-stats">
              <div className="mc-stat">
                <div className="mc-stat__icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>📚</div>
                <div>
                  <p className="mc-stat__value">{enrolledCourses.length}</p>
                  <p className="mc-stat__label">Enrolled Courses</p>
                </div>
              </div>
              <div className="mc-stat">
                <div className="mc-stat__icon" style={{ background: '#ecfdf5', color: '#10b981' }}>✅</div>
                <div>
                  <p className="mc-stat__value">{completedAssignments}/{totalAssignments}</p>
                  <p className="mc-stat__label">Assignments Done</p>
                </div>
              </div>
              <div className="mc-stat">
                <div className="mc-stat__icon" style={{ background: '#ecfeff', color: '#06b6d4' }}>📊</div>
                <div>
                  <p className="mc-stat__value">{avgProgress}%</p>
                  <p className="mc-stat__label">Avg. Progress</p>
                </div>
              </div>
              <div className="mc-stat">
                <div className="mc-stat__icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>⭐</div>
                <div>
                  <p className="mc-stat__value">{totalCredits}</p>
                  <p className="mc-stat__label">Total Credits</p>
                </div>
              </div>
            </div>
          )}

          {/* Filter tabs */}
          {enrolledCourses.length > 0 && (
            <div className="mc-tabs">
              {[
                { key: 'all', label: 'All Courses', count: enrolledCourses.length },
                { key: 'in-progress', label: 'In Progress', count: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length },
                { key: 'completed', label: 'Completed', count: enrolledCourses.filter(c => c.progress === 100).length },
                { key: 'not-started', label: 'Not Started', count: enrolledCourses.filter(c => c.progress === 0).length },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`mc-tab ${filter === tab.key ? 'mc-tab--active' : ''}`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                  <span className="mc-tab__count">{tab.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {enrolledCourses.length === 0 ? (
            <div className="mc-empty">
              <div className="mc-empty__icon">🎓</div>
              <h3 className="mc-empty__title">No courses yet</h3>
              <p className="mc-empty__text">
                You haven't enrolled in any courses. Browse the catalog to get started.
              </p>
              <button className="mc-empty__btn" onClick={() => navigate('/student/courses')}>
                Browse Courses
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mc-empty">
              <div className="mc-empty__icon">📭</div>
              <p className="mc-empty__text">No courses in this category.</p>
            </div>
          ) : (
            <div className="mc-grid">
              {filtered.map(course => (
                <div key={course.id} className="mc-card">
                  <div className="mc-card__header">
                    <div className="mc-card__icon" style={{ background: course.deptBg, color: course.color }}>
                      {course.icon}
                    </div>
                    <div className="mc-card__info">
                      <h3 className="mc-card__title">{course.name}</h3>
                      <p className="mc-card__instructor">{course.instructor}</p>
                    </div>
                    <div className="mc-card__progress-badge" style={{ background: `${course.color}15`, color: course.color }}>
                      {course.progress}%
                    </div>
                  </div>

                  <p className="mc-card__description">{course.description}</p>

                  <div className="mc-card__stats">
                    <div className="mc-card__stat">
                      <span className="mc-card__stat-label">Modules</span>
                      <span className="mc-card__stat-value">
                        {Math.round(course.modules * course.progress / 100)}/{course.modules}
                      </span>
                    </div>
                    <div className="mc-card__stat">
                      <span className="mc-card__stat-label">Assignments</span>
                      <span className="mc-card__stat-value">{course.completedAssignments}/{course.assignments}</span>
                    </div>
                    <div className="mc-card__stat">
                      <span className="mc-card__stat-label">Schedule</span>
                      <span className="mc-card__stat-value">{course.schedule}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mc-card__progress">
                    <div className="mc-card__progress-label">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="mc-card__progress-bar">
                      <div
                        className="mc-card__progress-fill"
                        style={{ width: `${course.progress}%`, background: course.color }}
                      />
                    </div>
                  </div>

                  <div className="mc-card__footer">
                    <div className="mc-card__next">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Next: {course.nextClass}
                    </div>
                    <div className="mc-card__actions">
                      <button
                        className="mc-card__btn mc-card__btn--details"
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        View Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        className="mc-card__btn mc-card__btn--unenroll"
                        onClick={() => handleUnenroll(course.id)}
                        title="Unenroll"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Overall progress chart */}
          {enrolledCourses.length > 0 && (
            <div className="mc-section">
              <div className="mc-section-header">
                <h2 className="mc-section-title">Overall Progress</h2>
                <p className="mc-section-subtitle">Your completion rate across all enrolled courses</p>
              </div>
              <div className="mc-progress-chart">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="mc-progress-item">
                    <div className="mc-progress-info">
                      <div className="mc-progress-name">
                        <span className="mc-progress-icon">{course.icon}</span>
                        {course.name}
                      </div>
                      <span className="mc-progress-pct" style={{ color: course.color }}>{course.progress}%</span>
                    </div>
                    <div className="mc-progress-bar">
                      <div
                        className="mc-progress-fill"
                        style={{ width: `${course.progress}%`, background: course.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
