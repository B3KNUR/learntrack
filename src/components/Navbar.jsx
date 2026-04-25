import { Link, NavLink, useNavigate } from 'react-router-dom'
import { signOut } from '../services/authService'

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link className="site-logo" to="/">
        LearnTrack
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        {!user && <NavLink to="/login">Login</NavLink>}
      </nav>

      {user && (
        <div className="user-menu">
          <span>{user.email}</span>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  )
}

export default Navbar
