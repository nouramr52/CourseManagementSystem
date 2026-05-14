import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import { getAllCourses } from '../../api/courseApi'
import './PublicCatalog.css'

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

const DEFAULT_ICONS = ['🗄️','⚙️','🌐','💻','🔐','📊','🤖','📚','🧮','📡']

const getPalette = (course, idx) => {
  if (course.dept && DEPT_PALETTE[course.dept] !== undefined) {
    return DEPT_COLORS[DEPT_PALETTE[course.dept]]
  }
  return DEPT_COLORS[idx % DEPT_COLORS.length]
}

export default function PublicCatalog() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    getAllCourses()
      .then(res => setCourses(res.data))
      .catch(() => setError('Failed to load courses. Make sure the backend is running.'))
      .finally(() => setLoading(false))
  }, [])

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
                Browse all available courses. Sign in or create an account to enroll.
              </p>
            </div>
            <div className="pc-header-actions">
              <button className="pc-signin-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="pc-signup-btn" onClick={() => navigate('/signup')}>
                Create Free Account
              </button>
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
              <button className="pc-search-clear" onClick={() => setSearch('')} aria-label="Clear search">✕</button>
            )}
          </div>

          {/* Results count */}
          {!loading && !error && (
            <p className="pc-count">
              Showing <strong>{filtered.length}</strong> of {courses.length} courses
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="pc-grid">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="pc-skeleton" />
              ))}
            </div>
          ) : error ? (
            <div className="pc-empty">
              <span>⚠️</span>
              <p style={{ color: '#dc2626' }}>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="pc-empty">
              <span>🔍</span>
              <p>No courses match your search.</p>
              <button className="pc-clear-btn" onClick={() => setSearch('')}>Clear search</button>
            </div>
          ) : (
            <div className="pc-grid">
              {filtered.map((course, idx) => {
                const palette   = getPalette(course, idx)
                const icon      = course.icon || DEFAULT_ICONS[idx % DEFAULT_ICONS.length]
                const enrolled  = course._count?.enrollments ?? 0
                const isFull    = enrolled >= course.capacity
                const seatsLeft = course.capacity - enrolled
                const seatColor = isFull ? '#ef4444' : seatsLeft <= 5 ? '#f59e0b' : '#10b981'

                return (
                  <div key={course.id} className="course-card">
                    {/* Thumb */}
                    <div className="course-card__thumb" style={{ background: palette.bg }}>
                      <span className="course-card__emoji">{icon}</span>
                      <span
                        className="course-card__status"
                        style={{
                          background: isFull ? '#fee2e2' : '#dcfce7',
                          color:      isFull ? '#dc2626' : '#16a34a',
                        }}
                      >
                        {isFull ? 'Full' : 'Open'}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="course-card__body">
                      <span className="course-card__dept" style={{ color: palette.color }}>
                        {course.dept || 'General'}
                      </span>
                      <h3 className="course-card__title">{course.title}</h3>

                      <div className="course-card__instructor">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                        </svg>
                        {course.instructor?.name ?? 'Unknown Instructor'}
                      </div>

                      {course.description && (
                        <p className="pc-card-desc">{course.description}</p>
                      )}

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

                      <button
                        className="course-card__btn"
                        style={{ background: palette.color, color: 'white', cursor: 'pointer' }}
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        View Details
                      </button>
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
