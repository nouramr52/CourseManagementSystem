import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminSidebar.css'

const navItems = [
  { id: 'overview',    label: 'Overview',       icon: '🏠' },
  { id: 'users',       label: 'Users',          icon: '👥' },
  { id: 'courses',     label: 'Courses',        icon: '📋' },
  { id: 'analytics',   label: 'Analytics',      icon: '📊' },
  { id: 'settings',    label: 'Settings',       icon: '⚙️' },
]

export default function AdminSidebar({ active, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="admin-sidebar__logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#4f46e5" />
          <path d="M7 10l7-4 7 4v8l-7 4-7-4V10z" fill="white" fillOpacity=".9" />
          <path d="M14 6v16M7 10l7 4 7-4" stroke="#4f46e5" strokeWidth="1.2" />
        </svg>
        {!collapsed && <span className="admin-sidebar__logo-text">EduFlow</span>}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="admin-sidebar__role">
          <span className="admin-sidebar__role-badge">🛡️ Admin</span>
        </div>
      )}

      {/* Nav */}
      <nav className="admin-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`admin-sidebar__item ${active === item.id ? 'admin-sidebar__item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : ''}
          >
            <span className="admin-sidebar__item-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button className="admin-sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '→' : '←'}
      </button>

      {/* Logout */}
      <button className="admin-sidebar__logout" onClick={handleLogout}>
        <span>🚪</span>
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  )
}
