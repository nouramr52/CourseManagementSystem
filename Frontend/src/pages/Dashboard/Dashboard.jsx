import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import { getMyEnrollments } from '../../api/enrollmentApi'
import { getMe } from '../../api/userApi'
import './Dashboard.css'
import './DashboardStudent.css'

// Consistent colour palette per course (cycles through)
const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']
const ICONS  = ['📖', '⚙️', '🌐', '💻', '🔐', '📊', '🤖', '📚']

const DEPT_COLORS = {
  'Computer Science':        '#4f46e5',
  'Software Engineering':    '#06b6d4',
  'Information Systems':     '#10b981',
  'Data Science':            '#f59e0b',
  'Artificial Intelligence': '#8b5cf6',
  'Cybersecurity':           '#ef4444',
  'Networking':              '#06b6d4',
  'Mathematics':             '#10b981',
  'General':                 '#4f46e5',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user,        setUser]        = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)

  useEffect(() => {
    const token   = localStorage.getItem('token')
    const rawUser = localStorage.getItem('user')
    let parsed    = null

    try {
      if (rawUser && rawUser !== 'undefined') parsed = JSON.parse(rawUser)
    } catch { localStorage.removeItem('user') }

    if (!token) { navigate('/login'); return }

    const role = parsed?.role?.toUpperCase()
    if (role === 'ADMIN')       { navigate('/admin/dashboard');      return }
    if (role === 'INSTRUCTOR')  { navigate('/instructor/dashboard'); return }

    setUser(parsed)

    // Load fresh user (for createdAt) + enrollments in parallel.
    // getMe() failing (e.g. server not restarted yet) must NOT block enrollments.
    Promise.allSettled([getMe(), getMyEnrollments()])
      .then(([meResult, enrollResult]) => {
        if (meResult.status === 'fulfilled') {
          setUser(prev => ({ ...prev, ...meResult.value.data }))
        }
        if (enrollResult.status === 'fulfilled') {
          setEnrollments(enrollResult.value.data.filter(e => e.status === 'ACTIVE'))
        } else {
          setError('Failed to load your courses.')
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
      </div>
    )
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalCourses   = enrollments.length
  const totalScheduled = enrollments.reduce((n, e) => n + (e.course?.schedules?.length ?? 0), 0)

  // Next upcoming class — find the earliest schedule slot by day order
  const DAY_ORDER = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const allSlots = enrollments.flatMap(e =>
    (e.course?.schedules ?? []).map(s => ({ ...s, courseTitle: e.course.title }))
  )
  const nextSlot = allSlots.sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  )[0]

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <div className="dashboard__container">

          {/* Header */}
          <div className="dashboard__header">
            <div>
              <h1 className="dashboard__title">
                Welcome back, <span className="dashboard__highlight">{user.name || 'Student'}</span>!
              </h1>
              <p className="dashboard__subtitle">
                Here's your learning overview and enrolled courses.
              </p>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="dashboard__grid">
            <div className="dashboard__card">
              <div className="dashboard__card-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>📚</div>
              <h3 className="dashboard__card-title">Enrolled Courses</h3>
              <p className="dashboard__card-value">{loading ? '—' : totalCourses}</p>
              <p className="dashboard__card-label">Active enrollments</p>
            </div>

            <div className="dashboard__card">
              <div className="dashboard__card-icon" style={{ background: '#ecfeff', color: '#06b6d4' }}>🗓️</div>
              <h3 className="dashboard__card-title">Weekly Sessions</h3>
              <p className="dashboard__card-value">{loading ? '—' : totalScheduled}</p>
              <p className="dashboard__card-label">Classes per week</p>
            </div>

            <div className="dashboard__card">
              <div className="dashboard__card-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>⏰</div>
              <h3 className="dashboard__card-title">Next Class</h3>
              <p className="dashboard__card-value" style={{ fontSize: '1.1rem' }}>
                {loading ? '—' : nextSlot ? nextSlot.day : 'None'}
              </p>
              <p className="dashboard__card-label">
                {loading ? '' : nextSlot ? `${nextSlot.startTime} · ${nextSlot.courseTitle}` : 'No upcoming classes'}
              </p>
            </div>

            <div className="dashboard__card">
              <div className="dashboard__card-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>🎓</div>
              <h3 className="dashboard__card-title">Member Since</h3>
              <p className="dashboard__card-value" style={{ fontSize: '1.1rem' }}>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : '—'}
              </p>
              <p className="dashboard__card-label">Account created</p>
            </div>
          </div>

          {/* ── Quick Access ── */}
          <div className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Student Portal</h2>
              <p className="dashboard__section-subtitle">Quick access to your learning tools</p>
            </div>
            <div className="ds-quick-access">
              <div className="ds-quick-card" onClick={() => navigate('/student/courses')}>
                <div className="ds-quick-card__icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>🔍</div>
                <div className="ds-quick-card__content">
                  <h3 className="ds-quick-card__title">Browse Courses</h3>
                  <p className="ds-quick-card__desc">Explore all available courses and enroll</p>
                </div>
                <svg className="ds-quick-card__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="ds-quick-card" onClick={() => navigate('/student/my-courses')}>
                <div className="ds-quick-card__icon" style={{ background: '#ecfdf5', color: '#10b981' }}>📚</div>
                <div className="ds-quick-card__content">
                  <h3 className="ds-quick-card__title">My Courses</h3>
                  <p className="ds-quick-card__desc">View and manage your enrolled courses</p>
                </div>
                <svg className="ds-quick-card__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="ds-quick-card" onClick={() => navigate('/student/schedule')}>
                <div className="ds-quick-card__icon" style={{ background: '#ecfeff', color: '#06b6d4' }}>🗓️</div>
                <div className="ds-quick-card__content">
                  <h3 className="ds-quick-card__title">My Schedule</h3>
                  <p className="ds-quick-card__desc">View your weekly class timetable</p>
                </div>
                <svg className="ds-quick-card__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── My Courses ── */}
          <div className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">My Courses</h2>
              <p className="dashboard__section-subtitle">Your currently enrolled courses</p>
            </div>

            {loading ? (
              <div className="dashboard__courses">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="ds-course-skeleton" />
                ))}
              </div>
            ) : error ? (
              <div className="ds-error">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="ds-empty">
                <span>🎓</span>
                <p>You haven't enrolled in any courses yet.</p>
                <button className="ds-empty-btn" onClick={() => navigate('/student/courses')}>
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="dashboard__courses">
                {enrollments.map((enrollment, idx) => {
                  const course = enrollment.course
                  const color  = DEPT_COLORS[course.dept] || COLORS[idx % COLORS.length]
                  const icon   = course.icon || ICONS[idx % ICONS.length]
                  const enrolledDate = new Date(enrollment.enrollmentDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })

                  return (
                    <div
                      key={enrollment.id}
                      className="course-card"
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      <div className="course-card__header">
                        <div className="course-card__icon" style={{ background: `${color}18`, color }}>
                          {icon}
                        </div>
                        <div className="course-card__info">
                          <h3 className="course-card__title">{course.title}</h3>
                          <p className="course-card__instructor">
                            {course.instructor?.name ?? 'Unknown Instructor'}
                          </p>
                        </div>
                        {course.dept && (
                          <span className="course-card__progress-badge" style={{ background: `${color}15`, color }}>
                            {course.dept}
                          </span>
                        )}
                      </div>

                      {course.description && (
                        <p className="course-card__description">{course.description}</p>
                      )}

                      {/* Schedule info */}
                      {course.schedules?.length > 0 && (
                        <div className="course-card__stats">
                          <div className="course-card__stat">
                            <span className="course-card__stat-label">Days</span>
                            <span className="course-card__stat-value">
                              {course.schedules.map(s => s.day.slice(0, 3)).join(' / ')}
                            </span>
                          </div>
                          <div className="course-card__stat">
                            <span className="course-card__stat-label">Time</span>
                            <span className="course-card__stat-value">
                              {course.schedules[0].startTime} – {course.schedules[0].endTime}
                            </span>
                          </div>
                          <div className="course-card__stat">
                            <span className="course-card__stat-label">Sessions</span>
                            <span className="course-card__stat-value">{course.schedules.length}× / week</span>
                          </div>
                        </div>
                      )}

                      <div className="course-card__footer">
                        <div className="course-card__next">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          Enrolled {enrolledDate}
                        </div>
                        <button
                          className="course-card__button"
                          onClick={(e) => { e.stopPropagation(); navigate(`/course/${course.id}`) }}
                        >
                          View Details
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Schedule Overview ── */}
          {!loading && enrollments.length > 0 && (
            <div className="dashboard__section">
              <div className="dashboard__section-header">
                <h2 className="dashboard__section-title">Weekly Schedule</h2>
                <p className="dashboard__section-subtitle">All your class sessions at a glance</p>
              </div>

              <div className="progress-chart">
                {enrollments.map((enrollment, idx) => {
                  const course = enrollment.course
                  const color  = DEPT_COLORS[course.dept] || COLORS[idx % COLORS.length]
                  if (!course.schedules?.length) return null
                  return (
                    <div key={enrollment.id} className="progress-chart__item">
                      <div className="progress-chart__info">
                        <span className="progress-chart__name">{course.title}</span>
                        <span className="progress-chart__percentage" style={{ color }}>
                          {course.schedules.map(s => `${s.day.slice(0,3)} ${s.startTime}`).join(' · ')}
                        </span>
                      </div>
                      <div className="progress-chart__bar">
                        <div
                          className="progress-chart__fill"
                          style={{ width: '100%', background: color, opacity: 0.25 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
