import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Login/Login.css'
import './CompleteProfile.css'
import { completeProfile } from '../../api/authApi'

export default function CompleteProfile() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError('Please select a role to continue.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await completeProfile(user.id, selectedRole)
      const { user: updatedUser, token } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      const role = updatedUser.role?.toUpperCase()
      if (role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__blob auth-page__blob--1" aria-hidden="true" />
      <div className="auth-page__blob auth-page__blob--2" aria-hidden="true" />
      <div className="auth-page__blob auth-page__blob--3" aria-hidden="true" />

      <div className="complete-profile__container">
        <div className="auth-page__form-container">
          <div className="auth-page__form-header">
            <h2 className="auth-page__form-title">One last step</h2>
            <p className="auth-page__form-subtitle">
              Hey {user.name?.split(' ')[0] || 'there'}, how will you be using the platform?
            </p>
          </div>

          {error && (
            <div className="auth-page__alert auth-page__alert--error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="complete-profile__roles">
            <button
              type="button"
              className={`complete-profile__role-card ${selectedRole === 'STUDENT' ? 'complete-profile__role-card--active' : ''}`}
              onClick={() => setSelectedRole('STUDENT')}
            >
              <span className="complete-profile__role-icon">🎓</span>
              <span className="complete-profile__role-title">Student</span>
              <span className="complete-profile__role-desc">Browse and enroll in courses</span>
            </button>

            <button
              type="button"
              className={`complete-profile__role-card ${selectedRole === 'INSTRUCTOR' ? 'complete-profile__role-card--active' : ''}`}
              onClick={() => setSelectedRole('INSTRUCTOR')}
            >
              <span className="complete-profile__role-icon">👨‍🏫</span>
              <span className="complete-profile__role-title">Instructor</span>
              <span className="complete-profile__role-desc">Create and manage courses</span>
            </button>
          </div>

          <button
            className="auth-page__submit"
            onClick={handleSubmit}
            disabled={isLoading || !selectedRole}
          >
            {isLoading ? (
              <>
                <span className="auth-page__spinner" />
                Setting up your account...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
