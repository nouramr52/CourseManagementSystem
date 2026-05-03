import './AdminAnalytics.css'

const summaryCards = [
  { label: 'Total Enrollments', value: '1,284', sub: 'Across all courses' },
  { label: 'Completion Rate',   value: '68%',   sub: 'Avg. across courses' },
  { label: 'Avg. Course Rating', value: '4.6',  sub: 'Out of 5.0' },
  { label: 'Active This Month', value: '342',   sub: 'Unique active users' },
]

const monthlyEnrollments = [
  { month: 'Jan', value: 80,  max: 200 },
  { month: 'Feb', value: 95,  max: 200 },
  { month: 'Mar', value: 110, max: 200 },
  { month: 'Apr', value: 130, max: 200 },
  { month: 'May', value: 160, max: 200 },
  { month: 'Jun', value: 145, max: 200 },
  { month: 'Jul', value: 120, max: 200 },
  { month: 'Aug', value: 175, max: 200 },
  { month: 'Sep', value: 200, max: 200 },
  { month: 'Oct', value: 185, max: 200 },
  { month: 'Nov', value: 165, max: 200 },
  { month: 'Dec', value: 140, max: 200 },
]

const userDistribution = [
  { label: 'Students',    pct: 82, color: '#4f46e5' },
  { label: 'Instructors', pct: 15, color: '#10b981' },
  { label: 'Admins',      pct: 3,  color: '#ef4444' },
]

const topCourses = [
  { name: 'Data Structures',      code: 'CS201', color: '#10b981', students: 34, rating: 4.8, completion: 72 },
  { name: 'Database Systems',     code: 'CS301', color: '#4f46e5', students: 28, rating: 4.7, completion: 68 },
  { name: 'Software Engineering', code: 'CS402', color: '#06b6d4', students: 25, rating: 4.6, completion: 65 },
  { name: 'Machine Learning',     code: 'CS501', color: '#f59e0b', students: 18, rating: 4.9, completion: 55 },
  { name: 'Algorithms',           code: 'CS302', color: '#0ea5e9', students: 30, rating: 4.5, completion: 70 },
]

export default function AdminAnalytics() {
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
            <span className="admin-analytics__card-value">{c.value}</span>
            <span className="admin-analytics__card-sub">{c.sub}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="admin-analytics__charts">

        {/* Monthly Enrollments */}
        <div className="admin-chart-panel">
          <div className="admin-chart-panel__title">Monthly Enrollments</div>
          <div className="admin-bar-chart">
            {monthlyEnrollments.map((m) => (
              <div className="admin-bar-chart__row" key={m.month}>
                <span className="admin-bar-chart__label">{m.month}</span>
                <div className="admin-bar-chart__track">
                  <div
                    className="admin-bar-chart__fill"
                    style={{
                      width: `${(m.value / m.max) * 100}%`,
                      background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
                    }}
                  />
                </div>
                <span className="admin-bar-chart__value">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Distribution */}
        <div className="admin-chart-panel">
          <div className="admin-chart-panel__title">User Distribution</div>
          <div className="admin-donut">
            {userDistribution.map((u) => (
              <div className="admin-donut__row" key={u.label}>
                <div className="admin-donut__dot" style={{ background: u.color }} />
                <span className="admin-donut__label">{u.label}</span>
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
          <span className="admin-top-courses__title">Top Performing Courses</span>
        </div>
        <table className="admin-top-courses__table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Students</th>
              <th>Rating</th>
              <th>Completion</th>
            </tr>
          </thead>
          <tbody>
            {topCourses.map((c) => (
              <tr key={c.code}>
                <td>
                  <span className="admin-top-courses__dot" style={{ background: c.color }} />
                  {c.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({c.code})</span>
                </td>
                <td>{c.students}</td>
                <td>⭐ {c.rating}</td>
                <td>
                  <div className="admin-top-courses__progress-wrap">
                    <div className="admin-top-courses__progress-track">
                      <div
                        className="admin-top-courses__progress-fill"
                        style={{ width: `${c.completion}%`, background: c.color }}
                      />
                    </div>
                    <span className="admin-top-courses__pct">{c.completion}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
