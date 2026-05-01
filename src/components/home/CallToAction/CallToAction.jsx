import React from 'react'
import './CallToAction.css'

export default function CallToAction() {
  return (
    <section className="cta">
      <div className="cta__blob cta__blob--1" aria-hidden="true" />
      <div className="cta__blob cta__blob--2" aria-hidden="true" />

      <div className="cta__container">
        <span className="cta__tag">Get Started Today</span>
        <h2 className="cta__title">
          Ready to transform your learning experience?
        </h2>
        <p className="cta__subtitle">
          Join thousands of students, instructors, and institutions already
          using EduFlow. Set up your account in minutes — no credit card required.
        </p>

        <div className="cta__actions">
          <button className="cta__btn cta__btn--primary">
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="cta__trust">
          <span>✅ Free forever plan</span>
          <span>✅ No credit card needed</span>
          <span>✅ Setup in 5 minutes</span>
        </div>
      </div>
    </section>
  )
}
