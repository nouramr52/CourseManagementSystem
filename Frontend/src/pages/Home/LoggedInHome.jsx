import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import { getAllCourses } from '../../api/courseApi'
import { enrollInCourse, dropCourse, getMyEnrollments } from '../../api/enrollmentApi'
import './LoggedInHome.css'

const DEPT_COLORS = [
  { color: '#4f46e5', bg: '#eef2ff' },
  { color: '#06b6d4', bg: '#ecfeff' },
  { color: '#10b981', bg: '#ecfdf5' },
  { color: '#f59e0b', bg: '#fffbeb' },
  { color: '#8b5cf6', bg: '#f5f3ff' },
  { color: '#ef4444', bg: '#fef2f2' },
]

// Map department names to a consistent palette index so the same dept always
// gets the same colour, regardless of the order courses are returned.
const DEPT_PALETTE = {
  'Computer Science':       0,
  'Software Engineering':   1,
  'Information Systems':    2,
  'Data Science':           3,
  'Artificial Intelligence':4,
  'Cybersecurity':          5,
  'Networking':             1,
  'Mathematics':            2,
  'Physics':                3,
  'General':                0,
}

const getPalette = (course, idx) => {
  if (course.dept && DEPT_PALETTE[course.dept] !== undefined) {
    return DEPT_COLORS[DEPT_PALETTE[course.dept]]
  }
  return DEPT_COLORS[idx % DEPT_COLORS.length]
}

const DEFAULT_ICONS = ['🗄️','⚙️','🌐','💻','🔐','📊','🤖','📚','🧮','📡']

