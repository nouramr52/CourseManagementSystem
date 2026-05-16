import { useState, useEffect } from 'react'
import { getInstructorStudents } from '../../../api/instructorApi'
import { getMyCourses } from '../../../api/courseApi'
import './StudentsTable.css'

export default function StudentsTable() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [filter, setFilter] = useState('All Courses')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          getInstructorStudents(),
          getMyCourses(),
        ])
        setStudents(studentsRes.data)
        setCourses(coursesRes.data)
      } catch {
        setError('Failed to load students')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const courseTitles = ['All Courses', ...courses.map((c) => c.title)]

  const filtered = students.filter((s) => {
    const matchCourse = filter === 'All Courses' || s.course === filter
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    return matchCourse && matchSearch
  })

  return (
    <div className="students-table">
      {/* Header */}
      <div className="students-table__header">
        <div>
          <h2 className="students-table__title">Enrolled Students</h2>
          <p className="students-table__sub">Students enrolled in your courses</p>
        </div>
        <span className="students-table__count">{filtered.length} students</span>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}

      {/* Filters */}
      <div className="students-table__filters">
        <input
          className="students-table__search"
          placeholder="🔍  Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="students-table__tabs">
          {courseTitles.map((c) => (
            <button
              key={c}
              className={`students-table__tab ${filter === c ? 'students-table__tab--active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="students-table__wrap">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading students…</p>
        ) : (
          <table className="students-table__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Enrollment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="students-table__empty">No students found.</td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td className="students-table__num">{i + 1}</td>
                    <td>
                      <div className="students-table__name-cell">
                        <div className="students-table__avatar">
                          {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span>{s.name}</span>
                      </div>
                    </td>
                    <td className="students-table__email">{s.email}</td>
                    <td>
                      <span className="students-table__course">{s.course}</span>
                    </td>
                    <td className="students-table__date">
                      {new Date(s.enrolled).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="students-table__status">{s.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
