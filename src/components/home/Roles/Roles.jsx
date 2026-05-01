import React, { useState } from 'react'
import './Roles.css'

const roles = [
  {
    id: 'student',
    label: 'Student',
    emoji: '🎓',
    color: '#4f46e5',
    headline: 'Learn and manage your academic journey',
    description:
      'Students can browse the course catalog, enroll in courses, manage their schedule, and access all uploaded materials — all from one dashboard.',
    perks: [
      'Browse available courses',
      'View course details and schedules',
      'Enroll in or drop courses',
      'View personal schedule',
      'Access course materials',
    ],
    cta: 'Login as Student',
  },
  {
    id: 'instructor',
    label: 'Instructor',
    emoji: '👨‍🏫',
    color: '#06b6d4',
    headline: 'Create and manage your courses',
    description:
      'Instructors can add and manage their courses, upload learning materials, and view the list of students enrolled in their sections.',
    perks: [
      'Add and manage courses',
      'Upload course materials',
      'View enrolled students',
      'View assigned courses',
    ],
    cta: 'Login as Instructor',
  },
  {
    id: 'admin',
    label: 'Admin',
    emoji: '🛡️',
    color: '#8b5cf6',
    headline: 'Full control over the entire system',
    description:
      'Administrators have complete oversight — managing all users, courses, enrollments, and schedules from a centralized admin panel.',
    perks: [
      'Manage all users (students & instructors)',
      'Manage all courses',
      'Manage enrollments',
      'Manage schedules',
      'Assign instructors to courses',
    ],
    cta: 'Login as Admin',
  },
]

export default function Roles() {
  const [active, setActive] = useState('student')
  const role = roles.find((r) => r.id === active)

  return (
    <section className="roles" id="roles">
      <div className="roles__container">
        <div className="section-header">
          <span className="section-tag">User Roles</span>
          <h2 className="section-title">Three roles, one platform</h2>
          <p className="section-subtitle">
            Each role has a tailored experience with access to exactly the
            features they need — nothing more, nothing less.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="roles__tabs">
          {roles.map((r) => (
            <button
              key={r.id}
              className={`roles__tab ${active === r.id ? 'roles__tab--active' : ''}`}
              style={active === r.id ? { borderColor: r.color, color: r.color, background: `${r.color}10` } : {}}
              onClick={() => setActive(r.id)}
            >
              <span>{r.emoji}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="roles__content" key={role.id}>
          <div className="roles__text">
            <h3 className="roles__headline" style={{ color: role.color }}>
              {role.headline}
            </h3>
            <p className="roles__desc">{role.description}</p>
            <ul className="roles__perks">
              {role.perks.map((p) => (
                <li key={p} className="roles__perk">
                  <span className="roles__perk-check" style={{ background: role.color }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <button
              className="roles__cta"
              style={{ background: role.color, boxShadow: `0 4px 14px ${role.color}55` }}
            >
              {role.cta} →
            </button>
          </div>

          <div className="roles__illustration">
            <div className="roles__ill-card" style={{ borderTop: `4px solid ${role.color}` }}>
              <div className="roles__ill-header">
                <div className="roles__ill-avatar" style={{ background: `${role.color}20`, color: role.color }}>
                  {role.emoji}
                </div>
                <div>
                  <p className="roles__ill-name">
                    {role.id === 'student' ? 'Alex Johnson' : role.id === 'instructor' ? 'Dr. Sarah Lee' : 'Admin Panel'}
                  </p>
                  <p className="roles__ill-role" style={{ color: role.color }}>{role.label}</p>
                </div>
              </div>

              <div className="roles__ill-body">
                {role.id === 'student' && (
                  <>
                    <div className="roles__ill-row"><span>Enrolled Courses</span><strong>4</strong></div>
                    <div className="roles__ill-row"><span>Schedule Conflicts</span><strong style={{ color: '#10b981' }}>None</strong></div>
                    <div className="roles__ill-row"><span>Materials Available</span><strong>18</strong></div>
                    <div className="roles__ill-row"><span>Next Class</span><strong>Mon 10:00 AM</strong></div>
                  </>
                )}
                {role.id === 'instructor' && (
                  <>
                    <div className="roles__ill-row"><span>My Courses</span><strong>3</strong></div>
                    <div className="roles__ill-row"><span>Enrolled Students</span><strong>87</strong></div>
                    <div className="roles__ill-row"><span>Uploaded Materials</span><strong>24</strong></div>
                    <div className="roles__ill-row"><span>Next Session</span><strong>Tue 1:00 PM</strong></div>
                  </>
                )}
                {role.id === 'admin' && (
                  <>
                    <div className="roles__ill-row"><span>Total Users</span><strong>320</strong></div>
                    <div className="roles__ill-row"><span>Active Courses</span><strong>42</strong></div>
                    <div className="roles__ill-row"><span>Total Enrollments</span><strong>610</strong></div>
                    <div className="roles__ill-row"><span>Schedule Conflicts</span><strong style={{ color: '#ef4444' }}>2</strong></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
