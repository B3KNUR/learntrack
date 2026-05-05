import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserEnrollments } from '../services/enrollmentService'
import { getCourseProgress } from '../services/lessonService'

function DashboardPage({ user }) {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadEnrollments() {
      setLoading(true)
      setErrorMessage('')

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await getUserEnrollments(user.id)

      if (error) {
        setErrorMessage(error.message)
      } else {
        const coursesWithProgress = await Promise.all(
          data.map(async (course) => {
            const progress = await getCourseProgress(user.id, course.id)

            return {
              ...course,
              progress,
            }
          }),
        )

        setEnrolledCourses(coursesWithProgress)
      }

      setLoading(false)
    }

    loadEnrollments()
  }, [user])

  return (
    <section className="page-card dashboard-page">
      <h1>My Learning Dashboard</h1>
      <p className="muted">
        Continue your enrolled courses and track lesson completion.
      </p>
      <p className="user-email">Logged in as: {user?.email ?? 'Unknown user'}</p>

      {loading && <p className="status-message">Loading your courses...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && !errorMessage && enrolledCourses.length === 0 && (
        <div className="empty-state">
          <h2>No enrolled courses yet</h2>
          <p>You are not enrolled in any courses yet.</p>
          <Link className="button" to="/courses">
            Browse courses
          </Link>
        </div>
      )}

      <div className="grid dashboard-grid">
        {enrolledCourses.map((course) => (
          <article className="card course-card" key={course.enrollmentId}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <span className="level-badge">{course.level}</span>
            <p className="progress-text">
              Progress: {course.progress.percentage}%
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${course.progress.percentage}%` }}
              />
            </div>
            <p className="progress-text">
              Completed lessons: {course.progress.completedLessons} /{' '}
              {course.progress.totalLessons}
            </p>
            <Link className="button button-secondary" to={`/courses/${course.id}`}>
              View course
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardPage
