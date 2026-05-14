import { useState, useEffect } from 'react'
import { createCourse, getMyCourses, deleteCourse } from '../../../api/courseApi'
import './MyCourses.css'

// One empty schedule slot — instructor can add more
const emptySlot = { day: '', startTime: '', endTime: '' }

const DEPTS = [
  'Computer Science',
  'Information Systems',
  'Cybersecurity',
  'Software Engineering',
  'Data Science',
  'Networking',
  'Artificial Intelligence',
  'Mathematics',
  'Physics',
  'General',
]

const ICONS = [
  { label: '🗄️ Database',        value: '🗄️' },
  { label: '⚙️ Engineering',     value: '⚙️' },
  { label: '🌐 Web',             value: '🌐' },
  { label: '💻 Systems',         value: '💻' },
  { label: '🔐 Security',        value: '🔐' },
  { label: '📊 Data',            value: '📊' },
  { label: '🤖 AI',              value: '🤖' },
  { label: '🧮 Math',            value: '🧮' },
  { label: '📚 General',         value: '📚' },
  { label: '🔬 Science',         value: '🔬' },
  { label: '📡 Networking',      value: '📡' },
  { label: '☁️ Cloud',           value: '☁️' },
]

const emptyForm = {
  title: '',
  description: '',
  capacity: '',
  dept: '',
  icon: '📚',
  schedules: [{ ...emptySlot }],  // start with one slot
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function MyCourses({ compact = false }) {
  const [courses, setCourses]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  const loadCourses = async () => {
    try {
      const res = await getMyCourses()
      setCourses(res.data)
    } catch (err) {
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCourses() }, [])

  // Update a specific schedule slot field
  const updateSlot = (index, field, value) => {
    const updated = form.schedules.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    )
    setForm({ ...form, schedules: updated })
  }

  // Add another schedule slot (e.g. course meets Mon AND Wed)
  const addSlot = () => {
    setForm({ ...form, schedules: [...form.schedules, { ...emptySlot }] })
  }

  // Remove a schedule slot
  const removeSlot = (index) => {
    setForm({ ...form, schedules: form.schedules.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      // Filter out any incomplete schedule slots before sending
      const validSchedules = form.schedules.filter(
        s => s.day && s.startTime && s.endTime
      )

      await createCourse({
        title: form.title,
        description: form.description,
        capacity: Number(form.capacity),
        dept: form.dept || null,
        icon: form.icon || '📚',
        schedules: validSchedules,   // send schedule slots to backend
      })

      setForm(emptyForm)
      setShowForm(false)
      await loadCourses()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return
    try {
      await deleteCourse(id)
      setCourses(courses.filter(c => c.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course')
    }
  }

  return (
    <div className="my-courses">
      {/* Header */}
      <div className="my-courses__header">
        <div>
          <h2 className="my-courses__title">My Courses</h2>
          {!compact && <p className="my-courses__sub">Manage your courses, schedules and capacity</p>}
        </div>
        <button className="mc-add-btn" onClick={() => { setShowForm(!showForm); setError('') }}>
          + Add New Course
        </button>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}

      {/* ── Add Course Form ── */}
      {showForm && (
        <div className="cf">
          <div className="cf__head">
            <h3>Add New Course</h3>
            <button className="cf__close" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className="cf__body">

            {/* Title + Capacity */}
            <div className="cf__row">
              <div className="cf__field">
                <label>Course Title</label>
                <input
                  required
                  value={form.title}
                  placeholder="e.g. Database Systems"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="cf__field">
                <label>Capacity</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.capacity}
                  placeholder="e.g. 30"
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                />
              </div>
            </div>

            {/* Department + Icon */}
            <div className="cf__row">
              <div className="cf__field">
                <label>Department</label>
                <select
                  value={form.dept}
                  onChange={(e) => setForm({ ...form, dept: e.target.value })}
                  className="cf__schedule-select"
                  style={{ width: '100%' }}
                >
                  <option value="">Select department…</option>
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="cf__field">
                <label>Icon</label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="cf__schedule-select"
                  style={{ width: '100%' }}
                >
                  {ICONS.map(ic => (
                    <option key={ic.value} value={ic.value}>{ic.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="cf__field cf__field--full">
              <label>Description</label>
              <textarea
                rows={2}
                value={form.description}
                placeholder="Brief course description…"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Schedule slots */}
            <div className="cf__field cf__field--full">
              <label>Schedule</label>
              {form.schedules.map((slot, i) => (
                <div key={i} className="cf__schedule-row">
                  {/* Day dropdown */}
                  <select
                    value={slot.day}
                    onChange={(e) => updateSlot(i, 'day', e.target.value)}
                    className="cf__schedule-select"
                  >
                    <option value="">Day</option>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>

                  {/* Start time */}
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateSlot(i, 'startTime', e.target.value)}
                    className="cf__schedule-time"
                  />
                  <span className="cf__schedule-sep">→</span>
                  {/* End time */}
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateSlot(i, 'endTime', e.target.value)}
                    className="cf__schedule-time"
                  />

                  {/* Remove slot button — only show if more than one slot */}
                  {form.schedules.length > 1 && (
                    <button
                      type="button"
                      className="cf__schedule-remove"
                      onClick={() => removeSlot(i)}
                      title="Remove this slot"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {/* Add another day button */}
              <button type="button" className="cf__add-slot" onClick={addSlot}>
                + Add another day
              </button>
            </div>

            <div className="cf__actions">
              <button type="submit" className="cf__submit" disabled={submitting}>
                {submitting ? 'Adding…' : 'Add Course'}
              </button>
              <button type="button" className="cf__cancel" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Courses Table ── */}
      <div className="mc-table-wrap">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading courses…</p>
        ) : (
          <table className="mc-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Capacity</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="mc-empty">No courses yet. Add your first one!</td>
                </tr>
              ) : courses.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="mc-course-cell">
                      <span className="mc-course-dot" style={{ background: '#4f46e5' }} />
                      <div>
                        <p className="mc-course-name">{c.title}</p>
                        {c.description && (
                          <p className="mc-course-desc">{c.description}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Instructor name — comes from the joined User row */}
                  <td className="mc-instructor">
                    {c.instructor?.name ?? '—'}
                  </td>

                  {/* Schedule slots */}
                  <td>
                    {c.schedules?.length > 0 ? (
                      <div className="mc-schedules">
                        {c.schedules.map((s, i) => (
                          <span key={i} className="mc-schedule-tag">
                            {s.day} {s.startTime}–{s.endTime}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No schedule</span>
                    )}
                  </td>

                  <td className="mc-cap">{c.capacity}</td>

                  {/* Enrolled count from _count */}
                  <td className="mc-enrolled">
                    {c._count?.enrollments ?? 0} / {c.capacity}
                  </td>

                  <td>
                    <div className="mc-actions">
                      <button
                        className="mc-btn mc-btn--delete"
                        title="Delete"
                        onClick={() => handleDelete(c.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
