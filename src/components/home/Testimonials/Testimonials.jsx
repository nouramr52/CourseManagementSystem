import React from 'react'
import './Testimonials.css'

const testimonials = [
  {
    name: 'Emily Rodriguez',
    role: 'Computer Science Student',
    avatar: 'ER',
    color: '#4f46e5',
    quote:
      'EduFlow completely changed how I manage my coursework. The dashboard is clean, the grade tracking is instant, and I never miss a deadline anymore.',
    rating: 5,
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Professor of Data Science',
    avatar: 'MC',
    color: '#06b6d4',
    quote:
      'As an instructor, the course builder and analytics tools save me hours every week. I can see exactly where students are struggling and adjust my teaching accordingly.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'University Administrator',
    avatar: 'PS',
    color: '#8b5cf6',
    quote:
      'Managing 5,000 students across 12 departments used to be a nightmare. EduFlow\'s admin panel gives us full visibility and control in one place.',
    rating: 5,
  },
  {
    name: 'Jake Williams',
    role: 'Software Engineering Student',
    avatar: 'JW',
    color: '#10b981',
    quote:
      'The discussion boards and messaging features make it so easy to collaborate with classmates and get quick responses from instructors. Love it.',
    rating: 5,
  },
  {
    name: 'Dr. Fatima Al-Hassan',
    role: 'Instructor, Business School',
    avatar: 'FA',
    color: '#f59e0b',
    quote:
      'Setting up my first course took less than an hour. The quiz builder is intuitive and the automated grading saves me so much time.',
    rating: 5,
  },
  {
    name: 'Tom Nguyen',
    role: 'IT Admin, State University',
    avatar: 'TN',
    color: '#ef4444',
    quote:
      'The role-based access controls and audit logs give our security team peace of mind. EduFlow takes compliance seriously.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__container">
        <div className="section-header">
          <span className="section-tag">What People Say</span>
          <h2 className="section-title">Loved by students, instructors &amp; admins</h2>
          <p className="section-subtitle">
            Real feedback from the people who use EduFlow every day.
          </p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-card__stars">
                {'★'.repeat(t.rating)}
              </div>
              <p className="testimonial-card__quote">"{t.quote}"</p>
              <div className="testimonial-card__author">
                <div
                  className="testimonial-card__avatar"
                  style={{ background: `${t.color}20`, color: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
