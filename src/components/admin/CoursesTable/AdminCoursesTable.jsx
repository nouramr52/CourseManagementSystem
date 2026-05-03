import { useState } from 'react'
import './AdminCoursesTable.css'

const allCourses = [
  { id: 1, name: 'Database Systems',      code: 'CS301', instructor: 'Dr. Sarah Lee',   students: 28, capacity: 30, status: 'Active',   color: '#4f46e5', schedule: 'Mon / Wed 10:00 AM' },
  { id: 2, name: 'Software Engineering',  code: 'CS402', instructor: 'Prof. M. Chen',   students: 25, capacity: 25, status: 'Full',     color: '#06b6d4', schedule: 'Tue / Thu 1:00 PM'  },
  { id: 3, name: 'Data Structures',       code: 'CS201', instructor: 'Dr. Emily R.',    students: 34, capacity: 40, status: 'Active',   color: '#10b981', schedule: 'Mon / Fri 9:00 AM'  },
  { id: 4, name: 'Operating Systems',     code: 'CS303', instructor: 'Dr. Emily R.',    students: 0,  capacity: 30, status: 'Upcoming', color: '#8b5cf6', schedule: 'Thu 1:00 PM'        },
  { id: 5, name: 'Machine Learning',      code: 'CS501', instructor: 'Prof. James W.',  students: 18, capacity: 35, status: 'Active',   color: '#f59e0b', schedule: 'Wed / Fri 2:00 PM'  },
  { id: 6, name: 'Computer Networks',     code: 'CS401', instructor: 'Dr. Sarah Lee',   students: 22, capacity: 30, status: 'Active',   color: '#ef4444', schedule: 'Tue / Thu 3:00 PM'  },
  { id: 7, name: 'Algorithms',            code: 'CS302', instructor: 'Prof. M. Chen',   students: 30, capacity: 30, status: 'Full',     color: '#0ea5e9', schedule: 'Mon / Wed 2:00 PM'  },
  { id: 8, name: 'Web Development',       code: 'CS450', instructor: 'Prof. James W.',  students: 12, capacity: 40, status: 'Active',   color: '#14b8a6', schedule: 'Fri 10:00 AM'       },
]

const statuses = ['All', 'Active', 'Full', 'Upcoming']

const statusStyle = {
  Active:   { bg: '#dcfce7', color: '#16a34a' },
  Full:     { bg: '#fee2e2', color: '#dc2626' },
  Upcoming: { bg: '#fef9c3', color: '#ca8a04' },
}

export default function AdminCoursesTable() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState(allCourses)

  const filtered = courses.filter((c) => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="admin-courses">
      {/* Header */}
      <div className="admin-courses__header">
        <div>
          <h2 className="admin-courses__title">Courses</h2>
          <p className="admin-courses__sub">Manage all courses on the platform</p>
        </div>
        <button className="admin-courses__add-btn">+ Add Course</button>
      </div>

      {/* Filters */}
      <div className="admin-courses__filters">
        <input
          className="admin-courses__search"
          placeholder="🔍  Search by name, code, or instructor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="admin-courses__tabs">
          {statuses.map((s) => (
            <button
              key={s}
              className={`admin-courses__tab ${statusFilter === s ? 'admin-courses__tab--active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="admin-courses__count">{filtered.length} courses</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="admin-courses__empty">No courses found.</div>
      ) : (
        <div className="admin-courses__grid">
          {filtered.map((c) => {
            const fill = Math.round((c.students / c.capacity) * 100)
            return (
              <div className="admin-course-card" key={c.id}>
                <div className="admin-course-card__top" style={{ background: c.color }} />
                <div className="admin-course-card__body">
                  <div className="admin-course-card__header">
                    <div>
                      <div className="admin-course-card__name">{c.name}</div>
                      <div className="admin-course-card__code">{c.code}</div>
                    </div>
                    <span
                      className="admin-badge"
                      style={{ background: statusStyle[c.status]?.bg, color: statusStyle[c.status]?.color }}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="admin-course-card__meta">
                    <div className="admin-course-card__meta-row">👨‍🏫 {c.instructor}</div>
                    <div className="admin-course-card__meta-row">📅 {c.schedule}</div>
                    <div className="admin-course-card__meta-row">👥 {c.students} / {c.capacity} students</div>
                  </div>

                  <div className="admin-course-card__progress-label">
                    <span>Enrollment</span>
                    <span>{fill}%</span>
                  </div>
                  <div className="admin-course-card__progress-bar">
                    <div
                      className="admin-course-card__progress-fill"
                      style={{ width: `${fill}%`, background: c.color }}
                    />
                  </div>

                  <div className="admin-course-card__footer">
                    <button className="admin-course-card__btn">Edit</button>
                    <button
                      className="admin-course-card__btn admin-course-card__btn--danger"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
