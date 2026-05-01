import React from 'react'
import './Stats.css'

const stats = [
  { value: '50K+', label: 'Active Students', icon: '🎓' },
  { value: '1,200+', label: 'Courses Available', icon: '📚' },
  { value: '300+', label: 'Expert Instructors', icon: '👨‍🏫' },
  { value: '98%', label: 'Satisfaction Rate', icon: '⭐' },
]

export default function Stats() {
  return (
    <section className="stats">
      <div className="stats__container">
        {stats.map((s) => (
          <div key={s.label} className="stats__item">
            <span className="stats__icon">{s.icon}</span>
            <span className="stats__value">{s.value}</span>
            <span className="stats__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
