import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import './StudentCourses.css'

// All available courses catalog
const ALL_COURSES = [
  {
    id: 101,
    name: 'Database Systems',
    instructor: 'Dr. Sarah Johnson',
    dept: 'Computer Science',
    color: '#4f46e5',
    deptBg: '#eef2ff',
    icon: '🗄️',
    schedule: 'Mon / Wed',
    time: '10:00 AM – 11:30 AM',
    seats: 12,
    totalSeats: 30,
    credits: 3,
    level: 'Intermediate',
    description: 'Comprehensive course covering database design, SQL, normalization, and data management principles. Students will learn to design and implement relational databases.',
    topics: ['SQL Fundamentals', 'Database Design', 'Normalization', 'Transactions', 'NoSQL'],
    modules: 12,
    duration: '16 weeks',
  },
  {
    id: 102,
    name: 'Software Engineering',
    instructor: 'Prof. Michael Chen',
    dept: 'Computer Science',
    color: '#06b6d4',
    deptBg: '#ecfeff',
    icon: '⚙️',
    schedule: 'Tue / Thu',
    time: '1:00 PM – 2:30 PM',
    seats: 5,
    totalSeats: 25,
    credits: 3,
    level: 'Intermediate',
    description: 'Learn software development lifecycle, agile methodologies, and best practices for building scalable, maintainable applications in a team environment.',
    topics: ['Agile / Scrum', 'Design Patterns', 'Testing', 'CI/CD', 'Code Review'],
    modules: 15,
    duration: '16 weeks',
  },
  {
    id: 103,
    name: 'Operating Systems',
    instructor: 'Dr. Emily Rodriguez',
    dept: 'Computer Science',
    color: '#10b981',
    deptBg: '#ecfdf5',
    icon: '💻',
    schedule: 'Mon / Fri',
    time: '3:00 PM – 4:30 PM',
    seats: 18,
    totalSeats: 35,
    credits: 3,
    level: 'Advanced',
    description: 'Deep dive into OS concepts including processes, threads, memory management, file systems, and concurrency. Hands-on labs with Linux.',
    topics: ['Processes & Threads', 'Memory Management', 'File Systems', 'Concurrency', 'Scheduling'],
    modules: 10,
    duration: '16 weeks',
  },
  {
    id: 104,
    name: 'Web Development',
    instructor: 'Prof. David Kim',
    dept: 'Information Systems',
    color: '#8b5cf6',
    deptBg: '#f5f3ff',
    icon: '🌐',
    schedule: 'Wed / Fri',
    time: '11:00 AM – 12:30 PM',
    seats: 20,
    totalSeats: 40,
    credits: 3,
    level: 'Beginner',
    description: 'Modern web technologies including HTML5, CSS3, JavaScript, React, and Node.js. Build full-stack applications from scratch.',
    topics: ['HTML & CSS', 'JavaScript', 'React', 'Node.js', 'REST APIs'],
    modules: 14,
    duration: '16 weeks',
  },
  {
    id: 105,
    name: 'Data Structures & Algorithms',
    instructor: 'Dr. James Carter',
    dept: 'Computer Science',
    color: '#f59e0b',
    deptBg: '#fffbeb',
    icon: '🧮',
    schedule: 'Mon / Wed / Fri',
    time: '9:00 AM – 10:00 AM',
    seats: 8,
    totalSeats: 30,
    credits: 4,
    level: 'Intermediate',
    description: 'Fundamental data structures and algorithm design techniques. Covers arrays, trees, graphs, sorting, searching, and complexity analysis.',
    topics: ['Arrays & Lists', 'Trees & Graphs', 'Sorting', 'Dynamic Programming', 'Complexity'],
    modules: 18,
    duration: '16 weeks',
  },
  {
    id: 106,
    name: 'Machine Learning',
    instructor: 'Prof. Aisha Patel',
    dept: 'Data Science',
    color: '#ef4444',
    deptBg: '#fef2f2',
    icon: '🤖',
    schedule: 'Tue / Thu',
    time: '10:00 AM – 11:30 AM',
    seats: 0,
    totalSeats: 25,
    credits: 4,
    level: 'Advanced',
    description: 'Introduction to machine learning algorithms, neural networks, and practical applications using Python, scikit-learn, and TensorFlow.',
    topics: ['Supervised Learning', 'Neural Networks', 'NLP', 'Computer Vision', 'Model Evaluation'],
    modules: 16,
    duration: '16 weeks',
  },
  {
    id: 107,
    name: 'Computer Networks',
    instructor: 'Dr. Lisa Wang',
    dept: 'Computer Science',
    color: '#06b6d4',
    deptBg: '#ecfeff',
    icon: '🔗',
    schedule: 'Mon / Wed',
    time: '2:00 PM – 3:30 PM',
    seats: 14,
    totalSeats: 30,
    credits: 3,
    level: 'Intermediate',
    description: 'Fundamentals of computer networking including TCP/IP, routing, switching, network security, and wireless communications.',
    topics: ['TCP/IP', 'Routing & Switching', 'Network Security', 'DNS & HTTP', 'Wireless'],
    modules: 12,
    duration: '16 weeks',
  },
  {
    id: 108,
    name: 'Cybersecurity Fundamentals',
    instructor: 'Prof. Robert Hayes',
    dept: 'Information Security',
    color: '#10b981',
    deptBg: '#ecfdf5',
    icon: '🔒',
    schedule: 'Tue / Thu',
    time: '3:00 PM – 4:30 PM',
    seats: 10,
    totalSeats: 20,
    credits: 3,
    level: 'Beginner',
    description: 'Core concepts of cybersecurity including threat analysis, cryptography, ethical hacking, and security best practices for modern systems.',
    topics: ['Cryptography', 'Ethical Hacking', 'Threat Analysis', 'Firewalls', 'Incident Response'],
    modules: 11,
    duration: '16 weeks',
  },
]

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']
const DEPTS = ['All', 'Computer Science', 'Information Systems', 'Data Science', 'Information Security']

