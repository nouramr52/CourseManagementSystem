/**
 * Shared CourseCard component used across the whole app.
 *
 * Props:
 *  course      – course object from the API
 *  idx         – position index (used for colour fallback)
 *  isEnrolled  – boolean, whether the current student is enrolled
 *  isEnrolling – boolean, whether an enroll request is in-flight for this card
 *  onEnroll    – (course) => void   — called when "Enroll Now" is clicked
 *  onDrop      – (course) => void   — called when "Drop" is clicked
 *  isGuest     – boolean, hide enroll/drop and show only View Details
 */

import { useNavigate } from 'react-router-dom'
import './CourseCard.css'

const DEPT_COLORS = [
  { color: '#4f46e5', bg: '#eef2ff' },
  { color: '#06b6d4', bg: '#ecfeff' },
  { color: '#10b981', bg: '#ecfdf5' },
  { color: '#f59e0b', bg: '#fffbeb' },
  { color: '#8b5cf6', bg: '#f5f3ff' },
  { color: '#ef4444', bg: '#fef2f2' },
]

const DEPT_PALETTE = {
  'Computer Science': 0,
  'Software Engineering': 1,
  'Information Systems': 2,
  'Data Science': 3,
  'Artificial Intelligence': 4,
  'Cybersecurity': 5,
  'Networking': 1,
  'Mathematics': 2,
  'Physics': 3,
  'General': 0,
}

const DEFAULT_ICONS = ['🗄️', '⚙️', '🌐', '💻', '🔐', '📊', '🤖', '📚', '🧮', '📡']

export const getPalette = (course, idx) => {
  if (course.dept && DEPT_PALETTE[course.dept] !== undefined) {
    return DEPT_COLORS[DEPT_PALETTE[course.dept]]
  }
  return DEPT_COLORS[idx % DEPT_COLORS.length]
}

export default function CourseCard({
  course,
  idx = 0,
  isEnrolled = false,
  isEnrolling = false,
  onEnroll = null,
  onDrop = null,
  isGuest = false,
}) {
  const navigate = useNavigate()

  const palette = getPalette(course, idx)
  const icon = course.icon || DEFAULT_ICONS[idx % DEFAULT_ICONS.length]
  const enrolled = course._count?.enrollments ?? 0
  const isFull = enrolled >= course.capacity
  const seatsLeft = course.capacity - enrolled
  const seatColor = isFull ? '#ef4444' : seatsLeft <= 5 ? '#f59e0b' : '#10b981'

  return (
    <div
      className="course-card"
      style={isEnrolled ? { borderColor: '#a5b4fc', boxShadow: '0 0 0 2px rgba(79,70,229,0.12)' } : {}}
    >
      {/* Enrolled ribbon */}
      {isEnrolled && <div className="cc-ribbon">✓ Enrolled</div>}

      {/* Thumb */}
      <div className="course-card__thumb" style={{ background: palette.bg }}>
        <span className="course-card__emoji">{icon}</span>
        <span
          className="course-card__status"
          style={{
            background: isEnrolled ? '#eef2ff' : isFull ? '#fee2e2' : '#dcfce7',
            color: isEnrolled ? '#4f46e5' : isFull ? '#dc2626' : '#16a34a',
          }}
        >
          {isEnrolled ? '✓ Enrolled' : isFull ? 'Full' : 'Open'}
        </span>
      </div>

      {/* Body */}
      <div className="course-card__body">
        <span className="course-card__dept" style={{ color: palette.color }}>
          {course.dept || 'General'}
        </span>

        <h3 className="course-card__title">{course.title}</h3>

        <div className="course-card__instructor">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          </svg>
          {course.instructor?.name ?? 'Unknown Instructor'}
        </div>

        {course.description && (
          <p className="cc-desc">{course.description}</p>
        )}

        {/* Schedule */}
        {course.schedules?.length > 0 && (
          <div className="course-card__schedule">
            <div className="course-card__schedule-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {course.schedules.map(s => s.day).join(' / ')}
            </div>
            <div className="course-card__schedule-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {course.schedules[0].startTime} – {course.schedules[course.schedules.length - 1].endTime}
            </div>
          </div>
        )}

        {/* Seats */}
        <div className="course-card__seats">
          <div className="course-card__seats-meta">
            <span>Available Seats</span>
            <span style={{ color: seatColor, fontWeight: 700 }}>
              {isFull ? 'Full' : `${seatsLeft} / ${course.capacity}`}
            </span>
          </div>
          <div className="course-card__seats-bar">
            <div
              className="course-card__seats-fill"
              style={{ width: `${(enrolled / course.capacity) * 100}%`, background: seatColor }}
            />
          </div>
        </div>

        {/* ── Action buttons ── */}
        {isGuest ? (
          /* Guest — View Details + Sign in to enroll */
          <div className="cc-actions">
            <button
              className="course-card__btn cc-btn--primary"
              style={{ background: palette.color }}
              onClick={() => onEnroll?.(course)}
            >
              Enroll Now
            </button>
            <button
              className="course-card__btn cc-btn--outline"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              View Details
            </button>
          </div>

        ) : isEnrolled ? (
          /* Enrolled — View Details + Drop */
          <div className="cc-actions">
            <button
              className="course-card__btn cc-btn--primary"
              style={{ background: '#4f46e5' }}
              onClick={() => navigate(`/course/${course.id}`)}
            >
              View Details
            </button>
            <button
              className="course-card__btn cc-btn--drop"
              onClick={() => onDrop?.(course)}
            >
              Drop
            </button>
          </div>

        ) : isFull ? (
          /* Full — disabled Enroll + View Details */
          <div className="cc-actions">
            <button className="course-card__btn cc-btn--disabled" disabled>
              Course Full
            </button>
            <button
              className="course-card__btn cc-btn--primary"
              style={{ background: '#4f46e5' }}
              onClick={() => navigate(`/course/${course.id}`)}
            >
              View Details
            </button>
          </div>

        ) : (
          /* Open — Enroll Now + View Details */
          <div className="cc-actions">
            <button
              className="course-card__btn cc-btn--primary"
              style={{ background: palette.color }}
              disabled={isEnrolling}
              onClick={() => onEnroll?.(course)}
            >
              {isEnrolling ? '⏳ Enrolling…' : 'Enroll Now'}
            </button>
            <button
              className="course-card__btn cc-btn--primary"
              style={{ background: '#4f46e5' }}
              onClick={() => navigate(`/course/${course.id}`)}
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
