import { useEffect, useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        {/* Logo */}
        <a href="#" className="navbar__logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#4f46e5" />
            <path d="M7 10l7-4 7 4v8l-7 4-7-4V10z" fill="white" fillOpacity=".9" />
            <path d="M14 6v16M7 10l7 4 7-4" stroke="#4f46e5" strokeWidth="1.2" />
          </svg>
          <span className="navbar__logo-text">EduFlow</span>
        </a>

        {/* Nav links */}
        <nav className="navbar__nav">
          <a href="#" className="navbar__link">Home</a>
          <a href="#courses" className="navbar__link">Courses</a>
        </nav>

        {/* Auth buttons */}
        <div className="navbar__actions">
          <button className="btn btn--ghost">Login</button>
          <button className="btn btn--primary">Create Account</button>
        </div>

      </div>
    </header>
  )
}