export default function LoggedInHome({ user }) {
  const navigate    = useNavigate()
  const role        = user?.role?.toUpperCase()

  const [courses,     setCourses]     = useState([])
  const [enrolledIds, setEnrolledIds] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [search,      setSearch]      = useState('')
  const [enrollingId, setEnrollingId] = useState(null)
  const [toast,       setToast]       = useState(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setError(null)
      const [cRes, eRes] = await Promise.all([
        getAllCourses(),
        role === 'STUDENT' ? getMyEnrollments() : Promise.resolve({ data: [] }),
      ])
      setCourses(cRes.data)
      setEnrolledIds(
        eRes.data.filter(e => e.status === 'ACTIVE').map(e => e.courseId)
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses. Make sure the backend is running.')
    }
    finally { setLoading(false) }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleEnroll = async (course) => {
    setEnrollingId(course.id)
    try {
      await enrollInCourse(course.id)
      setEnrolledIds(p => [...p, course.id])
      showToast(`Enrolled in ${course.title}!`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Enrollment failed', 'error')
    } finally { setEnrollingId(null) }
  }

  const handleDrop = async (course) => {
    try {
      await dropCourse(course.id)
      setEnrolledIds(p => p.filter(id => id !== course.id))
      showToast(`Dropped ${course.title}.`, 'info')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to drop', 'error')
    }
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.instructor?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero — same style, personalised ── */}
        <section className="lh-hero">
          <div className="hero__blob hero__blob--1" aria-hidden="true" />
          <div className="hero__blob hero__blob--2" aria-hidden="true" />
          <div className="hero__blob hero__blob--3" aria-hidden="true" />

          <div className="lh-hero__inner">
            <div className="lh-hero__text">
              <div className="hero__badge">
                <span className="hero__badge-dot" />
                Welcome back, {user.name}
              </div>

              <h1 className="hero__title">
                Find your next
                <span className="hero__title-highlight"> course</span>
              </h1>

              <p className="hero__subtitle">
                Browse all available courses, check schedules and available seats,
                and enroll instantly — all in one place.
              </p>

              {/* Search bar right in the hero */}
              <div className="lh-hero__search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  placeholder="Search courses or instructors…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                />
                {search && (
                  <button onClick={() => setSearch('')} aria-label="Clear">✕</button>
                )}
              </div>

              {/* Quick links */}
              <div className="hero__roles">
                {role === 'STUDENT' && (
                  <>
                    <button
                      className="hero__role-badge"
                      style={{ background: '#eef2ff', color: '#4f46e5', cursor: 'pointer' }}
                      onClick={() => navigate('/student/my-courses')}
                    >
                      📚 My Courses
                      {enrolledIds.length > 0 && (
                        <span className="lh-badge-count">{enrolledIds.length}</span>
                      )}
                    </button>
                    <button
                      className="hero__role-badge"
                      style={{ background: '#ecfeff', color: '#06b6d4', cursor: 'pointer' }}
                      onClick={() => navigate('/student/schedule')}
                    >
                      📅 My Schedule
                    </button>
                  </>
                )}
                {role === 'INSTRUCTOR' && (
                  <button
                    className="hero__role-badge"
                    style={{ background: '#eef2ff', color: '#4f46e5', cursor: 'pointer' }}
                    onClick={() => navigate('/instructor/dashboard')}
                  >
                    🏠 Instructor Dashboard
                  </button>
                )}
                {role === 'ADMIN' && (
                  <button
                    className="hero__role-badge"
                    style={{ background: '#f5f3ff', color: '#8b5cf6', cursor: 'pointer' }}
                    onClick={() => navigate('/admin/dashboard')}
                  >
                    🛡️ Admin Panel
                  </button>
                )}
              </div>
            </div>

            {/* Stats card — same style as the landing hero card */}
            <div className="hero__visual">
              <div className="hero__card">
                <div className="hero__card-header">
                  <div className="hero__card-dots">
                    <span style={{ background: '#ef4444' }} />
                    <span style={{ background: '#f59e0b' }} />
                    <span style={{ background: '#10b981' }} />
                  </div>
                  <span className="hero__card-title">Your Overview</span>
                </div>
                <div className="hero__card-body">
                  <p className="hero__card-label">Quick Stats</p>
                  <div className="hero__mini-stats">
                    <div className="hero__mini-stat">
                      <span className="hero__mini-stat-value">{courses.length}</span>
                      <span className="hero__mini-stat-label">Courses</span>
                    </div>
                    <div className="hero__mini-stat">
                      <span className="hero__mini-stat-value">{enrolledIds.length}</span>
                      <span className="hero__mini-stat-label">Enrolled</span>
                    </div>
                    <div className="hero__mini-stat">
                      <span className="hero__mini-stat-value">
                        {courses.length - enrolledIds.length}
                      </span>
                      <span className="hero__mini-stat-label">Available</span>
                    </div>
                  </div>

                  {enrolledIds.length > 0 && (
                    <>
                      <p className="hero__card-label" style={{ marginTop: '0.75rem' }}>
                        Enrolled Courses
                      </p>
                      {courses
                        .filter(c => enrolledIds.includes(c.id))
                        .slice(0, 3)
                        .map((c, i) => (
                          <div key={c.id} className="hero__course-row">
                            <span
                              className="hero__course-dot"
                              style={{ background: DEPT_COLORS[i % DEPT_COLORS.length].color }}
                            />
                            <div className="hero__course-info">
                              <span className="hero__course-name">{c.title}</span>
                              <span className="hero__course-schedule">
                                {c.instructor?.name}
                              </span>
                            </div>
                          </div>
                        ))}
                    </>
                  )}

                  {enrolledIds.length === 0 && role === 'STUDENT' && (
                    <div className="lh-hero__empty-card">
                      <span>🎓</span>
                      <p>You haven't enrolled in any courses yet.</p>
                      <p>Browse below to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Course catalog — same section style as landing page ── */}
        <section className="courses" id="courses">
          <div className="courses__container">
            <div className="section-header">
              <span className="section-tag">Course Catalog</span>
              <h2 className="section-title">
                {search
                  ? `Results for "${search}"`
                  : 'All Available Courses'}
              </h2>
              <p className="section-subtitle">
                {loading
                  ? 'Loading courses…'
                  : `${filtered.length} course${filtered.length !== 1 ? 's' : ''} available`
                  + (role === 'STUDENT' && enrolledIds.length > 0
                    ? ` · ${enrolledIds.length} enrolled`
                    : '')}
              </p>
            </div>

            {loading ? (
              <div className="lh-loading">
                <div className="lh-spinner" />
              </div>
            ) : error ? (
              <div className="lh-empty">
                <span>⚠️</span>
                <p style={{ color: '#dc2626' }}>{error}</p>
                <button className="courses__view-all" onClick={loadData}>
                  Try again
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="lh-empty">
                <span>🔍</span>
                <p>No courses match your search.</p>
                <button className="courses__view-all" onClick={() => setSearch('')}>
                  Clear search
                </button>
              </div>
            ) : (
              <div className="courses__grid">
                {filtered.map((course, idx) => {
                  const palette    = getPalette(course, idx)
                  const icon       = course.icon || DEFAULT_ICONS[idx % DEFAULT_ICONS.length]
                  const isEnrolled = enrolledIds.includes(course.id)
                  const enrolled   = course._count?.enrollments ?? 0
                  const isFull     = enrolled >= course.capacity
                  const isEnrolling = enrollingId === course.id
                  const seatColor  = isFull ? '#ef4444' : enrolled / course.capacity > 0.8 ? '#f59e0b' : '#10b981'
                  const seatsLeft  = course.capacity - enrolled

                  return (
                    <div
                      key={course.id}
                      className="course-card"
                      style={isEnrolled ? { borderColor: '#a5b4fc', boxShadow: '0 0 0 2px rgba(79,70,229,0.12)' } : {}}
                    >
                      {/* Thumb — same as landing page */}
                      <div className="course-card__thumb" style={{ background: palette.bg }}>
                        <span className="course-card__emoji">{icon}</span>
                        <span
                          className="course-card__status"
                          style={{
                            background: isEnrolled ? '#eef2ff' : isFull ? '#fee2e2' : '#dcfce7',
                            color:      isEnrolled ? '#4f46e5' : isFull ? '#dc2626' : '#16a34a',
                          }}
                        >
                          {isEnrolled ? '✓ Enrolled' : isFull ? 'Full' : 'Open'}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="course-card__body">
                        {/* Dept label — coloured, uppercase, like the placeholder */}
                        <span className="course-card__dept" style={{ color: palette.color }}>
                          {course.dept || course.instructor?.name || 'Unknown'}
                        </span>

                        <h3 className="course-card__title">{course.title}</h3>

                        {/* Instructor row */}
                        <div className="course-card__instructor">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                          </svg>
                          {course.instructor?.name ?? 'Unknown Instructor'}
                        </div>

                        {course.description && (
                          <p className="lh-card-desc">{course.description}</p>
                        )}

                        {/* Schedule — day row + time row, matching placeholder style */}
                        {course.schedules?.length > 0 && (
                          <div className="course-card__schedule">
                            <div className="course-card__schedule-row">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                              {course.schedules.map(s => s.day).join(' / ')}
                            </div>
                            <div className="course-card__schedule-row">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                              </svg>
                              {course.schedules[0].startTime} – {course.schedules[course.schedules.length - 1].endTime}
                            </div>
                          </div>
                        )}

                        {/* Seats */}
                        <div className="course-card__seats">
                          <div className="course-card__seats-meta">
                            <span>Available Seats</span>
                            <span style={{ color: seatColor, fontWeight: 700 }}>
                              {isFull ? 'Full' : `${seatsLeft} / ${course.capacity}`}
                            </span>
                          </div>
                          <div className="course-card__seats-bar">
                            <div
                              className="course-card__seats-fill"
                              style={{
                                width: `${(enrolled / course.capacity) * 100}%`,
                                background: seatColor,
                              }}
                            />
                          </div>
                        </div>

                        {/* Action button */}
                        {role === 'STUDENT' ? (
                          isEnrolled ? (
                            <div className="lh-card-actions">
                              <button
                                className="course-card__btn"
                                style={{ background: '#4f46e5', color: 'white' }}
                                onClick={() => navigate(`/course/${course.id}`)}
                              >
                                View Details
                              </button>
                              <button
                                className="lh-drop-btn"
                                onClick={() => handleDrop(course)}
                              >
                                Drop
                              </button>
                            </div>
                          ) : (
                            <button
                              className="course-card__btn"
                              style={{
                                background: isFull ? '#f1f5f9' : palette.color,
                                color: isFull ? '#94a3b8' : 'white',
                                cursor: isFull || isEnrolling ? 'not-allowed' : 'pointer',
                              }}
                              disabled={isFull || isEnrolling}
                              onClick={() => !isFull && handleEnroll(course)}
                            >
                              {isEnrolling ? '⏳ Enrolling…' : isFull ? 'Course Full' : 'Enroll Now'}
                            </button>
                          )
                        ) : (
                          <button
                            className="course-card__btn"
                            style={{ background: palette.color, color: 'white' }}
                            onClick={() => navigate(`/course/${course.id}`)}
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Toast — same position as landing page floats */}
      {toast && (
        <div className={`lh-toast lh-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.msg}
        </div>
      )}

      <Footer />
    </>
  )
}
