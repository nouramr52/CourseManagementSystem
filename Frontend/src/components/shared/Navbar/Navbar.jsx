import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [isLoggedIn,  setIsLoggedIn]  = useState(false)
  const [user,        setUser]        = useState(null)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const menuRef = useRef(null)
  const navigate  = useNavigate()
  const location  = useLocation()

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Re-read auth on every route change
  useEffect(() => {
    const token    = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    const parsed   = userData && userData !== 'undefined' ? JSON.parse(userData) : null
    if (token && parsed) { setIsLoggedIn(true); setUser(parsed) }
    else                 { setIsLoggedIn(false); setUser(null) }
  }, [location])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('storage'))
    setIsLoggedIn(false)
    setUser(null)
    setMenuOpen(false)
    navigate('/')
  }

  const goToDashboard = () => {
    setMenuOpen(false)
    const role = user?.role?.toUpperCase()
    if (role === 'ADMIN')      navigate('/admin/dashboard')
    else if (role === 'INSTRUCTOR') navigate('/instructor/dashboard')
    else                       navigate('/dashboard')
  }

  // Initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const roleColor = {
    STUDENT:    { bg: '#eef2ff', color: '#4f46e5' },
    INSTRUCTOR: { bg: '#ecfeff', color: '#06b6d4' },
    ADMIN:      { bg: '#f5f3ff', color: '#8b5cf6' },
  }[user?.role?.toUpperCase()] || { bg: '#f1f5f9', color: '#64748b' }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        {/* Logo */}
        <a href="/" className="navbar__logo" onClick={(e) => { e.preventDefault(); navigate('/') }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#4f46e5" />
            <path d="M7 10l7-4 7 4v8l-7 4-7-4V10z" fill="white" fillOpacity=".9" />
            <path d="M14 6v16M7 10l7 4 7-4" stroke="#4f46e5" strokeWidth="1.2" />
          </svg>
          <span className="navbar__logo-text">EduFlow</span>
        </a>

        {/* Nav links */}
        <nav className="navbar__nav">
          <a href="/" className="navbar__link" onClick={(e) => { e.preventDefault(); navigate('/') }}>
            Home
          </a>
          <a href="/courses" className="navbar__link" onClick={(e) => { e.preventDefault(); navigate('/courses') }}>
            Courses
          </a>
        </nav>

        {/* Right side */}
        {!isLoggedIn ? (
          <div className="navbar__actions">
            <button className="btn btn--ghost"    onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn--primary"  onClick={() => navigate('/signup')}>Create Account</button>
          </div>
        ) : (
          <div className="navbar__actions">
            {/* Avatar button — opens dropdown */}
            <div className="navbar__avatar-wrap" ref={menuRef}>
              <button
                className="navbar__avatar"
                style={{ background: roleColor.bg, color: roleColor.color }}
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Account menu"
                aria-expanded={menuOpen}
              >
                <span className="navbar__avatar-initials">{initials}</span>
                <svg
                  className={`navbar__avatar-chevron ${menuOpen ? 'navbar__avatar-chevron--open' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div className="navbar__dropdown">
                  {/* User info header */}
                  <div className="navbar__dropdown-header">
                    <div className="navbar__dropdown-avatar" style={{ background: roleColor.bg, color: roleColor.color }}>
                      {initials}
                    </div>
                    <div>
                      <p className="navbar__dropdown-name">{user?.name}</p>
                      <p className="navbar__dropdown-role" style={{ color: roleColor.color }}>
                        {user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="navbar__dropdown-divider" />

                  {/* Dashboard link */}
                  <button className="navbar__dropdown-item" onClick={goToDashboard}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Dashboard
                  </button>

                  <div className="navbar__dropdown-divider" />

                  {/* Logout */}
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  )
}
