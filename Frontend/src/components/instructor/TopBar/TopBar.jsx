import './TopBar.css'

const pageTitles = {
  overview:  'Overview',
  courses:   'My Courses',
  students:  'Students',
  schedule:  'Schedule',
  materials: 'Upload Materials',
}

export default function TopBar({ activePage }) {
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
        <div className="topbar__notifications">
          <button className="topbar__icon-btn" title="Notifications">
            🔔
            <span className="topbar__badge">2</span>
          </button>
        </div>

        <div className="topbar__profile">
          <div className="topbar__avatar">SL</div>
          <div className="topbar__profile-info">
            <span className="topbar__name">Dr. Sarah Lee</span>
            <span className="topbar__role">Instructor</span>
          </div>
        </div>
      </div>
    </div>
  )
}
