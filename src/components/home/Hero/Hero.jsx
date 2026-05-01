import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="hero">
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />
      <div className="hero__blob hero__blob--3" aria-hidden="true" />

      <div className="hero__container">
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            For Students, Instructors, and Administrators
          </div>

          <h1 className="hero__title">
            A Course Management System
            <span className="hero__title-highlight"> Built for Everyone</span>
          </h1>

          <p className="hero__subtitle">
            Manage courses, schedules, enrollments, materials, and user roles
            in one centralized platform — designed for students, instructors,
            and administrators.
          </p>

          <div className="hero__actions">
            <button className="hero__btn hero__btn--primary" onClick={() => navigate('/login', { state: { role: 'student' } })}>
              Login as Student
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
            </button>
            <button className="hero__btn hero__btn--secondary" onClick={() => navigate('/signup')}>
              Create Account
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" />
              </svg>
            </button>
          </div>

          {/* Role badges */}
          <div className="hero__roles">
            {[
              { emoji: '🎓', label: 'Student', color: '#4f46e5', bg: '#eef2ff' },
              { emoji: '👨‍🏫', label: 'Instructor', color: '#06b6d4', bg: '#ecfeff' },
              { emoji: '🛡️', label: 'Admin', color: '#8b5cf6', bg: '#f5f3ff' },
            ].map((r) => (
              <div key={r.label} className="hero__role-badge" style={{ background: r.bg, color: r.color }}>
                <span>{r.emoji}</span>
                {r.label}
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview card */}
        <div className="hero__visual">
          <div className="hero__card">
            <div className="hero__card-header">
              <div className="hero__card-dots">
                <span style={{ background: '#ef4444' }} />
                <span style={{ background: '#f59e0b' }} />
                <span style={{ background: '#10b981' }} />
              </div>
              <span className="hero__card-title">System Overview</span>
            </div>

            <div className="hero__card-body">
              <p className="hero__card-label">My Enrolled Courses</p>

              {[
                { name: 'Database Systems', day: 'Mon / Wed', time: '10:00 AM', color: '#4f46e5' },
                { name: 'Software Engineering', day: 'Tue / Thu', time: '1:00 PM', color: '#06b6d4' },
                { name: 'Operating Systems', day: 'Mon / Fri', time: '3:00 PM', color: '#10b981' },
              ].map((c) => (
                <div key={c.name} className="hero__course-row">
                  <span className="hero__course-dot" style={{ background: c.color }} />
                  <div className="hero__course-info">
                    <span className="hero__course-name">{c.name}</span>
                    <span className="hero__course-schedule">{c.day} · {c.time}</span>
                  </div>
                </div>
              ))}

              <div className="hero__mini-stats">
                <div className="hero__mini-stat">
                  <span className="hero__mini-stat-value">3</span>
                  <span className="hero__mini-stat-label">Enrolled</span>
                </div>
                <div className="hero__mini-stat">
                  <span className="hero__mini-stat-value">12</span>
                  <span className="hero__mini-stat-label">Materials</span>
                </div>
                <div className="hero__mini-stat">
                  <span className="hero__mini-stat-value">0</span>
                  <span className="hero__mini-stat-label">Conflicts</span>
                </div>
              </div>

              <p className="hero__card-label" style={{ marginTop: '1rem' }}>Upcoming Schedule</p>
              {[
                { title: 'Database Systems', time: 'Monday, 10:00 AM', color: '#4f46e5' },
                { title: 'Software Engineering', time: 'Tuesday, 1:00 PM', color: '#06b6d4' },
              ].map((e) => (
                <div key={e.title} className="hero__event">
                  <span className="hero__event-dot" style={{ background: e.color }} />
                  <div>
                    <p className="hero__event-title">{e.title}</p>
                    <p className="hero__event-time">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero__float hero__float--1">
            <span>✅</span> Enrollment confirmed!
          </div>
          <div className="hero__float hero__float--2">
            <span>⚠️</span> Schedule conflict detected
          </div>
        </div>
      </div>
    </section>
  )
}
