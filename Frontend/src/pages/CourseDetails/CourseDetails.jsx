import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import { getCourseById } from '../../api/courseApi'
import { getMyEnrollments } from '../../api/enrollmentApi'
import './CourseDetails.css'

const DEPT_COLORS = {
  'Computer Science':        '#4f46e5',
  'Software Engineering':    '#06b6d4',
  'Information Systems':     '#10b981',
  'Data Science':            '#f59e0b',
  'Artificial Intelligence': '#8b5cf6',
  'Cybersecurity':           '#ef4444',
  'Networking':              '#06b6d4',
  'Mathematics':             '#10b981',
  'Physics':                 '#f59e0b',
  'General':                 '#4f46e5',
}

const DEFAULT_ICONS = ['🗄️','⚙️','🌐','💻','🔐','📊','🤖','📚','🧮','📡']

const MATERIAL_ICONS = {
  PDF:  '📕',
  PPT:  '📊',
  DOC:  '📝',
  ZIP:  '🗜️',
  LINK: '🔗',
}

export default function CourseDetails() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [course,  setCourse]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)

  const isLoggedIn = !!localStorage.getItem('token')
  const user       = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
  const isStudent  = user?.role?.toUpperCase() === 'STUDENT'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await getCourseById(id)
        setCourse(courseRes.data)

        // Check enrollment only for logged-in students
        if (isLoggedIn && isStudent) {
          try {
            const enrollRes = await getMyEnrollments()
            const enrolled = enrollRes.data.some(
              e => e.courseId === parseInt(id) && e.status === 'ACTIVE'
            )
            setIsEnrolled(enrolled)
          } catch {
            // enrollment check failing shouldn't break the page
          }
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load course.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, isLoggedIn, isStudent])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="course-details">
          <div className="course-details__container">
            <div className="cd-loading">
              <div className="cd-spinner" />
              <p>Loading course details…</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !course) {
    return (
      <>
        <Navbar />
        <main className="course-details">
          <div className="course-details__container">
            <div className="cd-error">
              <span>😕</span>
              <p>{error || 'Course not found.'}</p>
              <button className="course-details__back" onClick={() => navigate(-1)}>Go Back</button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const color     = DEPT_COLORS[course.dept] || '#4f46e5'
  const icon      = course.icon || DEFAULT_ICONS[course.id % DEFAULT_ICONS.length]
  const enrolled  = course._count?.enrollments ?? 0
  const isFull    = enrolled >= course.capacity
  const seatsLeft = course.capacity - enrolled
  const seatColor = isFull ? '#ef4444' : seatsLeft <= 5 ? '#f59e0b' : '#10b981'

  return (
    <>
      <Navbar />
      <main className="course-details">
        <div className="course-details__container">

          {/* Back button */}
          <button className="course-details__back" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Hero header */}
          <div className="course-details__header">
            <div className="course-details__hero">
              <div className="course-details__hero-content">
                <div className="course-details__icon" style={{ background: `${color}18`, color }}>
                  {icon}
                </div>
                <div>
                  {course.dept && (
                    <span className="cd-dept" style={{ color }}>{course.dept}</span>
                  )}
                  <h1 className="course-details__title">{course.title}</h1>
                  <p className="course-details__instructor">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    {course.instructor?.name ?? 'Unknown Instructor'}
                  </p>
                  {course.description && (
                    <p className="course-details__description">{course.description}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="course-details__hero-stats">
                <div className="course-details__stat-card">
                  <span className="course-details__stat-value" style={{ color: seatColor }}>
                    {isFull ? 'Full' : seatsLeft}
                  </span>
                  <span className="course-details__stat-label">Seats Left</span>
                </div>
                <div className="course-details__stat-card">
                  <span className="course-details__stat-value">{enrolled}</span>
                  <span className="course-details__stat-label">Enrolled</span>
                </div>
                <div className="course-details__stat-card">
                  <span className="course-details__stat-value">{course.capacity}</span>
                  <span className="course-details__stat-label">Capacity</span>
                </div>
              </div>
            </div>

            {/* Seats bar */}
            <div className="course-details__progress">
              <div className="course-details__progress-label">
                <span>Enrollment</span>
                <span style={{ color: seatColor, fontWeight: 700 }}>
                  {enrolled} / {course.capacity}
                </span>
              </div>
              <div className="course-details__progress-bar">
                <div
                  className="course-details__progress-fill"
                  style={{
                    width: `${(enrolled / course.capacity) * 100}%`,
                    background: seatColor,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content grid */}
          <div className="course-details__grid">

            {/* Schedule */}
            {course.schedules?.length > 0 && (
              <div className="course-details__section">
                <h2 className="course-details__section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Schedule
                </h2>
                <div className="cd-schedule-list">
                  {course.schedules.map((s, i) => (
                    <div key={i} className="cd-schedule-item">
                      <div className="cd-schedule-day" style={{ background: `${color}15`, color }}>
                        {s.day}
                      </div>
                      <div className="cd-schedule-time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {s.startTime} – {s.endTime}
                      </div>
                      {s.room && (
                        <div className="cd-schedule-room">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                          </svg>
                          Room {s.room}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Materials */}
            {course.materials?.length > 0 && (
              <div className="course-details__section">
                <h2 className="course-details__section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
                  </svg>
                  Course Materials
                </h2>
                <div className="materials-list">
                  {course.materials.map((m) => {
                    const isLink = m.type === 'LINK'
                    const hasFile = !isLink && m.url
                    const canDownload = isEnrolled || user?.role?.toUpperCase() === 'INSTRUCTOR' || user?.role?.toUpperCase() === 'ADMIN'
                    return (
                      <div key={m.id} className="material-item">
                        <div className="material-item__icon">
                          {MATERIAL_ICONS[m.type] || '📄'}
                        </div>
                        <div className="material-item__info">
                          <h3 className="material-item__title">{m.title}</h3>
                          <p className="material-item__meta">
                            {isLink ? 'External link' : m.type || 'File'}
                            {!canDownload && ' · Enroll to access'}
                          </p>
                        </div>
                        {canDownload && m.url && (
                          isLink ? (
                            <a
                              href={m.url}
                              target="_blank"
                              rel="noreferrer"
                              className="material-item__download"
                              aria-label="Open link"
                              title="Open link"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          ) : (
                            <a
                              href={m.url}
                              download={m.title}
                              className="material-item__download"
                              aria-label="Download"
                              title="Download"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                              </svg>
                            </a>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>

          {/* CTA for guests */}
          {!isLoggedIn && (
            <div className="cd-guest-cta" style={{ borderColor: color }}>
              <div className="cd-guest-cta__text">
                <h3>Want to enroll in this course?</h3>
                <p>Create a free account or sign in to enroll and access all course materials.</p>
              </div>
              <div className="cd-guest-cta__actions">
                <button
                  className="cd-guest-cta__btn cd-guest-cta__btn--primary"
                  style={{ background: color }}
                  onClick={() => navigate('/signup')}
                >
                  Create Free Account
                </button>
                <button
                  className="cd-guest-cta__btn cd-guest-cta__btn--secondary"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
