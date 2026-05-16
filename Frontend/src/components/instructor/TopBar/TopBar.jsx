import { useEffect, useRef, useState } from 'react'
import { getMe } from '../../../api/userApi'
import { getInstructorNotifications } from '../../../api/instructorApi'
import './TopBar.css'

const pageTitles = {
  overview: 'Overview',
  courses: 'My Courses',
  students: 'Students',
  schedule: 'Schedule',
  materials: 'Upload Materials',
}

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

// How long ago a date was, as a short human string
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TopBar({ activePage }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  // Track which notification ids the user has "seen" (stored in localStorage)
  const [seenIds, setSeenIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('notif_seen') || '[]')) }
    catch { return new Set() }
  })

  const dropdownRef = useRef(null)

  // Load user
  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
      })
      .catch(() => { })
  }, [])

  // Load notifications
  useEffect(() => {
    getInstructorNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => { })
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter((n) => !seenIds.has(n.id)).length

  const handleOpen = () => {
    setOpen((prev) => !prev)
    // Mark all current notifications as seen when opening
    if (!open && notifications.length > 0) {
      const newSeen = new Set([...seenIds, ...notifications.map((n) => n.id)])
      setSeenIds(newSeen)
      localStorage.setItem('notif_seen', JSON.stringify([...newSeen]))
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="topbar">
      <div className="topbar__left">
        <h1 className="topbar__title">{pageTitles[activePage]}</h1>
        <p className="topbar__date">{today}</p>
      </div>

      <div className="topbar__right">

        {/* ── Notification bell ── */}
        <div className="topbar__notif-wrap" ref={dropdownRef}>
          <button
            className={`topbar__icon-btn ${open ? 'topbar__icon-btn--active' : ''}`}
            title="Notifications"
            onClick={handleOpen}
          >
            🔔
            {unreadCount > 0 && (
              <span className="topbar__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {open && (
            <div className="notif-dropdown">
              <div className="notif-dropdown__header">
                <span className="notif-dropdown__title">Notifications</span>
                {notifications.length > 0 && (
                  <span className="notif-dropdown__count">{notifications.length} total</span>
                )}
              </div>

              <div className="notif-dropdown__list">
                {notifications.length === 0 ? (
                  <div className="notif-dropdown__empty">
                    <span>🔕</span>
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${n.type === 'drop' ? 'notif-item--drop' : 'notif-item--enroll'}`}
                    >
                      <div className="notif-item__icon">
                        {n.type === 'drop' ? '📤' : '🎓'}
                      </div>
                      <div className="notif-item__body">
                        <p className="notif-item__message">{n.message}</p>
                        <span className="notif-item__time">{timeAgo(n.time)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Profile ── */}
        <div className="topbar__profile">
          <div className="topbar__avatar">{user ? getInitials(user.name) : '…'}</div>
          <div className="topbar__profile-info">
            <span className="topbar__name">{user?.name ?? 'Loading…'}</span>
            <span className="topbar__role">Instructor</span>
          </div>
        </div>

      </div>
    </div>
  )
}
