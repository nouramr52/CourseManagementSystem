import { useState } from 'react'
import './AdminUsersTable.css'

const allUsers = [
  { id: 1,  name: 'Alex Johnson',    email: 'alex.j@university.edu',    role: 'Student',    status: 'Active',   joined: '2024-09-01', courses: 3 },
  { id: 2,  name: 'Maria Garcia',    email: 'maria.g@university.edu',   role: 'Student',    status: 'Active',   joined: '2024-09-01', courses: 2 },
  { id: 3,  name: 'James Wilson',    email: 'james.w@university.edu',   role: 'Student',    status: 'Active',   joined: '2024-09-02', courses: 4 },
  { id: 4,  name: 'Fatima Al-Said',  email: 'fatima.s@university.edu',  role: 'Student',    status: 'Inactive', joined: '2024-09-02', courses: 1 },
  { id: 5,  name: 'Chen Wei',        email: 'chen.w@university.edu',    role: 'Student',    status: 'Active',   joined: '2024-09-03', courses: 3 },
  { id: 6,  name: 'Sara Ahmed',      email: 'sara.a@university.edu',    role: 'Student',    status: 'Active',   joined: '2024-09-03', courses: 2 },
  { id: 7,  name: 'Omar Hassan',     email: 'omar.h@university.edu',    role: 'Student',    status: 'Active',   joined: '2024-09-01', courses: 5 },
  { id: 8,  name: 'Lena Müller',     email: 'lena.m@university.edu',    role: 'Student',    status: 'Active',   joined: '2024-09-02', courses: 2 },
  { id: 9,  name: 'Dr. Sarah Lee',   email: 'sarah.l@university.edu',   role: 'Instructor', status: 'Active',   joined: '2015-09-01', courses: 4 },
  { id: 10, name: 'Prof. M. Chen',   email: 'michael.c@university.edu', role: 'Instructor', status: 'Active',   joined: '2018-01-15', courses: 3 },
  { id: 11, name: 'Dr. Emily R.',    email: 'emily.r@university.edu',   role: 'Instructor', status: 'Active',   joined: '2019-08-20', courses: 2 },
  { id: 12, name: 'Prof. James W.',  email: 'james.w2@university.edu',  role: 'Instructor', status: 'Inactive', joined: '2020-03-10', courses: 1 },
  { id: 13, name: 'Admin',           email: 'admin@university.edu',     role: 'Admin',      status: 'Active',   joined: '2014-01-01', courses: 0 },
]

const roles = ['All Roles', 'Student', 'Instructor', 'Admin']

const roleStyle = {
  Student:    { bg: '#eef2ff', color: '#4f46e5' },
  Instructor: { bg: '#ecfdf5', color: '#059669' },
  Admin:      { bg: '#fef2f2', color: '#dc2626' },
}

const statusStyle = {
  Active:   { bg: '#dcfce7', color: '#16a34a' },
  Inactive: { bg: '#f1f5f9', color: '#64748b' },
}

const avatarColors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function AdminUsersTable() {
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState(allUsers)

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'All Roles' || u.role === roleFilter
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
    }
  }

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="admin-users__header">
        <div>
          <h2 className="admin-users__title">Users</h2>
          <p className="admin-users__sub">Manage all students, instructors, and admins</p>
        </div>
        <button className="admin-users__add-btn">+ Add User</button>
      </div>

      {/* Filters */}
      <div className="admin-users__filters">
        <input
          className="admin-users__search"
          placeholder="🔍  Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="admin-users__tabs">
          {roles.map((r) => (
            <button
              key={r}
              className={`admin-users__tab ${roleFilter === r ? 'admin-users__tab--active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <span className="admin-users__count">{filtered.length} users</span>
      </div>

      {/* Table */}
      <div className="admin-users__table-wrap">
        <table className="admin-users__table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Courses</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-users__empty">No users found.</div>
                </td>
              </tr>
            ) : (
              filtered.map((u, i) => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-users__user-cell">
                      <div
                        className="admin-users__avatar"
                        style={{ background: avatarColors[i % avatarColors.length] }}
                      >
                        {initials(u.name)}
                      </div>
                      <div>
                        <div className="admin-users__user-name">{u.name}</div>
                        <div className="admin-users__user-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="admin-badge"
                      style={{ background: roleStyle[u.role]?.bg, color: roleStyle[u.role]?.color }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className="admin-badge"
                      style={{ background: statusStyle[u.status]?.bg, color: statusStyle[u.status]?.color }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>{u.courses}</td>
                  <td>{u.joined}</td>
                  <td>
                    <div className="admin-users__actions">
                      <button className="admin-users__action-btn">Edit</button>
                      <button
                        className="admin-users__action-btn admin-users__action-btn--danger"
                        onClick={() => handleDelete(u.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
