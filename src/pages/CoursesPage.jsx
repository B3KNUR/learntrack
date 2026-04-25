import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseService'

function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadCourses() {
      const { data, error } = await getCourses()

      if (error) {
        setErrorMessage(error.message)
      } else {
        setCourses(data)
      }

      setLoading(false)
    }

    loadCourses()
  }, [])

  return (
    <section className="page-card">
      <h1>Courses</h1>
      <p>Browse available courses and choose what you want to learn.</p>

      {loading && <p className="status-message">Loading courses...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && !errorMessage && courses.length === 0 && (
        <p className="status-message">No courses found.</p>
      )}

      <div className="course-grid">
        {courses.map((course) => (
          <article className="course-card" key={course.id}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <span className="level-badge">{course.level}</span>
            <Link className="text-link" to={`/courses/${course.id}`}>
              View course
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CoursesPage
