import { useState } from 'react'
import './MyCourses.css'

const initialCourses = [
  { id: 1, title: 'Database Systems',     code: 'CS301', description: 'Covers relational databases, SQL, normalization and transactions.',          day: 'Mon / Wed',       startTime: '10:00', endTime: '11:30', capacity: 30, students: 28, status: 'Active',   color: '#4f46e5' },
  { id: 2, title: 'Software Engineering', code: 'CS402', description: 'Software development lifecycle, design patterns and project management.',    day: 'Tue / Thu',       startTime: '13:00', endTime: '14:30', capacity: 25, students: 25, status: 'Full',     color: '#06b6d4' },
  { id: 3, title: 'Data Structures',      code: 'CS201', description: 'Arrays, linked lists, trees, graphs and algorithm complexity.',              day: 'Mon / Wed / Fri', startTime: '09:00', endTime: '10:00', capacity: 40, students: 34, status: 'Active',   color: '#10b981' },
  { id: 4, title: 'Operating Systems',    code: 'CS303', description: 'Process management, memory, file systems and concurrency.',                  day: 'Thu',             startTime: '15:00', endTime: '17:00', capacity: 30, students: 0,  status: 'Upcoming', color: '#8b5cf6' },
]

const emptyForm = { title: '', code: '', description: '', day: '', startTime: '', endTime: '', capacity: '' }

const statusStyle = {
  Active:   { bg: '#dcfce7', color: '#16a34a' },
  Full:     { bg: '#fee2e2', color: '#dc2626' },
  Upcoming: { bg: '#fef9c3', color: '#ca8a04' },
}

export default function MyCourses({ compact = false }) {
  const [courses, setCourses]   = useState(initialCourses)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(emptyForm)

  const openAdd  = () => { setEditId(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (c) => {
    setEditId(c.id)
    setForm({ title: c.title, code: c.code, description: c.description, day: c.day, startTime: c.startTime, endTime: c.endTime, capacity: c.capacity })
    setShowForm(true)
  }
  const handleDelete = (id) => setCourses(courses.filter((c) => c.id !== id))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editId) {
      setCourses(courses.map((c) => c.id === editId ? { ...c, ...form, capacity: Number(form.capacity) } : c))
    } else {
      setCourses([...courses, { id: Date.now(), ...form, capacity: Number(form.capacity), students: 0, status: 'Upcoming', color: '#4f46e5' }])
    }
    setShowForm(false)
    setEditId(null)
    setForm(emptyForm)
  }

  const field = (label, key, type = 'text', placeholder = '') => (
    <div className="cf__field">
      <label>{label}</label>
      <input type={type} required value={form[key]} placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </div>
  )

  return (
    <div className="my-courses">
      {/* Header */}
      <div className="my-courses__header">
        <div>
          <h2 className="my-courses__title">My Courses</h2>
          {!compact && <p className="my-courses__sub">Manage your courses, schedules and capacity</p>}
        </div>
        <button className="mc-add-btn" onClick={openAdd}>+ Add New Course</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="cf">
          <div className="cf__head">
            <h3>{editId ? 'Edit Course' : 'Add New Course'}</h3>
            <button className="cf__close" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className="cf__body">
            <div className="cf__row">
              {field('Course Title',  'title',       'text',   'e.g. Database Systems')}
              {field('Course Code',   'code',        'text',   'e.g. CS301')}
            </div>
            <div className="cf__field cf__field--full">
              <label>Description</label>
              <textarea required rows={2} value={form.description} placeholder="Brief course description…"
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="cf__row">
              {field('Day(s)',       'day',       'text',   'e.g. Mon / Wed')}
              {field('Start Time',  'startTime', 'time')}
              {field('End Time',    'endTime',   'time')}
            </div>
            <div className="cf__row">
              {field('Capacity', 'capacity', 'number', 'e.g. 30')}
            </div>
            <div className="cf__actions">
              <button type="submit" className="cf__submit">{editId ? 'Save Changes' : 'Add Course'}</button>
              <button type="button" className="cf__cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Code</th>
              <th>Schedule</th>
              <th>Students</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => {
              const st  = statusStyle[c.status] || statusStyle.Active
              const pct = c.capacity ? Math.round((c.students / c.capacity) * 100) : 0
              return (
                <tr key={c.id}>
                  <td>
                    <div className="mc-course-cell">
                      <span className="mc-course-dot" style={{ background: c.color }} />
                      <div>
                        <p className="mc-course-name">{c.title}</p>
                        <p className="mc-course-desc">{c.description}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="mc-code" style={{ color: c.color }}>{c.code}</span></td>
                  <td>
                    <p className="mc-day">{c.day}</p>
                    <p className="mc-time">{c.startTime} – {c.endTime}</p>
                  </td>
                  <td>
                    <div className="mc-seats">
                      <span>{c.students} / {c.capacity}</span>
                      <div className="mc-seats-bar">
                        <div className="mc-seats-fill" style={{ width: `${pct}%`, background: c.color }} />
                      </div>
                    </div>
                  </td>
                  <td className="mc-cap">{c.capacity}</td>
                  <td><span className="mc-status" style={{ background: st.bg, color: st.color }}>{c.status}</span></td>
                  <td>
                    <div className="mc-actions">
                      <button className="mc-btn mc-btn--view"   title="View">👁</button>
                      <button className="mc-btn mc-btn--edit"   title="Edit"   onClick={() => openEdit(c)}>✏️</button>
                      <button className="mc-btn mc-btn--delete" title="Delete" onClick={() => handleDelete(c.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
