import { useState, useEffect } from 'react'
import { createCourse, getMyCourses, deleteCourse } from '../../../api/courseApi'
import './MyCourses.css'

const statusStyle = {
  Active:   { bg: '#dcfce7', color: '#16a34a' },
  Full:     { bg: '#fee2e2', color: '#dc2626' },
  Upcoming: { bg: '#fef9c3', color: '#ca8a04' },
}

const emptyForm = { title: '', description: '' }

export default function MyCourses({ compact = false }) {
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await createCourse({ title: form.title, description: form.description })
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
          {!compact && <p className="my-courses__sub">Manage your courses and capacity</p>}
        </div>
        <button className="mc-add-btn" onClick={() => { setShowForm(!showForm); setError('') }}>
          + Add New Course
        </button>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}

      {/* Form */}
      {showForm && (
        <div className="cf">
          <div className="cf__head">
            <h3>Add New Course</h3>
            <button className="cf__close" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className="cf__body">
            <div className="cf__row">
              <div className="cf__field">
                <label>Course Title</label>
                <input required value={form.title} placeholder="e.g. Database Systems"
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
            </div>
            <div className="cf__field cf__field--full">
              <label>Description</label>
              <textarea rows={2} value={form.description} placeholder="Brief course description…"
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="cf__actions">
              <button type="submit" className="cf__submit" disabled={submitting}>
                {submitting ? 'Adding…' : 'Add Course'}
              </button>
              <button type="button" className="cf__cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="mc-table-wrap">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading courses…</p>
        ) : (
          <table className="mc-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr><td colSpan="4" className="mc-empty">No courses yet. Add your first one!</td></tr>
              ) : courses.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="mc-course-cell">
                      <span className="mc-course-dot" style={{ background: '#4f46e5' }} />
                      <p className="mc-course-name">{c.title}</p>
                    </div>
                  </td>
                  <td><p className="mc-course-desc">{c.description || '—'}</p></td>
                  <td className="mc-date">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="mc-actions">
                      <button className="mc-btn mc-btn--delete" title="Delete" onClick={() => handleDelete(c.id)}>🗑</button>
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
