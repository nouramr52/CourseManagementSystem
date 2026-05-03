import React from 'react'
import './Courses.css'

const courses = [
  {
    dept: 'Computer Science',
    deptColor: '#4f46e5',
    deptBg: '#eef2ff',
    title: 'Database Systems',
    instructor: 'Dr. James Carter',
    day: 'Mon / Wed',
    time: '10:00 AM – 11:30 AM',
    seats: 12,
    totalSeats: 30,
    icon: '🗄️',
  },
  {
    dept: 'Computer Science',
    deptColor: '#06b6d4',
    deptBg: '#ecfeff',
    title: 'Software Engineering',
    instructor: 'Prof. Aisha Patel',
    day: 'Tue / Thu',
    time: '1:00 PM – 2:30 PM',
    seats: 5,
    totalSeats: 25,
    icon: '⚙️',
  },
  {
    dept: 'Information Systems',
    deptColor: '#10b981',
    deptBg: '#ecfdf5',
    title: 'Web Development',
    instructor: 'Sarah Kim',
    day: 'Mon / Wed / Fri',
    time: '9:00 AM – 10:00 AM',
    seats: 18,
    totalSeats: 35,
    icon: '🌐',
  },
  {
    dept: 'Computer Science',
    deptColor: '#8b5cf6',
    deptBg: '#f5f3ff',
    title: 'Operating Systems',
    instructor: 'Dr. Lena Müller',
    day: 'Tue / Thu',
    time: '10:00 AM – 11:30 AM',
    seats: 0,
    totalSeats: 30,
    icon: '💻',
  },
  {
    dept: 'Cybersecurity',
    deptColor: '#ef4444',
    deptBg: '#fef2f2',
    title: 'Network Security',
    instructor: 'Carlos Rivera',
    day: 'Wed / Fri',
    time: '2:00 PM – 3:30 PM',
    seats: 9,
    totalSeats: 20,
    icon: '🔐',
  },
  {
    dept: 'Information Systems',
    deptColor: '#f59e0b',
    deptBg: '#fffbeb',
    title: 'Data Structures',
    instructor: 'Mark Thompson',
    day: 'Mon / Wed',
    time: '3:00 PM – 4:30 PM',
    seats: 22,
    totalSeats: 40,
    icon: '📊',
  },
]

export default function Courses() {
  return (
    <section className="courses" id="courses">
      <div className="courses__container">
        <div className="section-header">
          <span className="section-tag">Course Catalog</span>
          <h2 className="section-title">Browse available courses</h2>
          <p className="section-subtitle">
            View course schedules, available seats, and instructor details.
            Login or create an account to enroll.
          </p>
        </div>

        <div className="courses__grid">
          {courses.map((c) => {
            const full = c.seats === 0
            const seatPct = Math.round((c.seats / c.totalSeats) * 100)
            const seatColor = full ? '#ef4444' : c.seats <= 5 ? '#f59e0b' : '#10b981'

            return (
              <div key={c.title} className="course-card">
                {/* Header */}
                <div className="course-card__thumb" style={{ background: c.deptBg }}>
                  <span className="course-card__emoji">{c.icon}</span>
                  <span
                    className="course-card__status"
                    style={{
                      background: full ? '#fee2e2' : '#dcfce7',
                      color: full ? '#dc2626' : '#16a34a',
                    }}
                  >
                    {full ? 'Full' : 'Open'}
                  </span>
                </div>

                {/* Body */}
                <div className="course-card__body">
                  <span className="course-card__dept" style={{ color: c.deptColor }}>
                    {c.dept}
                  </span>
                  <h3 className="course-card__title">{c.title}</h3>

                  <div className="course-card__instructor">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                    {c.instructor}
                  </div>

                  <div className="course-card__schedule">
                    <div className="course-card__schedule-row">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {c.day}
                    </div>
                    <div className="course-card__schedule-row">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {c.time}
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="course-card__seats">
                    <div className="course-card__seats-meta">
                      <span>Available Seats</span>
                      <span style={{ color: seatColor, fontWeight: 700 }}>
                        {full ? 'Full' : `${c.seats} / ${c.totalSeats}`}
                      </span>
                    </div>
                    <div className="course-card__seats-bar">
                      <div
                        className="course-card__seats-fill"
                        style={{
                          width: `${100 - seatPct}%`,
                          background: seatColor,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    className="course-card__btn"
                    style={{
                      background: full ? '#f1f5f9' : c.deptColor,
                      color: full ? '#94a3b8' : 'white',
                      cursor: full ? 'not-allowed' : 'pointer',
                    }}
                    disabled={full}
                  >
                    {full ? 'Course Full' : 'View Details'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="courses__footer">
          <button className="courses__view-all">
            View Full Catalog
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
