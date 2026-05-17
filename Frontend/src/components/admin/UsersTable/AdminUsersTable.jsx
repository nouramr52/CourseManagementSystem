import { useEffect, useState } from 'react'
import adminService from '../../../services/adminService'
import './AdminUsersTable.css'

const roles = ['All Roles', 'STUDENT', 'INSTRUCTOR', 'ADMIN']

const roleStyle = {
  STUDENT:    { bg: '#eef2ff', color: '#4f46e5' },
  INSTRUCTOR: { bg: '#ecfdf5', color: '#059669' },
  ADMIN:      { bg: '#fef2f2', color: '#dc2626' },
}

const avatarColors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function Spinner() {
  return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
}

const emptyForm = { name: '', email: '', password: '', role: 'STUDENT' }

export default function AdminUsersTable() {
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [search, setSearch]         = useState('')

  // Modal state — mode: null | 'edit' | 'add'
  const [modal, setModal]   = useState(null)
  const [form, setForm]     = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState('')

  const loadUsers = () => {
    setLoading(true)
    adminService.getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = users.filter((u) => {
    const matchRole   = roleFilter === 'All Roles' || u.role === roleFilter
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  // ── Open modals ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm)
    setFormErr('')
    setModal('add')
  }

  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role, id: u.id })
    setFormErr('')
    setModal('edit')
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setFormErr('')
    if (!form.name.trim() || !form.email.trim()) {
      setFormErr('Name and email are required.')
      return
    }
    if (modal === 'add' && !form.password.trim()) {
      setFormErr('Password is required for new users.')
      return
    }

    setSaving(true)
    try {
      if (modal === 'add') {
        await adminService.createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          role: form.role,
        })
      } else {
        if (form.name.trim() !== users.find(u => u.id === form.id)?.name ||
            form.email.trim() !== users.find(u => u.id === form.id)?.email) {
          await adminService.updateUser(form.id, { name: form.name.trim(), email: form.email.trim() })
        }
        if (form.role !== users.find(u => u.id === form.id)?.role) {
          await adminService.changeRole(form.id, form.role)
        }
      }
      setModal(null)
      loadUsers()
    } catch (err) {
      setFormErr(err.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return
    try {
      await adminService.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) return <Spinner />
  if (error)   return <div style={{ padding: '2rem', color: '#ef4444' }}>Error: {error}</div>

  return (
    <div className="admin-users">

      {/* Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '14px', padding: '2rem',
            width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)'
          }}>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 800, color: 'var(--text)', fontSize: '1.1rem' }}>
              {modal === 'add' ? 'Add New User' : 'Edit User'}
            </h3>

            {formErr && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {formErr}
              </div>
            )}

            {[
              { label: 'Name',     key: 'name',     type: 'text',     placeholder: 'Full name' },
              { label: 'Email',    key: 'email',    type: 'email',    placeholder: 'email@example.com' },
              ...(modal === 'add' ? [{ label: 'Password', key: 'password', type: 'password', placeholder: 'Min 8 characters' }] : []),
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  placeholder={placeholder}
                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.4rem' }}>Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit' }}
              >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={{ padding: '0.55rem 1.2rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '0.55rem 1.2rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : modal === 'add' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="admin-users__header">
        <div>
          <h2 className="admin-users__title">Users</h2>
          <p className="admin-users__sub">Manage all students, instructors, and admins</p>
        </div>
        <button className="admin-users__add-btn" onClick={openAdd}>+ Add User</button>
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
              {r === 'All Roles' ? r : r.charAt(0) + r.slice(1).toLowerCase()}
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
              <th>Verified</th>
              <th>Courses</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6}><div className="admin-users__empty">No users found.</div></td></tr>
            ) : (
              filtered.map((u, i) => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-users__user-cell">
                      <div className="admin-users__avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                        {initials(u.name)}
                      </div>
                      <div>
                        <div className="admin-users__user-name">{u.name}</div>
                        <div className="admin-users__user-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge" style={{ background: roleStyle[u.role]?.bg, color: roleStyle[u.role]?.color }}>
                      {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td><span style={{ fontSize: '1rem' }}>{u.isEmailVerified ? '✅' : '⏳'}</span></td>
                  <td>{u.role === 'STUDENT' ? u._count?.enrollments ?? 0 : u._count?.coursesCreated ?? 0}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="admin-users__actions">
                      <button className="admin-users__action-btn" onClick={() => openEdit(u)}>Edit</button>
                      <button className="admin-users__action-btn admin-users__action-btn--danger" onClick={() => handleDelete(u.id)}>Remove</button>
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
