import { useState } from 'react'
import Sidebar from '../../components/instructor/Sidebar/Sidebar'
import TopBar from '../../components/instructor/TopBar/TopBar'
import Overview from '../../components/instructor/Overview/Overview'
import MyCourses from '../../components/instructor/MyCourses/MyCourses'
import StudentsTable from '../../components/instructor/StudentsTable/StudentsTable'
import Schedule from '../../components/instructor/Schedule/Schedule'
import UploadMaterial from '../../components/instructor/UploadMaterial/UploadMaterial'
import './InstructorDashboard.css'

function PageCard({ children }) {
  return <div className="page-card">{children}</div>
}

export default function InstructorDashboard() {
  const [activePage, setActivePage] = useState('overview')

  return (
    <div className="instructor-dashboard">
      <Sidebar active={activePage} onNavigate={setActivePage} />

      <div className="instructor-dashboard__main">
        <TopBar activePage={activePage} />

        <div className="instructor-dashboard__content">
          {activePage === 'overview'  && <Overview onNavigate={setActivePage} />}
          {activePage === 'courses'   && <PageCard><MyCourses /></PageCard>}
          {activePage === 'students'  && <PageCard><StudentsTable /></PageCard>}
          {activePage === 'schedule'  && <PageCard><Schedule /></PageCard>}
          {activePage === 'materials' && <PageCard><UploadMaterial /></PageCard>}
        </div>
      </div>
    </div>
  )
}
