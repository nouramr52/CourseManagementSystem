import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../Login/Login.css'
import './VerifyEmail.css'

const API_URL = 'http://localhost:5000/api'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const inputRefs = useRef([])

  const email = location.state?.email
  const name = location.state?.name
  const token = location.state?.token
  const user = location.state?.user
  const message = location.state?.message

  useEffect(() => {
    if (!email) {
      navigate('/signup')
    }
    // Show message if provided
    if (message) {
      setSuccess(message)
      setTimeout(() => setSuccess(''), 5000) // Clear after 5 seconds
    }
  }, [email, navigate, message])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take last character
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed')
      }

      setSuccess('Email verified successfully!')
      
      // Save token and user to localStorage
      if (token && user) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify({ ...user, isEmailVerified: true }))
      }

      // Redirect based on role
      setTimeout(() => {
        const role = user?.role?.toUpperCase()
        if (role === 'ADMIN') {
          navigate('/admin/dashboard')
        } else if (role === 'INSTRUCTOR') {
          navigate('/instructor/dashboard')
        } else {
          navigate('/dashboard')
        }
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP')
      }

      setSuccess('New OTP sent to your email!')
      setResendTimer(60)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err.message)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__blob auth-page__blob--1" aria-hidden="true" />
      <div className="auth-page__blob auth-page__blob--2" aria-hidden="true" />
      <div className="auth-page__blob auth-page__blob--3" aria-hidden="true" />

      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className="verify-email-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          <h1 className="verify-email-title">Verify Your Email</h1>
          <p className="verify-email-subtitle">
            We've sent a 6-digit code to<br />
            <strong>{email}</strong>
          </p>

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

          <form onSubmit={handleSubmit} className="verify-email-form">
            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              className="auth-page__submit"
              disabled={isLoading || otp.join('').length !== 6}
            >
              {isLoading ? (
                <>
                  <span className="auth-page__spinner" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="verify-email-footer">
            <p>Didn't receive the code?</p>
            {resendTimer > 0 ? (
              <p className="resend-timer">Resend in {resendTimer}s</p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="resend-button"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
