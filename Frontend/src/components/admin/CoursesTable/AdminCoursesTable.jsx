import { useEffect, useState } from 'react'
import adminService from '../../../services/adminService'
import './AdminCoursesTable.css'

const statuses = ['All', 'Active', 'Full', 'Upcoming']

const courseColors = ['#4f46e5', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9', '#14b8a6']

const statusStyle = {
  Active:   { bg: '#dcfce7', color: '#16a34a' },
  Full:     { bg: '#fee2e2', color: '#dc2626' },
  Upcoming: { bg: '#fef9c3', color: '#ca8a04' },
}

function getCourseStatus(course) {
  const enrolled = course._count?.enrollments ?? 0
  if (enrolled === 0) return 'Upcoming'
  if (enrolled >= course.capacity) return 'Full'
  return 'Active'
}

function formatSchedule(schedules) {
  if (!schedules || schedules.length === 0) return 'No schedule'
  return schedules.map((s) => `${s.day} ${s.startTime}–${s.endTime}`).join(', ')
}

function Spinner() {
  return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
}

export default function AdminCoursesTable() {
  const [courses, setCourses]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch]             = useState('')

  // Edit modal
  const [editCourse, setEditCourse] = useState(null)
  const [form, setForm]             = useState({})
  const [saving, setSaving]         = useState(false)
  const [formErr, setFormErr]       = useState('')

  const loadCourses = () => {
    setLoading(true)
    adminService.getAllCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCourses() }, [])

  const filtered = courses.filter((c) => {
    const status = getCourseStatus(c)
    const matchStatus = statusFilter === 'All' || status === statusFilter
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.instructor?.name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const openEdit = (c) => {
    setEditCourse(c)
    setForm({ title: c.title, description: c.description || '', capacity: c.capacity, dept: c.dept || '', icon: c.icon || '' })
    setFormErr('')
  }

  const handleSave = async () => {
    setFormErr('')
    if (!form.title?.trim()) { setFormErr('Title is required.'); return }
    if (!form.capacity || isNaN(form.capacity)) { setFormErr('Capacity must be a number.'); return }
    setSaving(true)
    try {
      await adminService.updateCourse(editCourse.id, {
        title:       form.title.trim(),
        description: form.description.trim(),
        capacity:    Number(form.capacity),
        dept:        form.dept.trim(),
        icon:        form.icon.trim(),
      })
      setEditCourse(null)
      loadCourses()
    } catch (err) {
      setFormErr(err.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await adminService.deleteCourse(id)
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) return <Spinner />
  if (error)   return <div style={{ padding: '2rem', color: '#ef4444' }}>Error: {error}</div>

  return (
    <div className="admin-courses">

      {/* Edit Modal */}
      {editCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)' }}>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 800, color: 'var(--text)', fontSize: '1.1rem' }}>Edit Course</h3>

            {formErr && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>{formErr}</div>
            )}

            {[
              { label: 'Title',       key: 'title',       type: 'text' },
              { label: 'Description', key: 'description', type: 'text' },
              { label: 'Capacity',    key: 'capacity',    type: 'number' },
              { label: 'Department',  key: 'dept',        type: 'text' },
              { label: 'Icon (emoji)', key: 'icon',       type: 'text' },
            ].map(({ label, key, type }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button onClick={() => setEditCourse(null)} style={{ padding: '0.55rem 1.2rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '0.55rem 1.2rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="admin-courses__header">
        <div>
          <h2 className="admin-courses__title">Courses</h2>
          <p className="admin-courses__sub">Manage all courses on the platform</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-courses__filters">
        <input
          className="admin-courses__search"
          placeholder="🔍  Search by title or instructor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="admin-courses__tabs">
          {statuses.map((s) => (
            <button key={s} className={`admin-courses__tab ${statusFilter === s ? 'admin-courses__tab--active' : ''}`} onClick={() => setStatusFilter(s)}>{s}</button>
          ))}
        </div>
        <span className="admin-courses__count">{filtered.length} courses</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="admin-courses__empty">No courses found.</div>
      ) : (
        <div className="admin-courses__grid">
          {filtered.map((c, i) => {
            const enrolled = c._count?.enrollments ?? 0
            const fill     = c.capacity > 0 ? Math.round((enrolled / c.capacity) * 100) : 0
            const status   = getCourseStatus(c)
            const color    = courseColors[i % courseColors.length]
            return (
              <div className="admin-course-card" key={c.id}>
                <div className="admin-course-card__top" style={{ background: color }} />
                <div className="admin-course-card__body">
                  <div className="admin-course-card__header">
                    <div>
                      <div className="admin-course-card__name">{c.icon} {c.title}</div>
                      <div className="admin-course-card__code">{c.dept ?? ''}</div>
                    </div>
                    <span className="admin-badge" style={{ background: statusStyle[status]?.bg, color: statusStyle[status]?.color }}>{status}</span>
                  </div>

                  <div className="admin-course-card__meta">
                    <div className="admin-course-card__meta-row">👨‍🏫 {c.instructor?.name ?? 'Unknown'}</div>
                    <div className="admin-course-card__meta-row">📅 {formatSchedule(c.schedules)}</div>
                    <div className="admin-course-card__meta-row">👥 {enrolled} / {c.capacity} students</div>
                  </div>

                  <div className="admin-course-card__progress-label">
                    <span>Enrollment</span>
                    <span>{fill}%</span>
                  </div>
                  <div className="admin-course-card__progress-bar">
                    <div className="admin-course-card__progress-fill" style={{ width: `${fill}%`, background: color }} />
                  </div>

                  <div className="admin-course-card__footer">
                    <button className="admin-course-card__btn" onClick={() => openEdit(c)}>Edit</button>
                    <button className="admin-course-card__btn admin-course-card__btn--danger" onClick={() => handleDelete(c.id)}>Delete</button>
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
