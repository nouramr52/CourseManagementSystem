import { useState, useEffect, useRef } from 'react'
import { getMyCourses } from '../../../api/courseApi'
import { uploadFileMaterial, uploadLinkMaterial, getCourseMaterials, deleteMaterial, editMaterial } from '../../../api/materialApi'
import './UploadMaterial.css'

const typeColors = {
  PDF:  { bg: '#fee2e2', color: '#dc2626' },
  PPT:  { bg: '#fef9c3', color: '#ca8a04' },
  DOC:  { bg: '#dbeafe', color: '#2563eb' },
  ZIP:  { bg: '#f3e8ff', color: '#7c3aed' },
  LINK: { bg: '#ecfdf5', color: '#059669' },
}

// Detect material type from file extension
const detectType = (file) => {
  const ext = file.name.split('.').pop().toLowerCase()
  if (ext === 'pdf') return 'PDF'
  if (['ppt', 'pptx'].includes(ext)) return 'PPT'
  if (['doc', 'docx'].includes(ext)) return 'DOC'
  if (ext === 'zip') return 'ZIP'
  return 'PDF' // fallback
}

const emptyForm = { title: '', courseId: '', type: 'LINK', link: '' }

export default function UploadMaterial() {
  const [courses, setCourses]       = useState([])
  const [materials, setMaterials]   = useState([])
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filterCourse, setFilter]   = useState('All')
  const [dragging, setDragging]     = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [error, setError]           = useState('')
  const fileInputRef = useRef(null)
  const token = localStorage.getItem('token')

  // Edit state
  const [editingMaterial, setEditingMaterial] = useState(null) // the material being edited
  const [editForm, setEditForm]               = useState({ title: '', linkUrl: '' })
  const [editSaving, setEditSaving]           = useState(false)

  const openEdit = (m) => {
    setEditingMaterial(m)
    setEditForm({ title: m.title, linkUrl: m.type === 'LINK' ? m.url : '' })
    setError('')
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    setEditSaving(true)
    setError('')
    try {
      const payload = { title: editForm.title }
      if (editingMaterial.type === 'LINK') payload.linkUrl = editForm.linkUrl
      const res = await editMaterial(editingMaterial.id, payload, token)
      setMaterials(materials.map(m => m.id === editingMaterial.id ? { ...m, ...res.data } : m))
      setEditingMaterial(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Edit failed')
    } finally {
      setEditSaving(false)
    }
  }

  // Load instructor's courses
  useEffect(() => {
    getMyCourses()
      .then(res => {
        setCourses(res.data)
        if (res.data.length > 0) {
          setForm(f => ({ ...f, courseId: String(res.data[0].id) }))
        }
      })
      .catch(() => setError('Failed to load courses'))
  }, [])

  // Load materials whenever courses load
  useEffect(() => {
    if (courses.length === 0) return
    loadAllMaterials(courses)
  }, [courses])

  const loadAllMaterials = async (courseList) => {
    try {
      const results = await Promise.all(
        courseList.map(c => getCourseMaterials(c.id, token).then(r => r.data))
      )
      setMaterials(results.flat())
    } catch {
      setError('Failed to load materials')
    }
  }

  // ── Drag & Drop handlers ──────────────────────────────────────────────────
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) { setSelectedFile(file); setForm(f => ({ ...f, type: detectType(file) })) }
  }
  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) { setSelectedFile(file); setForm(f => ({ ...f, type: detectType(file) })) }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.courseId) { setError('Please select a course'); return }

    setUploading(true)
    try {
      if (form.type === 'LINK') {
        await uploadLinkMaterial(
          { title: form.title, courseId: form.courseId, linkUrl: form.link },
          token
        )
      } else {
        if (!selectedFile) { setError('Please select a file'); setUploading(false); return }
        const fd = new FormData()
        fd.append('title', form.title)
        fd.append('courseId', form.courseId)
        fd.append('file', selectedFile)
        await uploadFileMaterial(fd, token)
      }

      // Reload materials and reset form
      await loadAllMaterials(courses)
      setForm({ title: '', courseId: String(courses[0]?.id || ''), type: 'PDF', link: '' })
      setSelectedFile(null)
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return
    try {
      await deleteMaterial(id, token)
      setMaterials(materials.filter(m => m.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleDownload = async (url, title) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = title
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(url, '_blank') // fallback
    }
  }

  const filtered = filterCourse === 'All'
    ? materials
    : materials.filter(m => m.courseId === Number(filterCourse))

  const getCourseTitle = (courseId) =>
    courses.find(c => c.id === courseId)?.title || '—'

  return (
    <div className="upload-material">
      {/* Header */}
      <div className="um__header">
        <div>
          <h2 className="um__title">Course Materials</h2>
          <p className="um__sub">Upload files or add links for your students</p>
        </div>
        <button className="um__add-btn" onClick={() => { setShowForm(!showForm); setError('') }}>
          + Upload Material
        </button>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}

      {courses.length === 0 && !showForm && (
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1rem' }}>
          You have no courses yet. Go to <strong>My Courses</strong> and add one first.
        </p>
      )}

      {/* Form */}
      {showForm && (
        <div className="um-form">
          <div className="um-form__head">
            <h3>Add New Material</h3>
            <button className="um-form__close" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className="um-form__body">
            {/* Title */}
            <div className="um-form__row">
              <div className="um-form__field um-form__field--full">
                <label>Material Title</label>
                <input required value={form.title} placeholder="e.g. Week 3 – Normalization"
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
            </div>

            {/* Course + Type */}
            <div className="um-form__row">
              <div className="um-form__field">
                <label>Course</label>
                <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
                  {courses.length === 0
                    ? <option value="">No courses available</option>
                    : courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)
                  }
                </select>
              </div>
              <div className="um-form__field">
                <label>Material Type</label>
                <select
                  value={selectedFile ? 'FILE' : form.type === 'LINK' ? 'LINK' : 'FILE'}
                  onChange={(e) => {
                    if (selectedFile) return // locked once file is chosen
                    if (e.target.value === 'LINK') {
                      setForm({ ...form, type: 'LINK', link: '' })
                    } else {
                      setForm({ ...form, type: 'PDF', link: '' })
                    }
                  }}
                  disabled={!!selectedFile}
                  style={selectedFile ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                  <option value="LINK">🔗 Link</option>
                  <option value="FILE">📁 File (auto-detected)</option>
                </select>
                {selectedFile && (
                  <span style={{ fontSize: '0.72rem', color: '#059669', marginTop: '0.2rem' }}>
                    Detected: <strong>{form.type}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Link input or file drop zone */}
            {form.type === 'LINK' && !selectedFile ? (
              <div className="um-form__field um-form__field--full">
                <label>URL</label>
                <input required type="url" value={form.link} placeholder="https://…"
                  onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.zip"
                  style={{ display: 'none' }}
                  onChange={handleFileInput}
                />
                <div
                  className={`um-form__drop ${dragging ? 'um-form__drop--active' : ''} ${selectedFile ? 'um-form__drop--has-file' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <>
                      <span>✅</span>
                      <p><strong>{selectedFile.name}</strong></p>
                      <span className="um-form__drop-note">
                        Detected type: <strong>{form.type}</strong> &nbsp;·&nbsp;
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB — click to change
                      </span>
                    </>
                  ) : (
                    <>
                      <span>📂</span>
                      <p>Drag & drop your file here, or <strong>click to browse</strong></p>
                      <span className="um-form__drop-note">PDF, PPT, DOC, ZIP — max 50 MB · type auto-detected</span>
                    </>
                  )}
                </div>
              </>
            )}

            <div className="um-form__actions">
              <button type="submit" className="um-form__submit" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
              <button type="button" className="um-form__cancel" onClick={() => { setShowForm(false); setSelectedFile(null) }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingMaterial && (
        <div className="um-form">
          <div className="um-form__head">
            <h3>Edit Material</h3>
            <button className="um-form__close" onClick={() => setEditingMaterial(null)}>✕</button>
          </div>
          <form onSubmit={handleEditSave} className="um-form__body">
            <div className="um-form__field um-form__field--full">
              <label>Material Title</label>
              <input required value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            {editingMaterial.type === 'LINK' && (
              <div className="um-form__field um-form__field--full">
                <label>URL</label>
                <input required type="url" value={editForm.linkUrl}
                  onChange={(e) => setEditForm({ ...editForm, linkUrl: e.target.value })} />
              </div>
            )}
            {editingMaterial.type !== 'LINK' && (
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                📎 File cannot be replaced — only the title can be edited.
              </p>
            )}
            <div className="um-form__actions">
              <button type="submit" className="um-form__submit" disabled={editSaving}>
                {editSaving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" className="um-form__cancel" onClick={() => setEditingMaterial(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="um__tabs">
        <button
          className={`um__tab ${filterCourse === 'All' ? 'um__tab--active' : ''}`}
          onClick={() => setFilter('All')}
        >All</button>
        {courses.map(c => (
          <button key={c.id}
            className={`um__tab ${filterCourse === String(c.id) ? 'um__tab--active' : ''}`}
            onClick={() => setFilter(String(c.id))}
          >{c.title}</button>
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
            ) : filtered.map((m) => {
              const t = typeColors[m.type] || typeColors.PDF
              return (
                <tr key={m.id}>
                  <td>
                    <div className="um-title-cell">
                      <span className="um-type-badge" style={{ background: t.bg, color: t.color }}>{m.type}</span>
                      <span className="um-material-name">{m.title}</span>
                    </div>
                  </td>
                  <td><span className="um-course-tag">{getCourseTitle(m.courseId)}</span></td>
                  <td><span className="um-type-text" style={{ color: t.color }}>{m.type}</span></td>
                  <td className="um-date">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="um-actions">
                      {m.type === 'LINK' ? (
                        <a href={m.url} target="_blank" rel="noreferrer" className="um-btn um-btn--view">
                          🔗 Open
                        </a>
                      ) : (
                        <button className="um-btn um-btn--view" onClick={() => handleDownload(m.url, m.title)}>
                          ⬇ Download
                        </button>
                      )}
                      <button className="um-btn um-btn--edit" onClick={() => openEdit(m)}>✏️ Edit</button>
                      <button className="um-btn um-btn--delete" onClick={() => handleDelete(m.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
