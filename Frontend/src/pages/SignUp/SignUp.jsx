import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Login/Login.css'
import { registerUser } from "../../api/authApi";

export default function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // ✅ Save real token from backend
      localStorage.setItem("token", res.data.token);

      // (optional) save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Redirect
      navigate("/dashboard");

    } catch (err) {
      setApiError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            Join Our Platform
            <span className="auth-page__title-highlight"> Start Learning Today</span>
          </h1>

          <p className="auth-page__subtitle">
            Create your account and get access to courses, schedules, and materials tailored to your role.
          </p>

          <div className="auth-page__features">
            {[
              { icon: '🎓', label: 'Student Portal', color: '#4f46e5' },
              { icon: '👨‍🏫', label: 'Instructor Tools', color: '#06b6d4' },
              { icon: '🛡️', label: 'Admin Dashboard', color: '#8b5cf6' },
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
              <h2 className="auth-page__form-title">Create Account</h2>
              <p className="auth-page__form-subtitle">
                Already have an account?{' '}
                <Link to="/login" className="auth-page__link">Sign in</Link>
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
                <label htmlFor="name" className="auth-page__label">
                  Full Name
                </label>
                <div className="auth-page__input-wrapper">
                  <svg className="auth-page__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`auth-page__input ${errors.name ? 'auth-page__input--error' : ''}`}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <span className="auth-page__error">{errors.name}</span>
                )}
              </div>

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
                <label htmlFor="role" className="auth-page__label">
                  Select Your Role
                </label>
                <div className="auth-page__input-wrapper">
                  <svg className="auth-page__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`auth-page__input ${errors.role ? 'auth-page__input--error' : ''}`}
                  >
                    <option value="student">🎓 Student</option>
                    <option value="instructor">👨‍🏫 Instructor</option>
                    <option value="admin">🛡️ Administrator</option>
                  </select>
                </div>
                {errors.role && (
                  <span className="auth-page__error">{errors.role}</span>
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
                    placeholder="Create a strong password"
                    autoComplete="new-password"
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

              <div className="auth-page__form-group">
                <label htmlFor="confirmPassword" className="auth-page__label">
                  Confirm Password
                </label>
                <div className="auth-page__input-wrapper">
                  <svg className="auth-page__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`auth-page__input ${errors.confirmPassword ? 'auth-page__input--error' : ''}`}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-page__password-toggle"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <span className="auth-page__error">{errors.confirmPassword}</span>
                )}
              </div>

              <label className="auth-page__checkbox" style={{ marginTop: '0.5rem' }}>
                <input type="checkbox" required />
                <span style={{ fontSize: '0.85rem' }}>
                  I agree to the{' '}
                  <Link to="/terms" className="auth-page__link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="auth-page__link">Privacy Policy</Link>
                </span>
              </label>

              <button
                type="submit"
                className="auth-page__submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-page__spinner" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" />
                    </svg>
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
