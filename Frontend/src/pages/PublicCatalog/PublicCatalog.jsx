import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import CourseCard from '../../components/shared/CourseCard/CourseCard'
import { getAllCourses } from '../../api/courseApi'
import { enrollInCourse, dropCourse, getMyEnrollments } from '../../api/enrollmentApi'
import './PublicCatalog.css'

export default function PublicCatalog() {
  const navigate = useNavigate()

  const token    = localStorage.getItem('token')
  const userRaw  = localStorage.getItem('user')
  const user     = userRaw && userRaw !== 'undefined' ? JSON.parse(userRaw) : null
  const isLoggedIn = !!token
  const isStudent  = user?.role?.toUpperCase() === 'STUDENT'

  const [courses,     setCourses]     = useState([])
  const [enrolledIds, setEnrolledIds] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [search,      setSearch]      = useState('')
  const [enrollingId, setEnrollingId] = useState(null)
  const [toast,       setToast]       = useState(null)
  const [loginPrompt, setLoginPrompt] = useState(false)  // guest enroll prompt

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await getAllCourses()
        setCourses(coursesRes.data)

        if (isLoggedIn && isStudent) {
          const enrollRes = await getMyEnrollments()
          setEnrolledIds(
            enrollRes.data.filter(e => e.status === 'ACTIVE').map(e => e.courseId)
          )
        }
      } catch {
        setError('Failed to load courses. Make sure the backend is running.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Update the local seat count after enroll/drop so the bar reflects immediately
  const updateSeatCount = (courseId, delta) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId
        ? { ...c, _count: { ...c._count, enrollments: (c._count?.enrollments ?? 0) + delta } }
        : c
    ))
  }

  const handleEnroll = async (course) => {
    if (!isLoggedIn) { setLoginPrompt(true); return }
    if (!isStudent)  { showToast('Only students can enroll in courses.', 'error'); return }

    setEnrollingId(course.id)
    try {
      await enrollInCourse(course.id)
      setEnrolledIds(prev => [...prev, course.id])
      updateSeatCount(course.id, +1)
      showToast(`Enrolled in ${course.title}!`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Enrollment failed', 'error')
    } finally {
      setEnrollingId(null)
    }
  }

  const handleDrop = async (course) => {
    setEnrollingId(course.id)
    try {
      await dropCourse(course.id)
      setEnrolledIds(prev => prev.filter(id => id !== course.id))
      updateSeatCount(course.id, -1)
      showToast(`Dropped ${course.title}.`, 'info')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to drop course', 'error')
    } finally {
      setEnrollingId(null)
    }
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.instructor?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.dept || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <main className="pc-page">
        <div className="pc-container">

          {/* Header */}
          <div className="pc-header">
            <div>
              <h1 className="pc-title">
                Course <span className="pc-highlight">Catalog</span>
              </h1>
              <p className="pc-subtitle">
                {isLoggedIn && isStudent
                  ? 'Browse all available courses and enroll in the ones you like.'
                  : 'Browse all available courses. Sign in or create an account to enroll.'}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="pc-search-wrap">
            <svg className="pc-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="pc-search"
              type="text"
              placeholder="Search by course name, instructor, or department…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button className="pc-search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>
            )}
          </div>

          {!loading && !error && (
            <p className="pc-count">
              Showing <strong>{filtered.length}</strong> of {courses.length} courses
              {enrolledIds.length > 0 && (
                <span className="pc-enrolled-badge">{enrolledIds.length} enrolled</span>
              )}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="pc-grid">
              {[...Array(9)].map((_, i) => <div key={i} className="pc-skeleton" />)}
            </div>
          ) : error ? (
            <div className="pc-empty"><span>⚠️</span><p style={{ color: '#dc2626' }}>{error}</p></div>
          ) : filtered.length === 0 ? (
            <div className="pc-empty">
              <span>🔍</span>
              <p>No courses match your search.</p>
              <button className="pc-clear-btn" onClick={() => setSearch('')}>Clear search</button>
            </div>
          ) : (
            <div className="pc-grid">
              {filtered.map((course, idx) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  idx={idx}
                  isGuest={!isLoggedIn || !isStudent}
                  isEnrolled={enrolledIds.includes(course.id)}
                  isEnrolling={enrollingId === course.id}
                  onEnroll={handleEnroll}
                  onDrop={isStudent ? handleDrop : null}
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Guest login prompt modal */}
      {loginPrompt && (
        <div className="pc-modal-overlay" onClick={() => setLoginPrompt(false)}>
          <div className="pc-modal" onClick={e => e.stopPropagation()}>
            <div className="pc-modal__icon">🎓</div>
            <h3 className="pc-modal__title">Sign in to enroll</h3>
            <p className="pc-modal__text">
              You need an account to enroll in courses. It's free and takes less than a minute.
            </p>
            <div className="pc-modal__actions">
              <button className="pc-signup-btn" onClick={() => navigate('/signup')}>
                Create Free Account
              </button>
              <button className="pc-signin-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
            <button className="pc-modal__close" onClick={() => setLoginPrompt(false)}>
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`pc-toast pc-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.msg}
        </div>
      )}

      <Footer />
    </>
  )
}
