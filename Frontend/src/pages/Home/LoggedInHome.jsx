import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import CourseCard from '../../components/shared/CourseCard/CourseCard'
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
      setEnrolledIds(eRes.data.filter(e => e.status === 'ACTIVE').map(e => e.courseId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses. Make sure the backend is running.')
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
      setEnrolledIds(p => [...p, course.id])
      showToast(`Enrolled in ${course.title}!`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Enrollment failed', 'error')
    } finally {
      setEnrollingId(null)
    }
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

        {/* ── Hero ── */}
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
                {search && <button onClick={() => setSearch('')} aria-label="Clear">✕</button>}
              </div>

              <div className="hero__roles">
                {role === 'STUDENT' && (
                  <>
                    <button className="hero__role-badge" style={{ background: '#eef2ff', color: '#4f46e5', cursor: 'pointer' }} onClick={() => navigate('/student/my-courses')}>
                      📚 My Courses
                      {enrolledIds.length > 0 && <span className="lh-badge-count">{enrolledIds.length}</span>}
                    </button>
                    <button className="hero__role-badge" style={{ background: '#ecfeff', color: '#06b6d4', cursor: 'pointer' }} onClick={() => navigate('/student/schedule')}>
                      📅 My Schedule
                    </button>
                  </>
                )}
                {role === 'INSTRUCTOR' && (
                  <button className="hero__role-badge" style={{ background: '#eef2ff', color: '#4f46e5', cursor: 'pointer' }} onClick={() => navigate('/instructor/dashboard')}>
                    🏠 Instructor Dashboard
                  </button>
                )}
                {role === 'ADMIN' && (
                  <button className="hero__role-badge" style={{ background: '#f5f3ff', color: '#8b5cf6', cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>
                    🛡️ Admin Panel
                  </button>
                )}
              </div>
            </div>

            {/* Stats card */}
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
                      <span className="hero__mini-stat-value">{courses.length - enrolledIds.length}</span>
                      <span className="hero__mini-stat-label">Available</span>
                    </div>
                  </div>

                  {enrolledIds.length > 0 ? (
                    <>
                      <p className="hero__card-label" style={{ marginTop: '0.75rem' }}>Enrolled Courses</p>
                      {courses.filter(c => enrolledIds.includes(c.id)).slice(0, 3).map((c, i) => (
                        <div key={c.id} className="hero__course-row">
                          <span className="hero__course-dot" style={{ background: DEPT_COLORS[i % DEPT_COLORS.length].color }} />
                          <div className="hero__course-info">
                            <span className="hero__course-name">{c.title}</span>
                            <span className="hero__course-schedule">{c.instructor?.name}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : role === 'STUDENT' ? (
                    <div className="lh-hero__empty-card">
                      <span>🎓</span>
                      <p>You haven't enrolled in any courses yet.</p>
                      <p>Browse below to get started!</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Course catalog ── */}
        <section className="courses" id="courses">
          <div className="courses__container">
            <div className="section-header">
              <span className="section-tag">Course Catalog</span>
              <h2 className="section-title">
                {search ? `Results for "${search}"` : 'All Available Courses'}
              </h2>
              <p className="section-subtitle">
                {loading
                  ? 'Loading courses…'
                  : `${filtered.length} course${filtered.length !== 1 ? 's' : ''} available`
                    + (role === 'STUDENT' && enrolledIds.length > 0 ? ` · ${enrolledIds.length} enrolled` : '')}
              </p>
            </div>

            {loading ? (
              <div className="lh-loading"><div className="lh-spinner" /></div>
            ) : error ? (
              <div className="lh-empty">
                <span>⚠️</span>
                <p style={{ color: '#dc2626' }}>{error}</p>
                <button className="courses__view-all" onClick={loadData}>Try again</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="lh-empty">
                <span>🔍</span>
                <p>No courses match your search.</p>
                <button className="courses__view-all" onClick={() => setSearch('')}>Clear search</button>
              </div>
            ) : (
              <div className="courses__grid">
                {filtered.map((course, idx) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    idx={idx}
                    isEnrolled={enrolledIds.includes(course.id)}
                    isEnrolling={enrollingId === course.id}
                    onEnroll={role === 'STUDENT' ? handleEnroll : null}
                    onDrop={role === 'STUDENT' ? handleDrop : null}
                    isGuest={role !== 'STUDENT'}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      {toast && (
        <div className={`lh-toast lh-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.msg}
        </div>
      )}

      <Footer />
    </>
  )
}
