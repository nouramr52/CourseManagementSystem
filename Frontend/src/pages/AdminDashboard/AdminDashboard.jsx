import { useState } from 'react'
import AdminSidebar from '../../components/admin/Sidebar/AdminSidebar'
import AdminTopBar from '../../components/admin/TopBar/AdminTopBar'
import AdminOverview from '../../components/admin/Overview/AdminOverview'
import AdminUsersTable from '../../components/admin/UsersTable/AdminUsersTable'
import AdminCoursesTable from '../../components/admin/CoursesTable/AdminCoursesTable'
import AdminAnalytics from '../../components/admin/Analytics/AdminAnalytics'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('overview')

  return (
    <div className="admin-dashboard">
      <AdminSidebar active={activePage} onNavigate={setActivePage} />

      <div className="admin-dashboard__main">
        <AdminTopBar activePage={activePage} />

        <div className="admin-dashboard__content">
          {activePage === 'overview'  && <AdminOverview onNavigate={setActivePage} />}
          {activePage === 'users'     && <AdminUsersTable />}
          {activePage === 'courses'   && <AdminCoursesTable />}
          {activePage === 'analytics' && <AdminAnalytics />}
        </div>
      </div>
    </div>
  )
}
