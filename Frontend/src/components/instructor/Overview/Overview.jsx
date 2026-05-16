import { useState, useEffect } from 'react'
import { getMe, updateMe } from '../../../api/userApi'
import { getMyCourses } from '../../../api/courseApi'
import { getInstructorStats, getInstructorSchedule } from '../../../api/instructorApi'
import { getCourseMaterials } from '../../../api/materialApi'
import './Overview.css'

const statusStyle = {
  Active: { bg: '#dcfce7', color: '#16a34a' },
  Full: { bg: '#fee2e2', color: '#dc2626' },
  Upcoming: { bg: '#fef9c3', color: '#ca8a04' },
}

const typeColors = {
  PDF: { bg: '#fee2e2', color: '#dc2626' },
  PPT: { bg: '#fef9c3', color: '#ca8a04' },
  DOC: { bg: '#dbeafe', color: '#2563eb' },
  ZIP: { bg: '#f3e8ff', color: '#7c3aed' },
  LINK: { bg: '#ecfdf5', color: '#059669' },
}

const COURSE_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899']
const getCourseColor = (idx) => COURSE_COLORS[idx % COURSE_COLORS.length]

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function Overview({ onNavigate }) {
  // ── User / profile ──────────────────────────────────────────────────────
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ name: '' })
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  // ── Dashboard data ──────────────────────────────────────────────────────
  const [stats, setStats] = useState(null)
  const [courses, setCourses] = useState([])
  const [schedule, setSchedule] = useState([])
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, statsRes, coursesRes, scheduleRes] = await Promise.all([
          getMe(),
          getInstructorStats(),
          getMyCourses(),
          getInstructorSchedule(),
        ])

        setUser(userRes.data)
        setDraft({ name: userRes.data.name })
        setStats(statsRes.data)
        setCourses(coursesRes.data)
        setSchedule(scheduleRes.data)

        // Load recent materials (up to 3) across all courses
        if (coursesRes.data.length > 0) {
          const results = await Promise.all(
            coursesRes.data.map((c) =>
              getCourseMaterials(c.id, localStorage.getItem('token')).then((r) => r.data)
            )
          )
          const all = results.flat().sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
          setMaterials(all.slice(0, 3))
        }
      } catch {
        // Non-fatal — partial data is fine
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Profile save ────────────────────────────────────────────────────────
  const saveProfile = async () => {
    setSaving(true)
    setSaveErr('')
    try {
      const res = await updateMe({ name: draft.name })
      setUser(res.data)
      localStorage.setItem('user', JSON.stringify(res.data))
      setEditing(false)
    } catch (err) {
      setSaveErr(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setDraft({ name: user?.name || '' })
    setSaveErr('')
    setEditing(false)
  }

  // ── Derived data ────────────────────────────────────────────────────────
  const summaryStats = stats
    ? [
      { label: 'Total Courses', value: stats.totalCourses, icon: '📋', color: '#4f46e5', bg: '#eef2ff' },
      { label: 'Total Students', value: stats.totalStudents, icon: '👥', color: '#06b6d4', bg: '#ecfeff' },
      { label: 'Uploaded Materials', value: stats.totalMaterials, icon: '📁', color: '#10b981', bg: '#ecfdf5' },
      { label: 'Schedule Conflicts', value: stats.scheduleConflicts, icon: '⚠️', color: '#ef4444', bg: '#fef2f2' },
    ]
    : []

  // Sort schedule by day order then time, take first 5
  const upcomingSessions = [...schedule]
    .sort((a, b) => {
      const di = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
      if (di !== 0) return di
      return a.startTime.localeCompare(b.startTime)
    })
    .slice(0, 5)

  const conflictCount = schedule.filter((s) => s.conflict).length

  const getCourseStatus = (course) => {
    const enrolled = course._count?.enrollments ?? 0
    if (enrolled >= course.capacity) return 'Full'
    return 'Active'
  }

  const getCourseMaterialTitle = (courseId) =>
    courses.find((c) => c.id === courseId)?.title || '—'

  if (loading) {
    return (
      <div className="overview">
        <p style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading overview…</p>
      </div>
    )
  }

  return (
    <div className="overview">

      {/* ── TOP ROW: Profile card + Stats ── */}
      <div className="overview__top">

        {/* Profile card */}
        <div className="ov-profile">
          <div className="ov-profile__banner" />
          <div className="ov-profile__body">
            <div className="ov-profile__avatar-row">
              <div className="ov-profile__avatar">
                {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) ?? '…'}
              </div>
              <button
                className={`ov-profile__edit-btn ${editing ? 'ov-profile__edit-btn--cancel' : ''}`}
                onClick={() => editing ? cancelEdit() : setEditing(true)}
              >
                {editing ? '✕ Cancel' : '✏️ Edit Profile'}
              </button>
            </div>

            {editing ? (
              <div className="ov-profile__form">
                <div className="ov-pf__field">
                  <label>Full Name</label>
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  />
                </div>
                {saveErr && (
                  <p style={{ color: '#dc2626', fontSize: '0.82rem' }}>{saveErr}</p>
                )}
                <div className="ov-pf__actions">
                  <button className="ov-pf__save" onClick={saveProfile} disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button className="ov-pf__cancel" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="ov-profile__info">
                <h2 className="ov-profile__name">{user?.name ?? '—'}</h2>
                <p className="ov-profile__title">Instructor</p>
                <div className="ov-profile__meta">
                  <span>✉️ {user?.email}</span>
                  <span>📅 Joined {user ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats column */}
        <div className="ov-stats">
          {summaryStats.map((s) => (
            <div key={s.label} className="ov-stat">
              <div className="ov-stat__icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="ov-stat__body">
                <span className="ov-stat__value" style={{ color: s.color }}>{s.value}</span>
                <span className="ov-stat__label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM ROW: Courses + Schedule + Materials ── */}
      <div className="overview__bottom">

        {/* My Courses mini */}
        <div className="ov-card">
          <div className="ov-card__header">
            <h3 className="ov-card__title">My Courses</h3>
            <button className="ov-card__link" onClick={() => onNavigate('courses')}>View all →</button>
          </div>
          <div className="ov-courses">
            {courses.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '0.5rem 0' }}>No courses yet.</p>
            ) : courses.slice(0, 4).map((c, idx) => {
              const enrolled = c._count?.enrollments ?? 0
              const pct = Math.round((enrolled / c.capacity) * 100)
              const status = getCourseStatus(c)
              const st = statusStyle[status] || statusStyle.Active
              const color = getCourseColor(idx)
              return (
                <div key={c.id} className="ov-course-row">
                  <span className="ov-course-bar" style={{ background: color }} />
                  <div className="ov-course-info">
                    <div className="ov-course-top">
                      <span className="ov-course-name">{c.title}</span>
                      <span className="ov-course-status" style={{ background: st.bg, color: st.color }}>{status}</span>
                    </div>
                    <div className="ov-course-bottom">
                      <span className="ov-course-students">👥 {enrolled}/{c.capacity}</span>
                    </div>
                    <div className="ov-course-progress-bar">
                      <div style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Schedule mini */}
        <div className="ov-card">
          <div className="ov-card__header">
            <h3 className="ov-card__title">
              Upcoming Schedule
              {conflictCount > 0 && (
                <span className="ov-conflict-badge">⚠️ {conflictCount} conflict{conflictCount > 1 ? 's' : ''}</span>
              )}
            </h3>
            <button className="ov-card__link" onClick={() => onNavigate('schedule')}>View all →</button>
          </div>
          <div className="ov-schedule">
            {upcomingSessions.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '0.5rem 0' }}>No schedule slots yet.</p>
            ) : upcomingSessions.map((s) => {
              const { color } = COURSE_COLORS
                ? { color: getCourseColor(s.courseId) }
                : { color: '#4f46e5' }
              return (
                <div key={s.id} className={`ov-session ${s.conflict ? 'ov-session--conflict' : ''}`}>
                  <div className="ov-session__left">
                    <span className="ov-session__bar" style={{ background: s.conflict ? '#ef4444' : color }} />
                    <div>
                      <p className="ov-session__course">{s.course?.title}</p>
                      <p className="ov-session__time">{s.day} · {s.startTime} – {s.endTime}</p>
                    </div>
                  </div>
                  <div className="ov-session__right">
                    {s.conflict && <span className="ov-session__conflict-tag">Conflict</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Materials mini */}
        <div className="ov-card">
          <div className="ov-card__header">
            <h3 className="ov-card__title">Recent Materials</h3>
            <button className="ov-card__link" onClick={() => onNavigate('materials')}>View all →</button>
          </div>
          <div className="ov-materials">
            {materials.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '0.5rem 0' }}>No materials uploaded yet.</p>
            ) : materials.map((m) => {
              const t = typeColors[m.type] || typeColors.PDF
              return (
                <div key={m.id} className="ov-material-row">
                  <span className="ov-material-type" style={{ background: t.bg, color: t.color }}>{m.type}</span>
                  <div className="ov-material-info">
                    <p className="ov-material-title">{m.title}</p>
                    <p className="ov-material-course">
                      {getCourseMaterialTitle(m.courseId)} · {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