export default function StudentCourses() {
  const navigate = useNavigate()
  const [enrolledIds, setEnrolledIds] = useState([])
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('All')
  const [deptFilter, setDeptFilter] = useState('All')
  const [enrollingId, setEnrollingId] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    const stored = localStorage.getItem('enrolledCourses')
    if (stored) setEnrolledIds(JSON.parse(stored))
  }, [navigate])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleEnroll = (course) => {
    if (course.seats === 0) return
    setEnrollingId(course.id)
    setTimeout(() => {
      const updated = [...enrolledIds, course.id]
      setEnrolledIds(updated)
      localStorage.setItem('enrolledCourses', JSON.stringify(updated))
      setEnrollingId(null)
      showToast(`Successfully enrolled in ${course.name}!`)
    }, 800)
  }

  const handleUnenroll = (course) => {
    const updated = enrolledIds.filter(id => id !== course.id)
    setEnrolledIds(updated)
    localStorage.setItem('enrolledCourses', JSON.stringify(updated))
    showToast(`Unenrolled from ${course.name}.`, 'info')
  }

  const filtered = ALL_COURSES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()) ||
      c.dept.toLowerCase().includes(search.toLowerCase())
    const matchLevel = levelFilter === 'All' || c.level === levelFilter
    const matchDept = deptFilter === 'All' || c.dept === deptFilter
    return matchSearch && matchLevel && matchDept
  })

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

          {/* Filters */}
          <div className="sc-filters">
            <div className="sc-search-wrap">
              <svg className="sc-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="sc-search"
                type="text"
                placeholder="Search courses, instructors, departments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="sc-filter-group">
              <select className="sc-select" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
              <select className="sc-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="sc-results-count">
            Showing <strong>{filtered.length}</strong> of {ALL_COURSES.length} courses
            {enrolledIds.length > 0 && <span className="sc-enrolled-badge">{enrolledIds.length} enrolled</span>}
          </p>

          {/* Course Grid */}
          {filtered.length === 0 ? (
            <div className="sc-empty">
              <span className="sc-empty-icon">🔍</span>
              <p>No courses match your search. Try different filters.</p>
            </div>
          ) : (
            <div className="sc-grid">
              {filtered.map(course => {
                const isEnrolled = enrolledIds.includes(course.id)
                const isFull = course.seats === 0
                const isEnrolling = enrollingId === course.id
                const seatsPercent = Math.round((course.seats / course.totalSeats) * 100)

                return (
                  <div key={course.id} className={`sc-card ${isEnrolled ? 'sc-card--enrolled' : ''}`}>
                    {isEnrolled && <div className="sc-card__enrolled-ribbon">Enrolled</div>}

                    <div className="sc-card__header">
                      <div className="sc-card__icon" style={{ background: course.deptBg, color: course.color }}>
                        {course.icon}
                      </div>
                      <div className="sc-card__meta">
                        <span className="sc-card__dept" style={{ color: course.color, background: course.deptBg }}>
                          {course.dept}
                        </span>
                        <span className={`sc-card__level sc-card__level--${course.level.toLowerCase()}`}>
                          {course.level}
                        </span>
                      </div>
                    </div>

                    <h3 className="sc-card__title">{course.name}</h3>
                    <p className="sc-card__instructor">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      {course.instructor}
                    </p>
                    <p className="sc-card__description">{course.description}</p>

                    <div className="sc-card__topics">
                      {course.topics.slice(0, 3).map(t => (
                        <span key={t} className="sc-card__topic">{t}</span>
                      ))}
                      {course.topics.length > 3 && (
                        <span className="sc-card__topic sc-card__topic--more">+{course.topics.length - 3} more</span>
                      )}
                    </div>

                    <div className="sc-card__info-row">
                      <div className="sc-card__info-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {course.schedule}
                      </div>
                      <div className="sc-card__info-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        {course.time}
                      </div>
                      <div className="sc-card__info-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        {course.modules} modules
                      </div>
                      <div className="sc-card__info-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {course.credits} credits
                      </div>
                    </div>

                    {/* Seats */}
                    <div className="sc-card__seats">
                      <div className="sc-card__seats-label">
                        <span>{isFull ? 'Course Full' : `${course.seats} seats available`}</span>
                        <span>{course.totalSeats - course.seats}/{course.totalSeats} enrolled</span>
                      </div>
                      <div className="sc-card__seats-bar">
                        <div
                          className="sc-card__seats-fill"
                          style={{
                            width: `${100 - seatsPercent}%`,
                            background: isFull ? '#ef4444' : course.color
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="sc-card__actions">
                      {isEnrolled ? (
                        <>
                          <button
                            className="sc-card__btn sc-card__btn--details"
                            onClick={() => navigate(`/course/${course.id}`)}
                          >
                            View Details
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                          <button
                            className="sc-card__btn sc-card__btn--unenroll"
                            onClick={() => handleUnenroll(course)}
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          className={`sc-card__btn sc-card__btn--enroll ${isFull ? 'sc-card__btn--full' : ''}`}
                          onClick={() => !isFull && handleEnroll(course)}
                          disabled={isFull || isEnrolling}
                        >
                          {isEnrolling ? (
                            <><span className="sc-btn-spinner" /> Enrolling...</>
                          ) : isFull ? (
                            'Course Full'
                          ) : (
                            <>
                              Enroll Now
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                              </svg>
                            </>
                          )}
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

      {/* Toast */}
      {toast && (
        <div className={`sc-toast sc-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : 'ℹ️'} {toast.msg}
        </div>
      )}

      <Footer />
    </>
  )
}
