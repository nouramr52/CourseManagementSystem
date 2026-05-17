import { useEffect, useState } from 'react'
import adminService from '../../../services/adminService'
import './AdminOverview.css'

const roleStyle = {
  STUDENT:    { bg: '#eef2ff', color: '#4f46e5' },
  INSTRUCTOR: { bg: '#ecfdf5', color: '#059669' },
  ADMIN:      { bg: '#fef2f2', color: '#dc2626' },
}

const courseColors = ['#4f46e5', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9', '#14b8a6']

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 60)  return `${mins} min${mins !== 1 ? 's' : ''} ago`
  if (hours < 24)  return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  return `${days} day${days !== 1 ? 's' : ''} ago`
}

function Spinner() {
  return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
}

export default function AdminOverview({ onNavigate }) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    adminService.getDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error)   return <div style={{ padding: '2rem', color: '#ef4444' }}>Error: {error}</div>

  const { stats, recentUsers, recentCourses } = data

  const statCards = [
    { label: 'Total Users',    value: stats.totalUsers,       icon: '👥', color: '#4f46e5', bg: '#eef2ff' },
    { label: 'Active Courses', value: stats.totalCourses,     icon: '📋', color: '#06b6d4', bg: '#ecfeff' },
    { label: 'Instructors',    value: stats.totalInstructors, icon: '👨‍🏫', color: '#10b981', bg: '#ecfdf5' },
    { label: 'Enrollments',    value: stats.totalEnrollments, icon: '🎓', color: '#f59e0b', bg: '#fffbeb' },
  ]

  return (
    <div className="admin-overview">

      {/* Stats */}
      <div className="admin-overview__stats">
        {statCards.map((s) => (
          <div className="admin-stat-card" key={s.label}>
            <div className="admin-stat-card__icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="admin-stat-card__body">
              <span className="admin-stat-card__label">{s.label}</span>
              <span className="admin-stat-card__value">{s.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users + Recent Courses */}
      <div className="admin-overview__row">

        {/* Recent Users */}
        <div className="admin-panel">
          <div className="admin-panel__header">
            <span className="admin-panel__title">Recent Users</span>
            <button className="admin-panel__link" onClick={() => onNavigate('users')}>View all →</button>
          </div>
          <div className="admin-panel__body">
            {recentUsers.map((u, i) => (
              <div className="admin-user-row" key={u.id}>
                <div
                  className="admin-user-row__avatar"
                  style={{ background: courseColors[i % courseColors.length] }}
                >
                  {initials(u.name)}
                </div>
                <div className="admin-user-row__info">
                  <div className="admin-user-row__name">{u.name}</div>
                  <div className="admin-user-row__email">{u.email}</div>
                </div>
                <span
                  className="admin-badge"
                  style={{ background: roleStyle[u.role]?.bg, color: roleStyle[u.role]?.color }}
                >
                  {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="admin-panel">
          <div className="admin-panel__header">
            <span className="admin-panel__title">Recent Courses</span>
            <button className="admin-panel__link" onClick={() => onNavigate('courses')}>View all →</button>
          </div>
          <div className="admin-panel__body">
            {recentCourses.map((c, i) => {
              const enrolled = c._count?.enrollments ?? 0
              const isFull   = enrolled >= c.capacity
              const status   = isFull ? 'Full' : 'Active'
              const statusStyle = isFull
                ? { bg: '#fee2e2', color: '#dc2626' }
                : { bg: '#dcfce7', color: '#16a34a' }
              return (
                <div className="admin-course-row" key={c.id}>
                  <div
                    className="admin-course-row__dot"
                    style={{ background: courseColors[i % courseColors.length] }}
                  />
                  <div className="admin-course-row__info">
                    <div className="admin-course-row__name">{c.title}</div>
                    <div className="admin-course-row__meta">
                      {c.instructor?.name} · {enrolled} students
                    </div>
                  </div>
                  <span className="admin-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                    {status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Recent Activity — derived from recentUsers */}
      <div className="admin-activity">
        <div className="admin-activity__header">
          <span className="admin-activity__title">Recent Registrations</span>
        </div>
        <div className="admin-activity__list">
          {recentUsers.map((u) => (
            <div className="admin-activity__item" key={u.id}>
              <div className="admin-activity__icon" style={{ background: roleStyle[u.role]?.bg }}>
                {u.role === 'STUDENT' ? '🎓' : u.role === 'INSTRUCTOR' ? '👨‍🏫' : '🛡️'}
              </div>
              <div className="admin-activity__body">
                <div className="admin-activity__text">
                  <strong>{u.name}</strong> registered as{' '}
                  {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                </div>
                <div className="admin-activity__time">{timeAgo(u.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
