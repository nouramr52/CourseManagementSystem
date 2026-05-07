import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Sidebar.css'

const navItems = [
  { id: 'overview',  label: 'Overview',         icon: '🏠' },
  { id: 'courses',   label: 'My Courses',        icon: '📋' },
  { id: 'students',  label: 'Students',          icon: '👥' },
  { id: 'schedule',  label: 'Schedule',          icon: '📅' },
  { id: 'materials', label: 'Upload Materials',  icon: '📁' },
]

export default function Sidebar({ active, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#4f46e5" />
          <path d="M7 10l7-4 7 4v8l-7 4-7-4V10z" fill="white" fillOpacity=".9" />
          <path d="M14 6v16M7 10l7 4 7-4" stroke="#4f46e5" strokeWidth="1.2" />
        </svg>
        {!collapsed && <span className="sidebar__logo-text">EduFlow</span>}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="sidebar__role">
          <span className="sidebar__role-badge">👨‍🏫 Instructor</span>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar__item ${active === item.id ? 'sidebar__item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : ''}
          >
            <span className="sidebar__item-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__item-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button className="sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '→' : '←'}
      </button>

      {/* Logout */}
      <button className="sidebar__logout" onClick={handleLogout}>
        <span>🚪</span>
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  )
}
