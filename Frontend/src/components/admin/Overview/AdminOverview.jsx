import './AdminOverview.css'

const stats = [
  { label: 'Total Users',      value: '1,284', icon: '👥', color: '#4f46e5', bg: '#eef2ff', change: '+12% this month',  dir: 'up' },
  { label: 'Active Courses',   value: '48',    icon: '📋', color: '#06b6d4', bg: '#ecfeff', change: '+3 this week',     dir: 'up' },
  { label: 'Instructors',      value: '36',    icon: '👨‍🏫', color: '#10b981', bg: '#ecfdf5', change: '+2 this month',   dir: 'up' },
  { label: 'Revenue (Month)',  value: '$24.5k', icon: '💰', color: '#f59e0b', bg: '#fffbeb', change: '+8% vs last month', dir: 'up' },
]

const recentUsers = [
  { name: 'Alex Johnson',   email: 'alex.j@university.edu',   role: 'Student',    color: '#4f46e5', joined: '2 hrs ago' },
  { name: 'Dr. Sarah Lee',  email: 'sarah.l@university.edu',  role: 'Instructor', color: '#10b981', joined: '5 hrs ago' },
  { name: 'Maria Garcia',   email: 'maria.g@university.edu',  role: 'Student',    color: '#06b6d4', joined: '1 day ago' },
  { name: 'Omar Hassan',    email: 'omar.h@university.edu',   role: 'Student',    color: '#8b5cf6', joined: '1 day ago' },
  { name: 'Prof. M. Chen',  email: 'michael.c@university.edu', role: 'Instructor', color: '#f59e0b', joined: '2 days ago' },
]

const recentCourses = [
  { name: 'Database Systems',     instructor: 'Dr. Sarah Lee',    students: 28, color: '#4f46e5', status: 'Active' },
  { name: 'Software Engineering', instructor: 'Prof. M. Chen',    students: 25, color: '#06b6d4', status: 'Full' },
  { name: 'Data Structures',      instructor: 'Dr. Emily R.',     students: 34, color: '#10b981', status: 'Active' },
  { name: 'Operating Systems',    instructor: 'Dr. Emily R.',     students: 0,  color: '#8b5cf6', status: 'Upcoming' },
  { name: 'Machine Learning',     instructor: 'Prof. James W.',   students: 18, color: '#f59e0b', status: 'Active' },
]

const activity = [
  { icon: '👤', bg: '#eef2ff', text: <><strong>Alex Johnson</strong> registered as a new student</>,          time: '2 hours ago' },
  { icon: '📋', bg: '#ecfeff', text: <><strong>Machine Learning</strong> course was created by Prof. James W.</>, time: '4 hours ago' },
  { icon: '✅', bg: '#ecfdf5', text: <><strong>Maria Garcia</strong> enrolled in Database Systems</>,           time: '6 hours ago' },
  { icon: '🚫', bg: '#fef2f2', text: <><strong>Operating Systems</strong> was flagged for a schedule conflict</>, time: '1 day ago' },
  { icon: '💬', bg: '#fffbeb', text: <><strong>Dr. Sarah Lee</strong> uploaded 3 new course materials</>,       time: '1 day ago' },
  { icon: '🎓', bg: '#f5f3ff', text: <><strong>Chen Wei</strong> completed Data Structures course</>,           time: '2 days ago' },
]

const roleStyle = {
  Student:    { bg: '#eef2ff', color: '#4f46e5' },
  Instructor: { bg: '#ecfdf5', color: '#059669' },
  Admin:      { bg: '#fef2f2', color: '#dc2626' },
}

const statusStyle = {
  Active:   { bg: '#dcfce7', color: '#16a34a' },
  Full:     { bg: '#fee2e2', color: '#dc2626' },
  Upcoming: { bg: '#fef9c3', color: '#ca8a04' },
}

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function AdminOverview({ onNavigate }) {
  return (
    <div className="admin-overview">

      {/* Stats */}
      <div className="admin-overview__stats">
        {stats.map((s) => (
          <div className="admin-stat-card" key={s.label}>
            <div className="admin-stat-card__icon" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="admin-stat-card__body">
              <span className="admin-stat-card__label">{s.label}</span>
              <span className="admin-stat-card__value">{s.value}</span>
              <span className={`admin-stat-card__change admin-stat-card__change--${s.dir}`}>
                {s.dir === 'up' ? '↑' : '↓'} {s.change}
              </span>
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
            {recentUsers.map((u) => (
              <div className="admin-user-row" key={u.email}>
                <div className="admin-user-row__avatar" style={{ background: u.color }}>
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
                  {u.role}
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
            {recentCourses.map((c) => (
              <div className="admin-course-row" key={c.name}>
                <div className="admin-course-row__dot" style={{ background: c.color }} />
                <div className="admin-course-row__info">
                  <div className="admin-course-row__name">{c.name}</div>
                  <div className="admin-course-row__meta">{c.instructor} · {c.students} students</div>
                </div>
                <span
                  className="admin-badge"
                  style={{ background: statusStyle[c.status]?.bg, color: statusStyle[c.status]?.color }}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Activity Feed */}
      <div className="admin-activity">
        <div className="admin-activity__header">
          <span className="admin-activity__title">Recent Activity</span>
        </div>
        <div className="admin-activity__list">
          {activity.map((a, i) => (
            <div className="admin-activity__item" key={i}>
              <div className="admin-activity__icon" style={{ background: a.bg }}>{a.icon}</div>
              <div className="admin-activity__body">
                <div className="admin-activity__text">{a.text}</div>
                <div className="admin-activity__time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
