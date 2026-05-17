import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import CourseCard from '../../components/shared/CourseCard/CourseCard'
import { getAllCourses } from '../../api/courseApi'
import { enrollInCourse, dropCourse, getMyEnrollments } from '../../api/enrollmentApi'
import './StudentCourses.css'

export default function StudentCourses() {
  const navigate = useNavigate()

  const [courses,     setCourses]     = useState([])
  const [enrolledIds, setEnrolledIds] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [enrollingId, setEnrollingId] = useState(null)
  const [toast,       setToast]       = useState(null)
  const [search,      setSearch]      = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      setLoading(true)
      const [coursesRes, enrollmentsRes] = await Promise.all([
        getAllCourses(),
        getMyEnrollments(),
      ])
      setCourses(coursesRes.data)
      setEnrolledIds(
        enrollmentsRes.data.filter(e => e.status === 'ACTIVE').map(e => e.courseId)
      )
    } catch {
      setError('Failed to load courses. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Update local seat count immediately after enroll/drop
  const updateSeatCount = (courseId, delta) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId
        ? { ...c, _count: { ...c._count, enrollments: (c._count?.enrollments ?? 0) + delta } }
        : c
    ))
  }

  const handleEnroll = async (course) => {
    setEnrollingId(course.id)
    try {
      await enrollInCourse(course.id)
      setEnrolledIds(prev => [...prev, course.id])
      updateSeatCount(course.id, +1)
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
      updateSeatCount(course.id, -1)
      showToast(`Dropped ${course.title}.`, 'info')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to drop course', 'error')
    }
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <>
      <Navbar />
      <main className="sc-page"><div className="sc-container"><div className="sc-loading">Loading courses…</div></div></main>
      <Footer />
    </>
  )

  if (error) return (
    <>
      <Navbar />
      <main className="sc-page"><div className="sc-container"><div className="sc-error">{error}</div></div></main>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <main className="sc-page">
        <div className="sc-container">

          <div className="sc-header">
            <div>
              <h1 className="sc-title">Browse <span className="sc-highlight">Courses</span></h1>
              <p className="sc-subtitle">Explore all available courses and enroll to start learning.</p>
            </div>
            <button className="sc-mycourses-btn" onClick={() => navigate('/student/my-courses')}>
              My Courses
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="sc-filters">
            <div className="sc-search-wrap">
              <svg className="sc-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
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
            {enrolledIds.length > 0 && <span className="sc-enrolled-badge">{enrolledIds.length} enrolled</span>}
          </p>

          {filtered.length === 0 ? (
            <div className="sc-empty">
              <span className="sc-empty-icon">🔍</span>
              <p>No courses found. Try a different search.</p>
            </div>
          ) : (
            <div className="sc-grid">
              {filtered.map((course, idx) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  idx={idx}
                  isEnrolled={enrolledIds.includes(course.id)}
                  isEnrolling={enrollingId === course.id}
                  onEnroll={handleEnroll}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div className={`sc-toast sc-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.msg}
        </div>
      )}

      <Footer />
    </>
  )
}
