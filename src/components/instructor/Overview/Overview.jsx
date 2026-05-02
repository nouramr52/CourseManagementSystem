import { useState } from 'react'
import './Overview.css'

const initialProfile = {
  name: 'Dr. Sarah Lee',
  title: 'Associate Professor',
  department: 'Computer Science',
  email: 'sarah.lee@university.edu',
  phone: '+1 (555) 012-3456',
  bio: 'Passionate educator with 10+ years of experience in software engineering and database systems. Focused on making complex topics accessible through practical, project-based learning.',
  expertise: ['Database Systems', 'Software Engineering', 'Data Structures'],
  joined: 'September 2015',
}

const summaryStats = [
  { label: 'Total Courses',      value: '4',  icon: '📋', color: '#4f46e5', bg: '#eef2ff' },
  { label: 'Total Students',     value: '87', icon: '👥', color: '#06b6d4', bg: '#ecfeff' },
  { label: 'Uploaded Materials', value: '34', icon: '📁', color: '#10b981', bg: '#ecfdf5' },
  { label: 'Schedule Conflicts', value: '1',  icon: '⚠️', color: '#ef4444', bg: '#fef2f2' },
]

const recentCourses = [
  { title: 'Database Systems',     code: 'CS301', students: 28, capacity: 30, status: 'Active',   color: '#4f46e5' },
  { title: 'Software Engineering', code: 'CS402', students: 25, capacity: 25, status: 'Full',     color: '#06b6d4' },
  { title: 'Data Structures',      code: 'CS201', students: 34, capacity: 40, status: 'Active',   color: '#10b981' },
  { title: 'Operating Systems',    code: 'CS303', students: 0,  capacity: 30, status: 'Upcoming', color: '#8b5cf6' },
]

const recentMaterials = [
  { title: 'Introduction to SQL',           course: 'Database Systems',     type: 'PDF',  date: '2024-09-05' },
  { title: 'UML Diagrams Lab Sheet',         course: 'Software Engineering', type: 'DOC',  date: '2024-09-12' },
  { title: 'Arrays and Linked Lists',        course: 'Data Structures',      type: 'Link', date: '2024-09-07' },
]

const upcomingSessions = [
  { course: 'Data Structures',      code: 'CS201', day: 'Monday',    time: '09:00 – 10:00', color: '#10b981', conflict: false },
  { course: 'Database Systems',     code: 'CS301', day: 'Monday',    time: '10:00 – 11:30', color: '#4f46e5', conflict: false },
  { course: 'Software Engineering', code: 'CS402', day: 'Tuesday',   time: '13:00 – 14:30', color: '#06b6d4', conflict: false },
  { course: 'Operating Systems',    code: 'CS303', day: 'Thursday',  time: '13:00 – 15:00', color: '#8b5cf6', conflict: true  },
  { course: 'Software Engineering', code: 'CS402', day: 'Thursday',  time: '13:00 – 14:30', color: '#06b6d4', conflict: true  },
]

const statusStyle = {
  Active:   { bg: '#dcfce7', color: '#16a34a' },
  Full:     { bg: '#fee2e2', color: '#dc2626' },
  Upcoming: { bg: '#fef9c3', color: '#ca8a04' },
}

const typeColors = {
  PDF:  { bg: '#fee2e2', color: '#dc2626' },
  PPT:  { bg: '#fef9c3', color: '#ca8a04' },
  DOC:  { bg: '#dbeafe', color: '#2563eb' },
  Link: { bg: '#ecfdf5', color: '#059669' },
}

