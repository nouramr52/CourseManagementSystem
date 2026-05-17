/**
 * adminService.js — Admin API calls
 * Uses the axios instance which auto-attaches the JWT token.
 */
import api from '../api/axios'

const adminService = {
  // Dashboard & analytics
  getDashboard: ()           => api.get('/admin/dashboard').then(r => r.data),
  getAnalytics: ()           => api.get('/admin/analytics').then(r => r.data),

  // Users CRUD
  getAllUsers:  ()            => api.get('/admin/users').then(r => r.data),
  getUserById: (id)          => api.get(`/admin/users/${id}`).then(r => r.data),
  createUser:  (data)        => api.post('/admin/users', data).then(r => r.data),
  updateUser:  (id, data)    => api.patch(`/admin/users/${id}`, data).then(r => r.data),
  changeRole:  (id, role)    => api.patch(`/admin/users/${id}/role`, { role }).then(r => r.data),
  deleteUser:  (id)          => api.delete(`/admin/users/${id}`).then(r => r.data),

  // Courses CRUD
  getAllCourses:  ()          => api.get('/admin/courses').then(r => r.data),
  updateCourse:  (id, data)  => api.put(`/admin/courses/${id}`, data).then(r => r.data),
  deleteCourse:  (id)        => api.delete(`/admin/courses/${id}`).then(r => r.data),
}

export default adminService
