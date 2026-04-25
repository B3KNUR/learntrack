import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getCourseById,
  getLessonsByCourseId,
} from '../services/courseService'

function groupLessonsByModule(lessons) {
  return lessons.reduce((modules, lesson) => {
    const moduleTitle = lesson.module_title || 'Course Lessons'

    if (!modules[moduleTitle]) {
      modules[moduleTitle] = []
    }

    modules[moduleTitle].push(lesson)
    return modules
  }, {})
}

function CourseDetailsPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadCourseDetails() {
      const { data: courseData, error: courseError } =
        await getCourseById(courseId)

      if (courseError) {
        setErrorMessage(courseError.message)
        setLoading(false)
        return
      }

      const { data: lessonData, error: lessonError } =
        await getLessonsByCourseId(courseId)

      if (lessonError) {
        setErrorMessage(lessonError.message)
      } else {
        setCourse(courseData)
        setLessons(lessonData)
      }

      setLoading(false)
    }

    loadCourseDetails()
  }, [courseId])

  const lessonsByModule = groupLessonsByModule(lessons)

  return (
    <section className="page-card">
      {loading && <p className="status-message">Loading course...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && course && (
        <>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <span className="level-badge">{course.level}</span>

          <div className="modules">
            {Object.entries(lessonsByModule).map(([moduleTitle, moduleLessons]) => (
              <section className="module-section" key={moduleTitle}>
                <h2>{moduleTitle}</h2>

                <ul className="lesson-list">
                  {moduleLessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link to={`/lessons/${lesson.id}`}>{lesson.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {lessons.length === 0 && (
            <p className="status-message">No lessons found for this course.</p>
          )}
        </>
      )}
    </section>
  )
}

export default CourseDetailsPage
