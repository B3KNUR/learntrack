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
    <section className="page-card">
      <h1>Dashboard</h1>
      <p>Your learning progress and enrolled courses will appear here.</p>
      <p className="user-email">Logged in as: {user?.email ?? 'Unknown user'}</p>

      {loading && <p className="status-message">Loading your courses...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && !errorMessage && enrolledCourses.length === 0 && (
        <p className="status-message">
          You are not enrolled in any courses yet.{' '}
          <Link to="/courses">Browse courses</Link>
        </p>
      )}

      <div className="course-grid">
        {enrolledCourses.map((course) => (
          <article className="course-card" key={course.enrollmentId}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <span className="level-badge">{course.level}</span>
            <p className="progress-text">
              Progress: {course.progress.percentage}%
            </p>
            <p className="progress-text">
              Completed lessons: {course.progress.completedLessons} /{' '}
              {course.progress.totalLessons}
            </p>
            <Link className="text-link" to={`/courses/${course.id}`}>
              View course
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardPage
