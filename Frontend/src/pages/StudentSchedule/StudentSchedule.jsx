import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import './StudentSchedule.css'

const API_URL = 'http://localhost:5000/api'

// Color palette for courses
const COURSE_COLORS = [
  { color: '#4f46e5', bg: '#eef2ff' },
  { color: '#06b6d4', bg: '#ecfeff' },
  { color: '#10b981', bg: '#ecfdf5' },
  { color: '#8b5cf6', bg: '#f5f3ff' },
  { color: '#f59e0b', bg: '#fffbeb' },
  { color: '#ef4444', bg: '#fef2f2' },
  { color: '#ec4899', bg: '#fdf2f8' },
  { color: '#14b8a6', bg: '#f0fdfa' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const DAY_LABELS = { 
  Mon: 'Monday', 
  Tue: 'Tuesday', 
  Wed: 'Wednesday', 
  Thu: 'Thursday', 
  Fri: 'Friday' 
}

// Map backend day names to short names
const DAY_MAP = {
  'Monday': 'Mon',
  'Tuesday': 'Tue',
  'Wednesday': 'Wed',
  'Thursday': 'Thu',
  'Friday': 'Fri',
  'Saturday': 'Sat',
  'Sunday': 'Sun'
}

// Time slots from 8:00 to 18:00
const TIME_SLOTS = []
for (let h = 8; h <= 17; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`)
  if (h < 17) TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`)
}

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function timesOverlap(startA, endA, startB, endB) {
  return timeToMinutes(startA) < timeToMinutes(endB) &&
         timeToMinutes(endA)   > timeToMinutes(startB)
}

function formatTime12(t) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

// Grid start = 8:00 = 480 min, each 30min = 1 row unit (40px)
const GRID_START = 8 * 60
const ROW_HEIGHT = 40 // px per 30 min

export default function StudentSchedule() {
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [view, setView] = useState('week') // 'week' | 'list'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { 
      navigate('/login')
      return 
    }
    fetchSchedule(token)
  }, [navigate])

  const fetchSchedule = async (token) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching schedule from:', `${API_URL}/schedules/my`)
      
      const response = await fetch(`${API_URL}/schedules/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', errorData)
        throw new Error(errorData.message || `Failed to fetch schedule (${response.status})`)
      }

      const data = await response.json()
      console.log('Schedule data received:', data)
      
      // Transform backend data to frontend format
      const transformedSchedules = data.map((schedule, index) => ({
        id: schedule.id,
        courseId: schedule.courseId,
        name: schedule.course.title,
        instructor: schedule.course.instructor?.name || 'Unknown',
        color: COURSE_COLORS[index % COURSE_COLORS.length].color,
        deptBg: COURSE_COLORS[index % COURSE_COLORS.length].bg,
        icon: schedule.course.icon || '📚',
        day: DAY_MAP[schedule.day] || schedule.day,
        fullDay: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room || 'TBA',
        credits: 3, // Default, could be added to backend
      }))

      console.log('Transformed schedules:', transformedSchedules)
      setSchedules(transformedSchedules)
    } catch (err) {
      console.error('Error fetching schedule:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Group schedules by course
  const courseMap = {}
  schedules.forEach(schedule => {
    if (!courseMap[schedule.courseId]) {
      courseMap[schedule.courseId] = {
        ...schedule,
        days: [schedule.day]
      }
    } else {
      if (!courseMap[schedule.courseId].days.includes(schedule.day)) {
        courseMap[schedule.courseId].days.push(schedule.day)
      }
    }
  })

  const enrolledCourses = Object.values(courseMap)

  // Build schedule: for each day, list of schedules
  const scheduleByDay = {}
  DAYS.forEach(day => {
    scheduleByDay[day] = schedules.filter(s => s.day === day)
  })

  // Upcoming classes (next 7 days from today)
  const today = new Date()
  const dayMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' }
  const upcoming = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dayKey = dayMap[d.getDay()]
    const classes = schedules.filter(s => s.day === dayKey)
    if (classes.length > 0) {
      upcoming.push({ date: d, dayKey, classes })
    }
  }

  const totalCredits = enrolledCourses.reduce((s, c) => s + c.credits, 0)
  const totalClassesPerWeek = schedules.length

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="ss-page">
          <div className="ss-container">
            <div className="ss-empty">
              <div className="ss-empty__icon">⏳</div>
              <h3 className="ss-empty__title">Loading schedule...</h3>
            </div>
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
        <main className="ss-page">
          <div className="ss-container">
            <div className="ss-empty">
              <div className="ss-empty__icon">⚠️</div>
              <h3 className="ss-empty__title">Error loading schedule</h3>
              <p className="ss-empty__text">{error}</p>
              <button className="ss-empty__btn" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="ss-page">
        <div className="ss-container">

          {/* Header */}
          <div className="ss-header">
            <div>
              <h1 className="ss-title">
                My <span className="ss-highlight">Schedule</span>
              </h1>
              <p className="ss-subtitle">
                View your weekly class schedule and upcoming sessions.
              </p>
            </div>
            <div className="ss-header-actions">
              <div className="ss-view-toggle">
                <button
                  className={`ss-view-btn ${view === 'week' ? 'ss-view-btn--active' : ''}`}
                  onClick={() => setView('week')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                  </svg>
                  Week
                </button>
                <button
                  className={`ss-view-btn ${view === 'list' ? 'ss-view-btn--active' : ''}`}
                  onClick={() => setView('list')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  List
                </button>
              </div>
              <button className="ss-courses-btn" onClick={() => navigate('/student/courses')}>
                Browse Courses
              </button>
            </div>
          </div>

          {/* Stats row */}
          {enrolledCourses.length > 0 && (
            <div className="ss-stats">
              <div className="ss-stat">
                <span className="ss-stat__icon">📚</span>
                <div>
                  <p className="ss-stat__value">{enrolledCourses.length}</p>
                  <p className="ss-stat__label">Courses</p>
                </div>
              </div>
              <div className="ss-stat">
                <span className="ss-stat__icon">🗓️</span>
                <div>
                  <p className="ss-stat__value">{totalClassesPerWeek}</p>
                  <p className="ss-stat__label">Classes / Week</p>
                </div>
              </div>
              <div className="ss-stat">
                <span className="ss-stat__icon">⭐</span>
                <div>
                  <p className="ss-stat__value">{totalCredits}</p>
                  <p className="ss-stat__label">Total Credits</p>
                </div>
              </div>
              <div className="ss-stat">
                <span className="ss-stat__icon">⏱️</span>
                <div>
                  <p className="ss-stat__value">{totalClassesPerWeek * 1.5}h</p>
                  <p className="ss-stat__label">Hours / Week</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {schedules.length === 0 ? (
            <div className="ss-empty">
              <div className="ss-empty__icon">🗓️</div>
              <h3 className="ss-empty__title">No classes scheduled</h3>
              <p className="ss-empty__text">
                Enroll in courses to see your schedule here.
              </p>
              <button className="ss-empty__btn" onClick={() => navigate('/student/courses')}>
                Browse Courses
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : view === 'week' ? (
            /* ===== WEEK VIEW ===== */
            <div className="ss-week-wrap">

              {/* Conflict warning banner */}
              {(() => {
                const conflicts = []
                DAYS.forEach(day => {
                  const dayS = scheduleByDay[day]
                  const sorted = [...dayS].sort((a,b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
                  for (let i = 0; i < sorted.length; i++) {
                    for (let j = i + 1; j < sorted.length; j++) {
                      if (timesOverlap(sorted[i].startTime, sorted[i].endTime, sorted[j].startTime, sorted[j].endTime)) {
                        conflicts.push({ day: DAY_LABELS[day], a: sorted[i].name, b: sorted[j].name })
                      }
                    }
                  }
                })
                if (conflicts.length === 0) return null
                return (
                  <div className="ss-conflict-banner">
                    <span className="ss-conflict-banner__icon">⚠️</span>
                    <div>
                      <p className="ss-conflict-banner__title">Schedule Conflicts Detected</p>
                      {conflicts.map((c, i) => (
                        <p key={i} className="ss-conflict-banner__detail">
                          {c.day}: <strong>{c.a}</strong> overlaps with <strong>{c.b}</strong>
                        </p>
                      ))}
                      <p className="ss-conflict-banner__hint">Drop one of the conflicting courses to resolve this.</p>
                    </div>
                  </div>
                )
              })()}
              <div className="ss-week">
                {/* Time column */}
                <div className="ss-time-col">
                  <div className="ss-time-col__header" />
                  {TIME_SLOTS.map((slot, i) => (
                    <div key={slot} className={`ss-time-slot ${i % 2 === 0 ? 'ss-time-slot--hour' : ''}`}>
                      {i % 2 === 0 && <span>{formatTime12(slot)}</span>}
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {DAYS.map(day => (
                  <div key={day} className="ss-day-col">
                    <div className="ss-day-col__header">
                      <span className="ss-day-col__name">{day}</span>
                      <span className="ss-day-col__full">{DAY_LABELS[day]}</span>
                    </div>
                    <div className="ss-day-col__body">
                      {/* Grid lines */}
                      {TIME_SLOTS.map((slot, i) => (
                        <div key={slot} className={`ss-grid-line ${i % 2 === 0 ? 'ss-grid-line--hour' : ''}`} />
                      ))}

                      {/* Course blocks — detect overlaps and split into columns */}
                      {(() => {
                        const daySchedules = scheduleByDay[day]
                        if (daySchedules.length === 0) return null

                        // Sort by start time
                        const sorted = [...daySchedules].sort(
                          (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
                        )

                        // Assign column index to each event to avoid overlap
                        const columns = []   // columns[i] = end time of last event in that column
                        const colAssign = sorted.map(s => {
                          const start = timeToMinutes(s.startTime)
                          const col = columns.findIndex(endMin => endMin <= start)
                          if (col === -1) {
                            columns.push(timeToMinutes(s.endTime))
                            return columns.length - 1
                          }
                          columns[col] = timeToMinutes(s.endTime)
                          return col
                        })
                        const totalCols = columns.length

                        return sorted.map((schedule, i) => {
                          const startMin = timeToMinutes(schedule.startTime)
                          const endMin   = timeToMinutes(schedule.endTime)
                          const top      = ((startMin - GRID_START) / 30) * ROW_HEIGHT
                          const height   = ((endMin - startMin) / 30) * ROW_HEIGHT
                          const col      = colAssign[i]
                          const isConflict = totalCols > 1

                          return (
                            <div
                              key={schedule.id}
                              className={`ss-event ${isConflict ? 'ss-event--conflict' : ''}`}
                              style={{
                                top:      `${top}px`,
                                height:   `${height}px`,
                                left:     `${(col / totalCols) * 100}%`,
                                width:    `${(1 / totalCols) * 100}%`,
                                background: isConflict ? '#fef2f2' : `${schedule.color}18`,
                                borderLeft: `3px solid ${isConflict ? '#ef4444' : schedule.color}`,
                                color:      isConflict ? '#ef4444' : schedule.color,
                              }}
                              onClick={() => setSelectedCourse(schedule)}
                            >
                              {isConflict && (
                                <span className="ss-event__conflict-badge">⚠️</span>
                              )}
                              <span className="ss-event__icon">{schedule.icon}</span>
                              <div className="ss-event__content">
                                <p className="ss-event__name">{schedule.name}</p>
                                <p className="ss-event__time">
                                  {formatTime12(schedule.startTime)} – {formatTime12(schedule.endTime)}
                                </p>
                                <p className="ss-event__room">{schedule.room}</p>
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ===== LIST VIEW ===== */
            <div className="ss-list">
              {DAYS.map(day => {
                const classes = scheduleByDay[day]
                if (classes.length === 0) return null
                return (
                  <div key={day} className="ss-list-day">
                    <div className="ss-list-day__header">
                      <h3 className="ss-list-day__name">{DAY_LABELS[day]}</h3>
                      <span className="ss-list-day__count">{classes.length} class{classes.length > 1 ? 'es' : ''}</span>
                    </div>
                    <div className="ss-list-day__classes">
                      {classes
                        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
                        .map(course => (
                          <div
                            key={course.id}
                            className="ss-list-item"
                            style={{ borderLeft: `4px solid ${course.color}` }}
                            onClick={() => navigate(`/student/courses/${course.courseId}`)}
                          >
                            <div className="ss-list-item__time">
                              <p className="ss-list-item__start">{formatTime12(course.startTime)}</p>
                              <p className="ss-list-item__end">{formatTime12(course.endTime)}</p>
                            </div>
                            <div className="ss-list-item__icon" style={{ background: course.deptBg, color: course.color }}>
                              {course.icon}
                            </div>
                            <div className="ss-list-item__info">
                              <p className="ss-list-item__name">{course.name}</p>
                              <p className="ss-list-item__instructor">{course.instructor}</p>
                            </div>
                            <div className="ss-list-item__meta">
                              <span className="ss-list-item__room">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                {course.room}
                              </span>
                              <span className="ss-list-item__credits">{course.credits} cr</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Upcoming classes */}
          {enrolledCourses.length > 0 && upcoming.length > 0 && (
            <div className="ss-upcoming">
              <div className="ss-section-header">
                <h2 className="ss-section-title">Upcoming Classes</h2>
                <p className="ss-section-subtitle">Your next 7 days</p>
              </div>
              <div className="ss-upcoming-list">
                {upcoming.map(({ date, dayKey, classes }) => (
                  <div key={date.toISOString()} className="ss-upcoming-day">
                    <div className="ss-upcoming-date">
                      <span className="ss-upcoming-date__day">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="ss-upcoming-date__num">{date.getDate()}</span>
                      <span className="ss-upcoming-date__month">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="ss-upcoming-classes">
                      {classes
                        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
                        .map(course => (
                          <div
                            key={course.id}
                            className="ss-upcoming-item"
                            onClick={() => navigate(`/student/courses/${course.courseId}`)}
                          >
                            <div
                              className="ss-upcoming-item__dot"
                              style={{ background: course.color }}
                            />
                            <div className="ss-upcoming-item__info">
                              <p className="ss-upcoming-item__name">{course.name}</p>
                              <p className="ss-upcoming-item__time">
                                {formatTime12(course.startTime)} – {formatTime12(course.endTime)} · {course.room}
                              </p>
                            </div>
                            <span className="ss-upcoming-item__icon">{course.icon}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Course detail modal */}
      {selectedCourse && (
        <div className="ss-modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <button className="ss-modal__close" onClick={() => setSelectedCourse(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="ss-modal__icon" style={{ background: selectedCourse.deptBg, color: selectedCourse.color }}>
              {selectedCourse.icon}
            </div>
            <h3 className="ss-modal__title">{selectedCourse.name}</h3>
            <p className="ss-modal__instructor">{selectedCourse.instructor}</p>
            <div className="ss-modal__details">
              <div className="ss-modal__detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {formatTime12(selectedCourse.startTime)} – {formatTime12(selectedCourse.endTime)}
              </div>
              <div className="ss-modal__detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {selectedCourse.days.join(' / ')}
              </div>
              <div className="ss-modal__detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                Room {selectedCourse.room}
              </div>
              <div className="ss-modal__detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {selectedCourse.credits} Credits
              </div>
            </div>
            <button
              className="ss-modal__btn"
              style={{ background: selectedCourse.color }}
              onClick={() => { setSelectedCourse(null); navigate(`/student/courses/${selectedCourse.courseId}`) }}
            >
              View Course Details
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
