import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import CourseCard from '../../components/shared/CourseCard/CourseCard'
import { getAllCourses } from '../../api/courseApi'
import './PublicCatalog.css'

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
              {filtered.map((course, idx) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  idx={idx}
                  isGuest={true}
                />
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
