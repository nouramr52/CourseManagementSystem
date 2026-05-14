import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');

    const userData = localStorage.getItem("user");
    const parsedUser =
      userData && userData !== "undefined"
        ? JSON.parse(userData)
        : null;

    if (token && parsedUser) {
      setIsLoggedIn(true);
      setUser(parsedUser);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]);
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Dispatch a storage event so Home.jsx re-checks auth in the same tab
    window.dispatchEvent(new Event('storage'))
    setIsLoggedIn(false)
    setUser(null)
    navigate('/')
  }

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
          <a href="/" className="navbar__link" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a>
          {isLoggedIn && (
            <a
              href="/dashboard"
              className="navbar__link"
              onClick={(e) => {
                e.preventDefault()
                const role = user?.role?.toUpperCase()
                if (role === 'ADMIN') navigate('/admin/dashboard')
                else if (role === 'INSTRUCTOR') navigate('/instructor/dashboard')
                else navigate('/dashboard')
              }}
            >
              Dashboard
            </a>
          )}
        </nav>

        {/* Auth buttons - only show when NOT logged in */}
        {!isLoggedIn ? (
          <div className="navbar__actions">
            <button className="btn btn--ghost" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn--primary" onClick={() => navigate('/signup')}>Create Account</button>
          </div>
        ) : (
          <div className="navbar__actions">
            <div className="navbar__user">
              <span className="navbar__user-name">{user?.name}</span>
              <span className="navbar__user-role">{user?.role}</span>
            </div>
            <button className="btn btn--ghost" onClick={handleLogout}>Logout</button>
          </div>
        )}

      </div>
    </header>
  )
}
