import { useState, useEffect } from 'react'
import { getInstructorSchedule } from '../../../api/instructorApi'
import './Schedule.css'

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Assign a consistent color per course id
const COLORS = [
  { color: '#10b981', bg: '#ecfdf5' },
  { color: '#4f46e5', bg: '#eef2ff' },
  { color: '#06b6d4', bg: '#ecfeff' },
  { color: '#8b5cf6', bg: '#f5f3ff' },
  { color: '#f59e0b', bg: '#fffbeb' },
  { color: '#ec4899', bg: '#fdf2f8' },
]

const getCourseColor = (courseId) => COLORS[courseId % COLORS.length]

export default function Schedule({ compact = false }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getInstructorSchedule()
      .then((res) => setSessions(res.data))
      .catch(() => setError('Failed to load schedule'))
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  // Group sessions by day, preserving DAY_ORDER
  const grouped = DAY_ORDER.reduce((acc, day) => {
    const ds = sessions.filter((s) => s.day === day)
    if (ds.length) acc[day] = ds
    return acc
  }, {})

  const conflictCount = sessions.filter((s) => s.conflict).length

  if (loading) {
    return (
      <div className="schedule">
        <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading schedule…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="schedule">
        <p style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="schedule">
      <div className="schedule__header">
        <div>
          <h2 className="schedule__title">Weekly Schedule</h2>
          {!compact && <p className="schedule__sub">Your online teaching timetable for this semester</p>}
        </div>
        <div className="schedule__header-right">
          {conflictCount > 0 && (
            <span className="schedule__conflict-pill">
              ⚠️ {conflictCount} conflict{conflictCount > 1 ? 's' : ''}  detected
            </span>
          )}
          <span className="schedule__today-pill">Today: {today}</span>
        </div>
      </div>

      {/* Conflict notice */}
      {conflictCount > 0 && !compact && (
        <div className="schedule__conflict-notice">
          <span>⚠️</span>
          <p>
            <strong>{conflictCount} schedule conflict{conflictCount > 1 ? 's' : ''} detected.</strong>{' '}
            The highlighted sessions have overlapping time slots on the same day. Please contact the admin to resolve.
          </p>
        </div>
      )}

      {sessions.length === 0 ? (
        <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
          No schedule slots yet. Add schedule slots when creating a course.
        </p>
      ) : (
        <div className="schedule__table-wrap">
          <table className="schedule__table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([day, daySessions]) =>
                daySessions.map((s, i) => {
                  const { color, bg } = getCourseColor(s.courseId)
                  return (
                    <tr
                      key={s.id}
                      className={[
                        day === today ? 'schedule__row--today' : '',
                        s.conflict ? 'schedule__row--conflict' : '',
                      ].join(' ')}
                    >
                      {i === 0 && (
                        <td rowSpan={daySessions.length} className="schedule__day-cell">
                          <div className="schedule__day-label">
                            {day === today && <span className="schedule__today-dot" />}
                            {day}
                          </div>
                        </td>
                      )}
                      <td>
                        <span className="schedule__time">{s.startTime} – {s.endTime}</span>
                      </td>
                      <td>
                        <div className="schedule__course-cell">
                          <span
                            className="schedule__course-bar"
                            style={{ background: s.conflict ? '#ef4444' : color }}
                          />
                          <div>
                            <span className="schedule__course-name">{s.course?.title}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {s.conflict
                          ? <span className="schedule__conflict-tag">⚠️ Conflict</span>
                          : <span className="schedule__ok-tag">✓ OK</span>
                        }
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
