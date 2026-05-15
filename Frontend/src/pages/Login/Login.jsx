import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Login.css'
import { loginUser, loginWithGoogle } from '../../api/authApi'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [loginAsStudent, setLoginAsStudent] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (location.state?.role === 'student') {
      setLoginAsStudent(true)
    }
  }, [location])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const res = await loginUser({ email: formData.email, password: formData.password })
      const { user, token } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Redirect to home — LoggedInHome handles role-based content
      const role = user.role?.toUpperCase()
      if (role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setApiError('')
    try {
      await loginWithGoogle()
      // loginWithGoogle redirects the browser — no further action needed here
    } catch (err) {
      setApiError(err.message || 'Google sign-in failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__blob auth-page__blob--1" aria-hidden="true" />
      <div className="auth-page__blob auth-page__blob--2" aria-hidden="true" />
      <div className="auth-page__blob auth-page__blob--3" aria-hidden="true" />

      <div className="auth-page__container">
        {/* Left side - Branding */}
        <div className="auth-page__branding">
          <Link to="/" className="auth-page__logo">
            <div className="auth-page__logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="auth-page__logo-text">Course Management</span>
          </Link>

          <h1 className="auth-page__title">
            Welcome Back!
            <span className="auth-page__title-highlight"> Sign in to continue</span>
          </h1>

          <p className="auth-page__subtitle">
            Access your courses, schedules, and materials. Manage everything in one place.
          </p>

          <div className="auth-page__features">
            {[
              { icon: '📚', label: 'Access Courses', color: '#4f46e5' },
              { icon: '📅', label: 'View Schedule', color: '#06b6d4' },
              { icon: '📝', label: 'Track Progress', color: '#10b981' },
            ].map((feature) => (
              <div key={feature.label} className="auth-page__feature">
                <span className="auth-page__feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </span>
                <span className="auth-page__feature-label">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-page__form-wrapper">
          <div className="auth-page__form-container">
            <div className="auth-page__form-header">
              <h2 className="auth-page__form-title">
                {loginAsStudent ? 'Student Login' : 'Sign In'}
              </h2>
              <p className="auth-page__form-subtitle">
                {loginAsStudent ? (
                  <>Login with your student account</>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-page__link">Create one</Link>
                  </>
                )}
              </p>
            </div>

            {apiError && (
              <div className="auth-page__alert auth-page__alert--error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-page__form" noValidate>
              <div className="auth-page__form-group">
                <label htmlFor="email" className="auth-page__label">
                  Email Address
                </label>
                <div className="auth-page__input-wrapper">
                  <svg className="auth-page__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`auth-page__input ${errors.email ? 'auth-page__input--error' : ''}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="auth-page__error">{errors.email}</span>
                )}
              </div>

              <div className="auth-page__form-group">
                <label htmlFor="password" className="auth-page__label">
                  Password
                </label>
                <div className="auth-page__input-wrapper">
                  <svg className="auth-page__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`auth-page__input ${errors.password ? 'auth-page__input--error' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-page__password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="auth-page__error">{errors.password}</span>
                )}
              </div>

              <div className="auth-page__form-footer">
                <label className="auth-page__checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="auth-page__link">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="auth-page__submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-page__spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                    </svg>
                  </>
                )}
              </button>

              <div className="auth-page__divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="auth-page__google-btn"
                onClick={handleGoogleLogin}
                disabled={googleLoading || isLoading}
              >
                {googleLoading ? (
                  <>
                    <span className="auth-page__spinner auth-page__spinner--dark" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
