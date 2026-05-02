import { useState } from 'react'
import './StudentsTable.css'

const allStudents = [
  { id: 1, name: 'Alex Johnson',   email: 'alex.j@university.edu',    course: 'Database Systems',     enrolled: '2024-09-01', status: 'Active' },
  { id: 2, name: 'Maria Garcia',   email: 'maria.g@university.edu',   course: 'Database Systems',     enrolled: '2024-09-01', status: 'Active' },
  { id: 3, name: 'James Wilson',   email: 'james.w@university.edu',   course: 'Software Engineering', enrolled: '2024-09-02', status: 'Active' },
  { id: 4, name: 'Fatima Al-Said', email: 'fatima.s@university.edu',  course: 'Software Engineering', enrolled: '2024-09-02', status: 'Active' },
  { id: 5, name: 'Chen Wei',       email: 'chen.w@university.edu',    course: 'Data Structures',      enrolled: '2024-09-03', status: 'Active' },
  { id: 6, name: 'Sara Ahmed',     email: 'sara.a@university.edu',    course: 'Data Structures',      enrolled: '2024-09-03', status: 'Active' },
  { id: 7, name: 'Omar Hassan',    email: 'omar.h@university.edu',    course: 'Database Systems',     enrolled: '2024-09-01', status: 'Active' },
  { id: 8, name: 'Lena Müller',    email: 'lena.m@university.edu',    course: 'Software Engineering', enrolled: '2024-09-02', status: 'Active' },
]

const courses = ['All Courses', 'Database Systems', 'Software Engineering', 'Data Structures']

export default function StudentsTable() {
  const [filter, setFilter] = useState('All Courses')
  const [search, setSearch] = useState('')

  const filtered = allStudents.filter((s) => {
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

      {/* Filters */}
      <div className="students-table__filters">
        <input
          className="students-table__search"
          placeholder="🔍  Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="students-table__tabs">
          {courses.map((c) => (
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
                  <td className="students-table__date">{s.enrolled}</td>
                  <td>
                    <span className="students-table__status">{s.status}</span>
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
