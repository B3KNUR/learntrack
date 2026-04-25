import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../services/authService'

function LoginPage({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    setErrorMessage('')
    setLoading(true)

    const { data, error } = await signIn(email, password)

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setUser(data.user)
    navigate('/dashboard')
  }

  return (
    <section className="page-card">
      <h1>Login</h1>
      <p>Sign in to continue learning with LearnTrack.</p>

      <form className="auth-form" onSubmit={handleLogin}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="page-link">
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
    </section>
  )
}

export default LoginPage
