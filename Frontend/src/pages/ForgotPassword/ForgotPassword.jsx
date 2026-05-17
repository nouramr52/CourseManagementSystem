import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Login/Login.css'
import '../VerifyEmail/VerifyEmail.css'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  })

  const validatePassword = (password) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    })
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setNewPassword(value)
    validatePassword(value)
    if (error) setError('')
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email })
      setSuccess(res.data.message)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }

    if (error) setError('')
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)

    const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    document.getElementById(`otp-${focusIndex}`)?.focus()
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const res = await axios.post(`${API_URL}/auth/verify-reset-otp`, {
        email,
        otp: otpCode,
      })
      setSuccess(res.data.message)
      setOtpVerified(true)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!passwordValidation.hasUpperCase || !passwordValidation.hasLowerCase || !passwordValidation.hasNumber) {
      setError('Password must meet all requirements')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const otpCode = otp.join('')
    setIsLoading(true)
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        otp: otpCode,
        newPassword,
      })
      setSuccess(res.data.message)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email })
      setSuccess('New OTP sent to your email')
      setOtp(['', '', '', '', '', ''])
      setOtpVerified(false)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
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
            Reset Your Password
            <span className="auth-page__title-highlight"> Secure & Simple</span>
          </h1>

          <p className="auth-page__subtitle">
            {step === 1 
              ? "Enter your email address and we'll send you an OTP to reset your password."
              : step === 2
              ? "Enter the OTP sent to your email to verify your identity."
              : "Create a new password for your account."}
          </p>

          <div className="auth-page__features">
            {[
              { icon: '🔒', label: 'Secure Process', color: '#4f46e5' },
              { icon: '📧', label: 'Email Verification', color: '#06b6d4' },
              { icon: '✨', label: 'Quick Reset', color: '#10b981' },
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
                {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
              </h2>
              <p className="auth-page__form-subtitle">
                {step === 1 ? (
                  <>
                    Remember your password?{' '}
                    <Link to="/login" className="auth-page__link">Sign in</Link>
                  </>
                ) : step === 2 ? (
                  <>Step 2 of 3: Verify your identity</>
                ) : (
                  <>Step 3 of 3: Create new password</>
                )}
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

            {success && (
              <div className="auth-page__alert auth-page__alert--success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {success}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleEmailSubmit} className="auth-page__form" noValidate>
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
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError('')
                      }}
                      className="auth-page__input"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-page__submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="auth-page__spinner" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : step === 2 ? (
              <form onSubmit={handleVerifyOTP} className="auth-page__form" noValidate>
                <div className="auth-page__form-group">
                  <label className="auth-page__label">
                    Enter OTP sent to {email}
                  </label>
                  <div className="otp-inputs">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className="otp-input"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="auth-page__link"
                    style={{ marginTop: '10px', display: 'block', textAlign: 'center' }}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  className="auth-page__submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="auth-page__spinner" />
                      Verifying OTP...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setOtp(['', '', '', '', '', ''])
                    setError('')
                    setSuccess('')
                  }}
                  className="auth-page__link"
                  style={{ marginTop: '15px', display: 'block', textAlign: 'center' }}
                  disabled={isLoading}
                >
                  ← Back to email
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="auth-page__form" noValidate>
                <div className="auth-page__form-group">
                  <label htmlFor="newPassword" className="auth-page__label">
                    New Password
                  </label>
                  <div className="auth-page__input-wrapper">
                    <svg className="auth-page__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      className="auth-page__input"
                      placeholder="Enter new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-page__password-toggle"
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
                  {newPassword && (
                    <div className="password-validation">
                      <div className={`validation-item ${passwordValidation.minLength ? 'valid' : ''}`}>
                        {passwordValidation.minLength ? '✓' : '○'} At least 8 characters
                      </div>
                      <div className={`validation-item ${passwordValidation.hasUpperCase ? 'valid' : ''}`}>
                        {passwordValidation.hasUpperCase ? '✓' : '○'} One uppercase letter
                      </div>
                      <div className={`validation-item ${passwordValidation.hasLowerCase ? 'valid' : ''}`}>
                        {passwordValidation.hasLowerCase ? '✓' : '○'} One lowercase letter
                      </div>
                      <div className={`validation-item ${passwordValidation.hasNumber ? 'valid' : ''}`}>
                        {passwordValidation.hasNumber ? '✓' : '○'} One number
                      </div>
                    </div>
                  )}
                </div>

                <div className="auth-page__form-group">
                  <label htmlFor="confirmPassword" className="auth-page__label">
                    Confirm New Password
                  </label>
                  <div className="auth-page__input-wrapper">
                    <svg className="auth-page__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (error) setError('')
                      }}
                      onPaste={(e) => e.preventDefault()}
                      className="auth-page__input"
                      placeholder="Confirm new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="auth-page__password-toggle"
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
                </div>

                <button
                  type="submit"
                  className="auth-page__submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="auth-page__spinner" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(2)
                    setNewPassword('')
                    setConfirmPassword('')
                    setError('')
                    setSuccess('')
                  }}
                  className="auth-page__link"
                  style={{ marginTop: '15px', display: 'block', textAlign: 'center' }}
                  disabled={isLoading}
                >
                  ← Back to OTP
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
