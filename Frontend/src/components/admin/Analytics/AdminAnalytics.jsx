import { useEffect, useState } from 'react'
import adminService from '../../../services/adminService'
import './AdminAnalytics.css'

const courseColors = ['#4f46e5', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9', '#14b8a6']

function Spinner() {
  return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
}

export default function AdminAnalytics() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    adminService.getAnalytics()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error)   return <div style={{ padding: '2rem', color: '#ef4444' }}>Error: {error}</div>

  const { stats, topCourses, monthlyEnrollments } = data

  // Build user distribution from real stats
  const totalUsers = stats.totalUsers || 1
  const userDistribution = [
    { label: 'Students',    count: stats.totalStudents,    color: '#4f46e5' },
    { label: 'Instructors', count: stats.totalInstructors, color: '#10b981' },
    { label: 'Admins',      count: stats.totalAdmins,      color: '#ef4444' },
  ].map((u) => ({ ...u, pct: Math.round((u.count / totalUsers) * 100) }))

  // Max value for monthly bar chart scaling
  const maxMonthly = Math.max(...(monthlyEnrollments.map((m) => m.count)), 1)

  const summaryCards = [
    { label: 'Total Enrollments',  value: stats.totalEnrollments,  sub: 'Across all courses' },
    { label: 'Active Enrollments', value: stats.activeEnrollments, sub: 'Currently active' },
    { label: 'Total Courses',      value: stats.totalCourses,      sub: 'On the platform' },
    { label: 'Total Users',        value: stats.totalUsers,        sub: 'Students + instructors' },
  ]

  return (
    <div className="admin-analytics">
      <div>
        <h2 className="admin-analytics__title">Analytics</h2>
        <p className="admin-analytics__sub">Platform-wide performance and engagement metrics</p>
      </div>

      {/* Summary */}
      <div className="admin-analytics__summary">
        {summaryCards.map((c) => (
          <div className="admin-analytics__card" key={c.label}>
            <span className="admin-analytics__card-label">{c.label}</span>
            <span className="admin-analytics__card-value">{c.value.toLocaleString()}</span>
            <span className="admin-analytics__card-sub">{c.sub}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="admin-analytics__charts">

        {/* Monthly Enrollments */}
        <div className="admin-chart-panel">
          <div className="admin-chart-panel__title">Monthly Enrollments (Last 12 Months)</div>
          {monthlyEnrollments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No enrollment data yet.</p>
          ) : (
            <div className="admin-bar-chart">
              {monthlyEnrollments.map((m) => (
                <div className="admin-bar-chart__row" key={m.month}>
                  <span className="admin-bar-chart__label">{m.month}</span>
                  <div className="admin-bar-chart__track">
                    <div
                      className="admin-bar-chart__fill"
                      style={{
                        width: `${(m.count / maxMonthly) * 100}%`,
                        background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
                      }}
                    />
                  </div>
                  <span className="admin-bar-chart__value">{m.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Distribution */}
        <div className="admin-chart-panel">
          <div className="admin-chart-panel__title">User Distribution</div>
          <div className="admin-donut">
            {userDistribution.map((u) => (
              <div className="admin-donut__row" key={u.label}>
                <div className="admin-donut__dot" style={{ background: u.color }} />
                <span className="admin-donut__label">{u.label} ({u.count})</span>
                <div className="admin-donut__bar-track">
                  <div
                    className="admin-donut__bar-fill"
                    style={{ width: `${u.pct}%`, background: u.color }}
                  />
                </div>
                <span className="admin-donut__pct">{u.pct}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Courses */}
      <div className="admin-top-courses">
        <div className="admin-top-courses__header">
          <span className="admin-top-courses__title">Top Enrolled Courses</span>
        </div>
        {topCourses.length === 0 ? (
          <p style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>No courses yet.</p>
        ) : (
          <table className="admin-top-courses__table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Students</th>
                <th>Capacity</th>
                <th>Fill Rate</th>
              </tr>
            </thead>
            <tbody>
              {topCourses.map((c, i) => {
                const enrolled = c._count?.enrollments ?? 0
                const fill     = c.capacity > 0 ? Math.round((enrolled / c.capacity) * 100) : 0
                const color    = courseColors[i % courseColors.length]
                return (
                  <tr key={c.id}>
                    <td>
                      <span className="admin-top-courses__dot" style={{ background: color }} />
                      {c.title}
                    </td>
                    <td>{c.instructor?.name ?? '—'}</td>
                    <td>{enrolled}</td>
                    <td>{c.capacity}</td>
                    <td>
                      <div className="admin-top-courses__progress-wrap">
                        <div className="admin-top-courses__progress-track">
                          <div
                            className="admin-top-courses__progress-fill"
                            style={{ width: `${fill}%`, background: color }}
                          />
                        </div>
                        <span className="admin-top-courses__pct">{fill}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
