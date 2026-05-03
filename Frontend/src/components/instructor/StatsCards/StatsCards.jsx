import './StatsCards.css'

const stats = [
  {
    label: 'Total Courses',
    value: '4',
    icon: '📋',
    color: '#4f46e5',
    bg: '#eef2ff',
    sub: '2 active this semester',
    trend: '+1 this semester',
  },
  {
    label: 'Enrolled Students',
    value: '87',
    icon: '👥',
    color: '#06b6d4',
    bg: '#ecfeff',
    sub: 'Across all courses',
    trend: '+12 this week',
  },
  {
    label: 'Upcoming Classes',
    value: '3',
    icon: '📅',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    sub: 'This week',
    trend: 'Next: Mon 10:00 AM',
  },
  {
    label: 'Uploaded Materials',
    value: '34',
    icon: '📁',
    color: '#10b981',
    bg: '#ecfdf5',
    sub: 'Files & documents',
    trend: '+5 this week',
  },
]

export default function StatsCards() {
  return (
    <div className="stats-cards">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-card__top">
            <div className="stat-card__icon" style={{ background: s.bg }}>
              <span>{s.icon}</span>
            </div>
            <span className="stat-card__trend">{s.trend}</span>
          </div>
          <div className="stat-card__body">
            <span className="stat-card__value" style={{ color: s.color }}>{s.value}</span>
            <span className="stat-card__label">{s.label}</span>
            <span className="stat-card__sub">{s.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
