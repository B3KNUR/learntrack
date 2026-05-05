import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile } from '../services/profileService'
import { getUserStats } from '../services/statsService'

function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({
    enrolledCoursesCount: 0,
    completedLessonsCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setErrorMessage('')

      if (!user) {
        setLoading(false)
        return
      }

      const { data: profileData, error: profileError } = await getProfile(
        user.id,
      )

      if (profileError) {
        setErrorMessage(profileError.message)
      } else {
        setProfile(profileData)
      }

      const { data: statsData, error: statsError } = await getUserStats(user.id)

      if (statsError) {
        setErrorMessage(statsError.message)
      } else {
        setStats(statsData)
      }

      setLoading(false)
    }

    loadProfile()
  }, [user])

  const email = profile?.email || user?.email || 'Unknown email'
  const role = profile?.role || 'student'
  const accountType = role === 'admin' ? 'Administrator' : 'Student'

  return (
    <section className="page-card profile-page">
      <h1>Profile</h1>
      <p className="muted">Your LearnTrack account information and activity.</p>

      {loading && <p className="status-message">Loading profile...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && (
        <>
          <div className="grid profile-grid">
            <article className="card">
              <h2>Email</h2>
              <p>{email}</p>
            </article>

            <article className="card">
              <h2>Role</h2>
              <p>{role}</p>
            </article>

            <article className="card">
              <h2>Account type</h2>
              <p>{accountType}</p>
            </article>

            <article className="card">
              <h2>Enrolled courses</h2>
              <p>{stats.enrolledCoursesCount}</p>
            </article>

            <article className="card">
              <h2>Completed lessons</h2>
              <p>{stats.completedLessonsCount}</p>
            </article>
          </div>

          <div className="hero-actions">
            <Link className="button" to="/courses">
              Browse courses
            </Link>
            <Link className="button button-secondary" to="/dashboard">
              Dashboard
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

export default ProfilePage