export default function Overview({ onNavigate }) {
  const [profile, setProfile]   = useState(initialProfile)
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(initialProfile)
  const [newTag, setNewTag]     = useState('')

  const saveProfile = () => { setProfile(draft); setEditing(false) }
  const cancelEdit  = () => { setDraft(profile); setEditing(false) }

  const addTag = () => {
    const t = newTag.trim()
    if (t && !draft.expertise.includes(t)) setDraft({ ...draft, expertise: [...draft.expertise, t] })
    setNewTag('')
  }
  const removeTag = (tag) => setDraft({ ...draft, expertise: draft.expertise.filter((e) => e !== tag) })

  const conflictCount = upcomingSessions.filter((s) => s.conflict).length

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
                {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
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
                <div className="ov-pf__row">
                  <div className="ov-pf__field">
                    <label>Full Name</label>
                    <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                  </div>
                  <div className="ov-pf__field">
                    <label>Title</label>
                    <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                  </div>
                </div>
                <div className="ov-pf__row">
                  <div className="ov-pf__field">
                    <label>Department</label>
                    <input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
                  </div>
                  <div className="ov-pf__field">
                    <label>Email</label>
                    <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                  </div>
                </div>
                <div className="ov-pf__field">
                  <label>Phone</label>
                  <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
                </div>
                <div className="ov-pf__field">
                  <label>Bio</label>
                  <textarea rows={3} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
                </div>
                <div className="ov-pf__field">
                  <label>Areas of Expertise</label>
                  <div className="ov-pf__tags">
                    {draft.expertise.map((tag) => (
                      <span key={tag} className="ov-pf__tag">
                        {tag}
                        <button onClick={() => removeTag(tag)}>✕</button>
                      </span>
                    ))}
                    <div className="ov-pf__tag-input">
                      <input
                        value={newTag}
                        placeholder="Add expertise…"
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <button onClick={addTag}>+</button>
                    </div>
                  </div>
                </div>
                <div className="ov-pf__actions">
                  <button className="ov-pf__save" onClick={saveProfile}>Save Changes</button>
                  <button className="ov-pf__cancel" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="ov-profile__info">
                <h2 className="ov-profile__name">{profile.name}</h2>
                <p className="ov-profile__title">{profile.title} · {profile.department}</p>
                <p className="ov-profile__bio">{profile.bio}</p>
                <div className="ov-profile__meta">
                  <span>✉️ {profile.email}</span>
                  <span>📞 {profile.phone}</span>
                  <span>📅 Joined {profile.joined}</span>
                </div>
                <div className="ov-profile__tags">
                  {profile.expertise.map((tag) => (
                    <span key={tag} className="ov-profile__tag">{tag}</span>
                  ))}
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
            {recentCourses.map((c) => {
              const st  = statusStyle[c.status]
              const pct = Math.round((c.students / c.capacity) * 100)
              return (
                <div key={c.code} className="ov-course-row">
                  <span className="ov-course-bar" style={{ background: c.color }} />
                  <div className="ov-course-info">
                    <div className="ov-course-top">
                      <span className="ov-course-name">{c.title}</span>
                      <span className="ov-course-status" style={{ background: st.bg, color: st.color }}>{c.status}</span>
                    </div>
                    <div className="ov-course-bottom">
                      <span className="ov-course-code" style={{ color: c.color }}>{c.code}</span>
                      <span className="ov-course-students">👥 {c.students}/{c.capacity}</span>
                    </div>
                    <div className="ov-course-progress-bar">
                      <div style={{ width: `${pct}%`, background: c.color }} />
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
            {upcomingSessions.map((s, i) => (
              <div key={i} className={`ov-session ${s.conflict ? 'ov-session--conflict' : ''}`}>
                <div className="ov-session__left">
                  <span className="ov-session__bar" style={{ background: s.conflict ? '#ef4444' : s.color }} />
                  <div>
                    <p className="ov-session__course">{s.course}</p>
                    <p className="ov-session__time">{s.day} · {s.time}</p>
                  </div>
                </div>
                <div className="ov-session__right">
                  <span className="ov-session__code" style={{ color: s.conflict ? '#ef4444' : s.color, background: s.conflict ? '#fef2f2' : '#f1f5f9' }}>
                    {s.code}
                  </span>
                  {s.conflict && <span className="ov-session__conflict-tag">Conflict</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Materials mini */}
        <div className="ov-card">
          <div className="ov-card__header">
            <h3 className="ov-card__title">Recent Materials</h3>
            <button className="ov-card__link" onClick={() => onNavigate('materials')}>View all →</button>
          </div>
          <div className="ov-materials">
            {recentMaterials.map((m) => {
              const t = typeColors[m.type] || typeColors.PDF
              return (
                <div key={m.id} className="ov-material-row">
                  <span className="ov-material-type" style={{ background: t.bg, color: t.color }}>{m.type}</span>
                  <div className="ov-material-info">
                    <p className="ov-material-title">{m.title}</p>
                    <p className="ov-material-course">{m.course} · {m.date}</p>
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
