import './Schedule.css'

const sessions = [
  { id: 1, course: 'Data Structures',      code: 'CS201', day: 'Monday',    start: '09:00', end: '10:00', color: '#10b981', bg: '#ecfdf5' },
  { id: 2, course: 'Database Systems',     code: 'CS301', day: 'Monday',    start: '10:00', end: '11:30', color: '#4f46e5', bg: '#eef2ff' },
  { id: 3, course: 'Software Engineering', code: 'CS402', day: 'Tuesday',   start: '13:00', end: '14:30', color: '#06b6d4', bg: '#ecfeff' },
  { id: 4, course: 'Data Structures',      code: 'CS201', day: 'Wednesday', start: '09:00', end: '10:00', color: '#10b981', bg: '#ecfdf5' },
  { id: 5, course: 'Database Systems',     code: 'CS301', day: 'Wednesday', start: '10:00', end: '11:30', color: '#4f46e5', bg: '#eef2ff' },
  { id: 6, course: 'Software Engineering', code: 'CS402', day: 'Thursday',  start: '13:00', end: '14:30', color: '#06b6d4', bg: '#ecfeff' },
  { id: 7, course: 'Operating Systems',    code: 'CS303', day: 'Thursday',  start: '13:00', end: '15:00', color: '#8b5cf6', bg: '#f5f3ff' },
]

const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function toMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// Mark sessions that overlap on the same day
function markConflicts(list) {
  return list.map((s) => {
    const sameDay = list.filter((x) => x.id !== s.id && x.day === s.day)
    const hasConflict = sameDay.some(
      (x) => toMin(s.start) < toMin(x.end) && toMin(s.end) > toMin(x.start)
    )
    return { ...s, conflict: hasConflict }
  })
}

const markedSessions = markConflicts(sessions)

const grouped = dayOrder.reduce((acc, day) => {
  const ds = markedSessions.filter((s) => s.day === day)
  if (ds.length) acc[day] = ds
  return acc
}, {})

const conflictCount = markedSessions.filter((s) => s.conflict).length

export default function Schedule({ compact = false }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

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
              ⚠️ {conflictCount} conflict{conflictCount > 1 ? 's' : ''} detected
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

      {/* Table */}
      <div className="schedule__table-wrap">
        <table className="schedule__table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Course</th>
              <th>Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([day, daySessions]) =>
              daySessions.map((s, i) => (
                <tr
                  key={s.id}
                  className={[
                    day === today ? 'schedule__row--today' : '',
                    s.conflict    ? 'schedule__row--conflict' : '',
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
                    <span className="schedule__time">{s.start} – {s.end}</span>
                  </td>
                  <td>
                    <div className="schedule__course-cell">
                      <span
                        className="schedule__course-bar"
                        style={{ background: s.conflict ? '#ef4444' : s.color }}
                      />
                      <span className="schedule__course-name">{s.course}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="schedule__code"
                      style={{
                        color:      s.conflict ? '#dc2626' : s.color,
                        background: s.conflict ? '#fee2e2' : s.bg,
                      }}
                    >
                      {s.code}
                    </span>
                  </td>
                  <td>
                    {s.conflict
                      ? <span className="schedule__conflict-tag">⚠️ Conflict</span>
                      : <span className="schedule__ok-tag">✓ OK</span>
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
