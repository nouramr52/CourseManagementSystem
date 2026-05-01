import React from 'react'
import './Features.css'

const features = [
  {
    icon: '👥',
    title: 'User Management',
    desc: 'Create and manage student, instructor, and admin accounts with role-based access control across the entire system.',
    color: '#4f46e5',
    bg: '#eef2ff',
  },
  {
    icon: '📋',
    title: 'Course Management',
    desc: 'Instructors can add, edit, and manage courses. Admins oversee all courses and assign instructors to sections.',
    color: '#06b6d4',
    bg: '#ecfeff',
  },
  {
    icon: '🔍',
    title: 'Course Browsing',
    desc: 'Students can browse the full course catalog, view details, check available seats, and review schedules before enrolling.',
    color: '#10b981',
    bg: '#ecfdf5',
  },
  {
    icon: '📝',
    title: 'Enrollment Management',
    desc: 'Students enroll or drop courses with automatic conflict detection. Admins can manage and override enrollments.',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    icon: '📅',
    title: 'Schedule Management',
    desc: 'View and manage class schedules by day and time. The system automatically detects and flags scheduling conflicts.',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    icon: '🛡️',
    title: 'Administration',
    desc: 'Admins manage all users, courses, enrollments, and schedules from a centralized control panel with full oversight.',
    color: '#ef4444',
    bg: '#fef2f2',
  },
]

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="features__container">
        <div className="section-header">
          <span className="section-tag">System Modules</span>
          <h2 className="section-title">Everything managed in one place</h2>
          <p className="section-subtitle">
            A centralized platform covering all core modules of a course
            management system — from user roles to schedule conflict detection.
          </p>
        </div>

        <div className="features__grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card__icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
