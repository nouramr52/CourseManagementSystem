import { useState } from 'react'
import './UploadMaterial.css'

const initialMaterials = [
  { id: 1, title: 'Introduction to SQL',          course: 'Database Systems',     type: 'PDF',  link: '',                              date: '2024-09-05' },
  { id: 2, title: 'ER Diagram Examples',           course: 'Database Systems',     type: 'PPT',  link: '',                              date: '2024-09-10' },
  { id: 3, title: 'Software Development Lifecycle',course: 'Software Engineering', type: 'PDF',  link: '',                              date: '2024-09-06' },
  { id: 4, title: 'UML Diagrams Lab Sheet',         course: 'Software Engineering', type: 'DOC',  link: '',                              date: '2024-09-12' },
  { id: 5, title: 'Arrays and Linked Lists',        course: 'Data Structures',      type: 'Link', link: 'https://visualgo.net/en/list',  date: '2024-09-07' },
]

const typeColors = {
  PDF:  { bg: '#fee2e2', color: '#dc2626' },
  PPT:  { bg: '#fef9c3', color: '#ca8a04' },
  DOC:  { bg: '#dbeafe', color: '#2563eb' },
  ZIP:  { bg: '#f3e8ff', color: '#7c3aed' },
  Link: { bg: '#ecfdf5', color: '#059669' },
}

const courses = ['Database Systems', 'Software Engineering', 'Data Structures', 'Operating Systems']
const emptyForm = { title: '', course: courses[0], type: 'PDF', link: '' }

export default function UploadMaterial() {
  const [materials, setMaterials]   = useState(initialMaterials)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [filterCourse, setFilter]   = useState('All')

  const handleSubmit = (e) => {
    e.preventDefault()
    setMaterials([...materials, { id: Date.now(), ...form, date: new Date().toISOString().slice(0, 10) }])
    setForm(emptyForm)
    setShowForm(false)
  }

  const handleDelete = (id) => setMaterials(materials.filter((m) => m.id !== id))

  const filtered = filterCourse === 'All' ? materials : materials.filter((m) => m.course === filterCourse)

  return (
    <div className="upload-material">
      {/* Header */}
      <div className="um__header">
        <div>
          <h2 className="um__title">Course Materials</h2>
          <p className="um__sub">Upload files or add links for your students</p>
        </div>
        <button className="um__add-btn" onClick={() => setShowForm(!showForm)}>
          + Upload Material
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="um-form">
          <div className="um-form__head">
            <h3>Add New Material</h3>
            <button className="um-form__close" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className="um-form__body">
            <div className="um-form__row">
              <div className="um-form__field um-form__field--full">
                <label>Material Title</label>
                <input required value={form.title} placeholder="e.g. Week 3 – Normalization"
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
            </div>
            <div className="um-form__row">
              <div className="um-form__field">
                <label>Course</label>
                <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
                  {courses.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="um-form__field">
                <label>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {['PDF', 'PPT', 'DOC', 'ZIP', 'Link'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {form.type === 'Link' ? (
              <div className="um-form__field um-form__field--full">
                <label>URL</label>
                <input required type="url" value={form.link} placeholder="https://…"
                  onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </div>
            ) : (
              <div className="um-form__drop">
                <span>📂</span>
                <p>Drag & drop your file here, or click to browse</p>
                <span className="um-form__drop-note">PDF, PPT, DOC, ZIP — max 50 MB</span>
              </div>
            )}

            <div className="um-form__actions">
              <button type="submit" className="um-form__submit">Upload</button>
              <button type="button" className="um-form__cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="um__tabs">
        {['All', ...courses].map((c) => (
          <button key={c}
            className={`um__tab ${filterCourse === c ? 'um__tab--active' : ''}`}
            onClick={() => setFilter(c)}
          >{c}</button>
        ))}
      </div>

      {/* Table */}
      <div className="um-table-wrap">
        <table className="um-table">
          <thead>
            <tr>
              <th>Material Title</th>
              <th>Course</th>
              <th>Type</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="5" className="um-table__empty">No materials found.</td></tr>
            ) : (
              filtered.map((m) => {
                const t = typeColors[m.type] || typeColors.PDF
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="um-title-cell">
                        <span className="um-type-badge" style={{ background: t.bg, color: t.color }}>{m.type}</span>
                        <span className="um-material-name">{m.title}</span>
                      </div>
                    </td>
                    <td><span className="um-course-tag">{m.course}</span></td>
                    <td><span className="um-type-text" style={{ color: t.color }}>{m.type}</span></td>
                    <td className="um-date">{m.date}</td>
                    <td>
                      <div className="um-actions">
                        {m.link
                          ? <a href={m.link} target="_blank" rel="noreferrer" className="um-btn um-btn--view">🔗 Open</a>
                          : <button className="um-btn um-btn--view">👁 View</button>
                        }
                        <button className="um-btn um-btn--delete" onClick={() => handleDelete(m.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
