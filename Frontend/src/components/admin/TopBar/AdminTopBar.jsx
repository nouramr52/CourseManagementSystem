import './AdminTopBar.css'

const pageTitles = {
  overview:  'Overview',
  users:     'Users',
  courses:   'Courses',
  analytics: 'Analytics',
}

export default function AdminTopBar({ activePage }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="admin-topbar">
      <div className="admin-topbar__left">
        <h1 className="admin-topbar__title">{pageTitles[activePage]}</h1>
        <p className="admin-topbar__date">{today}</p>
      </div>

      <div className="admin-topbar__right">
        <div className="admin-topbar__notifications">
          <button className="admin-topbar__icon-btn" title="Notifications">
            🔔
            <span className="admin-topbar__badge">3</span>
          </button>
        </div>

        <div className="admin-topbar__profile">
          <div className="admin-topbar__avatar">AD</div>
          <div className="admin-topbar__profile-info">
            <span className="admin-topbar__name">Admin</span>
            <span className="admin-topbar__role">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  )
}
