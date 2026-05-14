import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import { getAllCourses } from '../../api/courseApi'
import { enrollInCourse, dropCourse, getMyEnrollments } from '../../api/enrollmentApi'
import './StudentCourses.css'
import '../../components/home/Courses/Courses.css'

const DEPT_COLORS = [
  { color: '#4f46e5', bg: '#eef2ff' },
  { color: '#06b6d4', bg: '#ecfeff' },
  { color: '#10b981', bg: '#ecfdf5' },
  { color: '#f59e0b', bg: '#fffbeb' },
  { color: '#8b5cf6', bg: '#f5f3ff' },
  { color: '#ef4444', bg: '#fef2f2' },
]

const DEPT_PALETTE = {
  'Computer Science':        0,
  'Software Engineering':    1,
  'Information Systems':     2,
  'Data Science':            3,
  'Artificial Intelligence': 4,
  'Cybersecurity':           5,
  'Networking':              1,
  'Mathematics':             2,
  'Physics':                 3,
  'General':                 0,
}

const getPalette = (course, idx) => {
  if (course.dept && DEPT_PALETTE[course.dept] !== undefined) {
    return DEPT_COLORS[DEPT_PALETTE[course.dept]]
  }
  return DEPT_COLORS[idx % DEPT_COLORS.length]
}

const DEFAULT_ICONS = ['🗄️','⚙️','🌐','💻','🔐','📊','🤖','📚','🧮','📡']

export default function StudentCourses() {
  const navigate = useNavigate()

  // All courses from the backend
  const [courses, setCourses] = useState([])
  // IDs of courses the student is already enrolled in
  const [enrolledIds, setEnrolledIds] = useState([])
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Which course is currently being enrolled (shows spinner)
  const [enrollingId, setEnrollingId] = useState(null)
  // Toast notification
  const [toast, setToast] = useState(null)
  // Search and filter
  const [search, setSearch] = useState('')

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    loadData()
  }, [navigate])

  // Load courses and the student's existing enrollments in parallel
  const loadData = async () => {
    try {
      setLoading(true)
      const [coursesRes, enrollmentsRes] = await Promise.all([
        getAllCourses(),
        getMyEnrollments(),
      ])
      setCourses(coursesRes.data)
      // Extract just the course IDs from enrollments where status is ACTIVE
      const activeIds = enrollmentsRes.data
        .filter(e => e.status === 'ACTIVE')
        .map(e => e.courseId)
      setEnrolledIds(activeIds)
    } catch (err) {
      setError('Failed to load courses. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleEnroll = async (course) => {
    setEnrollingId(course.id)
    try {
      await enrollInCourse(course.id)
      setEnrolledIds(prev => [...prev, course.id])
      showToast(`Successfully enrolled in ${course.title}!`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Enrollment failed', 'error')
    } finally {
      setEnrollingId(null)
    }
  }

  const handleDrop = async (course) => {
    try {
      await dropCourse(course.id)
      setEnrolledIds(prev => prev.filter(id => id !== course.id))
      showToast(`Dropped ${course.title}.`, 'info')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to drop course', 'error')
    }
  }

  // Filter courses by search term
  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="sc-page">
          <div className="sc-container">
            <div className="sc-loading">Loading courses...</div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="sc-page">
          <div className="sc-container">
            <div className="sc-error">{error}</div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="sc-page">
        <div className="sc-container">

          {/* Header */}
          <div className="sc-header">
            <div>
              <h1 className="sc-title">
                Browse <span className="sc-highlight">Courses</span>
              </h1>
              <p className="sc-subtitle">
                Explore all available courses and enroll to start learning.
              </p>
            </div>
            <button className="sc-mycourses-btn" onClick={() => navigate('/student/my-courses')}>
              My Courses
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="sc-filters">
            <div className="sc-search-wrap">
              <svg className="sc-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="sc-search"
                type="text"
                placeholder="Search courses or instructors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <p className="sc-results-count">
            Showing <strong>{filtered.length}</strong> of {courses.length} courses
            {enrolledIds.length > 0 && (
              <span className="sc-enrolled-badge">{enrolledIds.length} enrolled</span>
            )}
          </p>

          {/* Course Grid */}
          {filtered.length === 0 ? (
            <div className="sc-empty">
              <span className="sc-empty-icon">🔍</span>
              <p>No courses found. Try a different search.</p>
            </div>
          ) : (
            <div className="sc-grid">
              {filtered.map((course, idx) => {
                const palette     = getPalette(course, idx)
                const icon        = course.icon || DEFAULT_ICONS[idx % DEFAULT_ICONS.length]
                const isEnrolled  = enrolledIds.includes(course.id)
                const enrolledCount = course._count?.enrollments ?? 0
                const isFull      = enrolledCount >= course.capacity
                const isEnrolling = enrollingId === course.id
                const seatsLeft   = course.capacity - enrolledCount
                const seatColor   = isFull ? '#ef4444' : enrolledCount / course.capacity > 0.8 ? '#f59e0b' : '#10b981'

                return (
                  <div
                    key={course.id}
                    className="course-card"
                    style={isEnrolled ? { borderColor: '#a5b4fc', boxShadow: '0 0 0 2px rgba(79,70,229,0.12)' } : {}}
                  >
                    {isEnrolled && <div className="sc-card__enrolled-ribbon">Enrolled</div>}

                    {/* Thumb */}
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
                      {/* Dept label */}
                      <span className="course-card__dept" style={{ color: palette.color }}>
                        {course.dept || course.instructor?.name || 'Unknown'}
                      </span>

                      <h3 className="course-card__title">{course.title}</h3>

                      {/* Instructor */}
                      <div className="course-card__instructor">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                        </svg>
                        {course.instructor?.name ?? 'Unknown Instructor'}
                      </div>

                      {course.description && (
                        <p className="lh-card-desc">{course.description}</p>
                      )}

                      {/* Schedule — day row + time row */}
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
                              width: `${(enrolledCount / course.capacity) * 100}%`,
                              background: seatColor,
                            }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      {isEnrolled ? (
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
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div className={`sc-toast sc-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.msg}
        </div>
      )}

      <Footer />
    </>
  )
}
