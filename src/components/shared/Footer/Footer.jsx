import React from 'react'
import './Footer.css'

const links = {
  Platform: ['Features', 'Courses', 'Pricing', 'Integrations', 'Changelog'],
  'For Users': ['Students', 'Instructors', 'Administrators', 'Institutions', 'Enterprise'],
  Resources: ['Documentation', 'Help Center', 'Blog', 'Webinars', 'Community'],
  Company: ['About Us', 'Careers', 'Press', 'Contact', 'Privacy Policy'],
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#4f46e5" />
                <path d="M7 10l7-4 7 4v8l-7 4-7-4V10z" fill="white" fillOpacity=".9" />
              </svg>
              <span>EduFlow</span>
            </div>
            <p className="footer__tagline">
              The modern course management platform for students, instructors, and institutions.
            </p>
            <div className="footer__socials">
              {['𝕏', 'in', 'f', '▶'].map((s, i) => (
                <a key={i} href="#" className="footer__social" aria-label={`Social ${i}`}>{s}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group} className="footer__col">
              <h4 className="footer__col-title">{group}</h4>
              <ul className="footer__col-list">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="footer__col-link">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p>© 2026 EduFlow. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
