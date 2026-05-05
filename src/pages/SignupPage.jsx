import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signUp } from '../services/authService'

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')  
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {          
      setErrorMessage('Passwords do not match.') 
      return                                     
    }

    setLoading(true)

    const { error } = await signUp(email, password)

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setEmail('')
    setPassword('')
    setConfirmPassword('')  // новое
    setSuccessMessage('Account created successfully. You are now logged in.')
  }

  return (
    <section className="page-card">
      <h1>Sign Up</h1>
      <p>Create a student or teacher account for LearnTrack.</p>

      <form className="auth-form" onSubmit={handleSignup}>
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          minLength="8"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <label htmlFor="signup-confirm-password">Confirm Password</label>
        <input
          id="signup-confirm-password"
          type="password"
          minLength="8"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="page-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  )
}

export default SignupPage