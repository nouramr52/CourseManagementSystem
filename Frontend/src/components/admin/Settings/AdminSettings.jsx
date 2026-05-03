import { useState } from 'react'
import './AdminSettings.css'

function Toggle({ checked, onChange }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="admin-toggle__track" />
    </label>
  )
}

export default function AdminSettings() {
  const [siteName, setSiteName]         = useState('EduFlow')
  const [siteEmail, setSiteEmail]       = useState('admin@university.edu')
  const [maxEnrollment, setMaxEnrollment] = useState('40')
  const [timezone, setTimezone]         = useState('UTC-5')

  const [emailNotifs, setEmailNotifs]   = useState(true)
  const [newUserAlert, setNewUserAlert] = useState(true)
  const [courseAlert, setCourseAlert]   = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationOpen, setRegistrationOpen] = useState(true)

  const handleSave = () => {
    alert('Settings saved successfully!')
  }

  return (
    <div className="admin-settings">
      <div>
        <h2 className="admin-settings__title">Settings</h2>
        <p className="admin-settings__sub">Manage platform configuration and preferences</p>
      </div>

      {/* General */}
      <div className="admin-settings__section">
        <div className="admin-settings__section-header">
          <div className="admin-settings__section-title">General</div>
          <div className="admin-settings__section-desc">Basic platform information</div>
        </div>
        <div className="admin-settings__section-body">
          <div className="admin-settings__field">
            <label className="admin-settings__label">Platform Name</label>
            <input
              className="admin-settings__input"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className="admin-settings__field">
            <label className="admin-settings__label">Admin Email</label>
            <input
              className="admin-settings__input"
              type="email"
              value={siteEmail}
              onChange={(e) => setSiteEmail(e.target.value)}
            />
          </div>
          <div className="admin-settings__field">
            <label className="admin-settings__label">Default Max Enrollment per Course</label>
            <input
              className="admin-settings__input"
              type="number"
              value={maxEnrollment}
              onChange={(e) => setMaxEnrollment(e.target.value)}
            />
          </div>
          <div className="admin-settings__field">
            <label className="admin-settings__label">Timezone</label>
            <select
              className="admin-settings__select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="UTC-8">UTC-8 (Pacific)</option>
              <option value="UTC-7">UTC-7 (Mountain)</option>
              <option value="UTC-6">UTC-6 (Central)</option>
              <option value="UTC-5">UTC-5 (Eastern)</option>
              <option value="UTC+0">UTC+0 (London)</option>
              <option value="UTC+1">UTC+1 (Paris)</option>
              <option value="UTC+3">UTC+3 (Riyadh)</option>
            </select>
          </div>
          <button className="admin-settings__save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="admin-settings__section">
        <div className="admin-settings__section-header">
          <div className="admin-settings__section-title">Notifications</div>
          <div className="admin-settings__section-desc">Control what alerts you receive</div>
        </div>
        <div className="admin-settings__section-body">
          <div className="admin-settings__toggle-row">
            <div className="admin-settings__toggle-info">
              <span className="admin-settings__toggle-label">Email Notifications</span>
              <span className="admin-settings__toggle-desc">Receive email alerts for important events</span>
            </div>
            <Toggle checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
          </div>
          <div className="admin-settings__toggle-row">
            <div className="admin-settings__toggle-info">
              <span className="admin-settings__toggle-label">New User Registrations</span>
              <span className="admin-settings__toggle-desc">Alert when a new user signs up</span>
            </div>
            <Toggle checked={newUserAlert} onChange={() => setNewUserAlert(!newUserAlert)} />
          </div>
          <div className="admin-settings__toggle-row">
            <div className="admin-settings__toggle-info">
              <span className="admin-settings__toggle-label">New Course Created</span>
              <span className="admin-settings__toggle-desc">Alert when an instructor creates a course</span>
            </div>
            <Toggle checked={courseAlert} onChange={() => setCourseAlert(!courseAlert)} />
          </div>
        </div>
      </div>

      {/* Platform */}
      <div className="admin-settings__section">
        <div className="admin-settings__section-header">
          <div className="admin-settings__section-title">Platform Controls</div>
          <div className="admin-settings__section-desc">Manage platform-wide access settings</div>
        </div>
        <div className="admin-settings__section-body">
          <div className="admin-settings__toggle-row">
            <div className="admin-settings__toggle-info">
              <span className="admin-settings__toggle-label">Open Registration</span>
              <span className="admin-settings__toggle-desc">Allow new users to register</span>
            </div>
            <Toggle checked={registrationOpen} onChange={() => setRegistrationOpen(!registrationOpen)} />
          </div>
          <div className="admin-settings__toggle-row">
            <div className="admin-settings__toggle-info">
              <span className="admin-settings__toggle-label">Maintenance Mode</span>
              <span className="admin-settings__toggle-desc">Take the platform offline for maintenance</span>
            </div>
            <Toggle checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="admin-settings__section">
        <div className="admin-settings__section-header">
          <div className="admin-settings__section-title" style={{ color: '#dc2626' }}>Danger Zone</div>
          <div className="admin-settings__section-desc">Irreversible actions — proceed with caution</div>
        </div>
        <div className="admin-settings__section-body">
          <div className="admin-settings__toggle-row">
            <div className="admin-settings__toggle-info">
              <span className="admin-settings__toggle-label">Clear All Course Data</span>
              <span className="admin-settings__toggle-desc">Permanently delete all courses and enrollments</span>
            </div>
            <button className="admin-settings__danger-btn">Clear Data</button>
          </div>
          <div className="admin-settings__toggle-row">
            <div className="admin-settings__toggle-info">
              <span className="admin-settings__toggle-label">Reset Platform</span>
              <span className="admin-settings__toggle-desc">Wipe all data and restore factory defaults</span>
            </div>
            <button className="admin-settings__danger-btn">Reset</button>
          </div>
        </div>
      </div>

    </div>
  )
}
