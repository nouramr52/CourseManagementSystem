import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import { getMyEnrollments, dropCourse } from '../../api/enrollmentApi'
import './MyCourses.css'

export default function MyCourses() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    loadEnrollments()
  }, [navigate])

  const loadEnrollments = async () => {
    try {
      setLoading(true)
      const res = await getMyEnrollments()
      setEnrollments(res.data)
    } catch (err) {
      setError('Failed to load your courses.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async (courseId) => {
    try {
      await dropCourse(courseId)
      // Remove from list or mark as dropped
      setEnrollments(prev =>
        prev.map(e => e.courseId === courseId ? { ...e, status: 'DROPPED' } : e)
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to drop course')
    }
  }

  // Only show ACTIVE enrollments by default
  const active = enrollments.filter(e => e.status === 'ACTIVE')
  const dropped = enrollments.filter(e => e.status === 'DROPPED')

  const displayed = filter === 'dropped' ? dropped : active

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mc-page">
          <div className="mc-container">
            <div className="mc-loading">Loading your courses...</div>
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
        <main className="mc-page">
          <div className="mc-container">
            <div className="mc-error">{error}</div>
          </div>
        </main>
        <Footer />
      </>
    )
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
                Manage your enrolled courses.
              </p>
            </div>
            <button className="mc-browse-btn" onClick={() => navigate('/student/courses')}>
              Browse Courses
            </button>
          </div>

          {/* Stats */}
          <div className="mc-stats">
            <div className="mc-stat">
              <div className="mc-stat__icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>📚</div>
              <div>
                <p className="mc-stat__value">{active.length}</p>
                <p className="mc-stat__label">Active Courses</p>
              </div>
            </div>
            <div className="mc-stat">
              <div className="mc-stat__icon" style={{ background: '#fef2f2', color: '#ef4444' }}>📤</div>
              <div>
                <p className="mc-stat__value">{dropped.length}</p>
                <p className="mc-stat__label">Dropped</p>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mc-tabs">
            <button
              className={`mc-tab ${filter === 'all' ? 'mc-tab--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Active <span className="mc-tab__count">{active.length}</span>
            </button>
            <button
              className={`mc-tab ${filter === 'dropped' ? 'mc-tab--active' : ''}`}
              onClick={() => setFilter('dropped')}
            >
              Dropped <span className="mc-tab__count">{dropped.length}</span>
            </button>
          </div>

          {/* Empty state */}
          {displayed.length === 0 ? (
            <div className="mc-empty">
              <div className="mc-empty__icon">🎓</div>
              <h3 className="mc-empty__title">
                {filter === 'dropped' ? 'No dropped courses' : 'No courses yet'}
              </h3>
              <p className="mc-empty__text">
                {filter === 'all' && "You haven't enrolled in any courses yet."}
              </p>
              {filter === 'all' && (
                <button className="mc-empty__btn" onClick={() => navigate('/student/courses')}>
                  Browse Courses
                </button>
              )}
            </div>
          ) : (
            <div className="mc-grid">
              {displayed.map(enrollment => {
                const course = enrollment.course
                return (
                  <div key={enrollment.id} className="mc-card">
                    <div className="mc-card__header">
                      <div className="mc-card__icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                        📚
                      </div>
                      <div className="mc-card__info">
                        <h3 className="mc-card__title">{course.title}</h3>
                        <p className="mc-card__instructor">
                          {course.instructor?.name ?? 'Unknown Instructor'}
                        </p>
                      </div>
                    </div>

                    {course.description && (
                      <p className="mc-card__description">{course.description}</p>
                    )}

                    {/* Schedule */}
                    {course.schedules?.length > 0 && (
                      <div className="mc-card__stats">
                        {course.schedules.map((s, i) => (
                          <div key={i} className="mc-card__stat">
                            <span className="mc-card__stat-label">📅 {s.day}</span>
                            <span className="mc-card__stat-value">{s.startTime} – {s.endTime}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mc-card__footer">
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </span>
                      <div className="mc-card__actions">
                        <button
                          className="mc-card__btn mc-card__btn--details"
                          onClick={() => navigate(`/course/${course.id}`)}
                        >
                          View Details
                        </button>
                        {enrollment.status === 'ACTIVE' && (
                          <button
                            className="mc-card__btn mc-card__btn--unenroll"
                            onClick={() => handleDrop(course.id)}
                            title="Drop course"
                          >
                            Drop
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
