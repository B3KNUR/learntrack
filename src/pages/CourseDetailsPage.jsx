import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getCourseById,
  getLessonsByCourseId,
} from '../services/courseService'
import {
  enrollInCourse,
  getEnrollment,
} from '../services/enrollmentService'
import {
  getCompletedLessons,
  getCourseProgress,
} from '../services/lessonService'

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

function CourseDetailsPage({ user }) {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [enrollment, setEnrollment] = useState(null)
  const [completedLessonIds, setCompletedLessonIds] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrollmentLoading, setEnrollmentLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [enrollmentError, setEnrollmentError] = useState('')
  const [progressError, setProgressError] = useState('')

  useEffect(() => {
    async function loadCourseDetails() {
      setLoading(true)
      setErrorMessage('')

      const { data: courseData, error: courseError } =
        await getCourseById(courseId)

      if (courseError) {
        setErrorMessage(courseError.message)
        setLoading(false)
        return
      }

      setCourse(courseData)

      const { data: lessonData, error: lessonError } =
        await getLessonsByCourseId(courseId)

      if (lessonError) {
        setErrorMessage(lessonError.message)
      } else {
        setLessons(lessonData)
      }

      setLoading(false)
    }

    loadCourseDetails()
  }, [courseId])

  useEffect(() => {
    async function loadEnrollment() {
      setEnrollment(null)
      setEnrollmentError('')

      if (!user) {
        return
      }

      setEnrollmentLoading(true)

      const { data, error } = await getEnrollment(user.id, courseId)

      if (error) {
        setEnrollmentError(error.message)
      } else {
        setEnrollment(data)
      }

      setEnrollmentLoading(false)
    }

    loadEnrollment()
  }, [courseId, user])

  useEffect(() => {
    async function loadProgress() {
      setProgress(null)
      setCompletedLessonIds([])
      setProgressError('')

      if (!user) {
        return
      }

      const courseProgress = await getCourseProgress(user.id, courseId)

      if (courseProgress.error) {
        setProgressError(courseProgress.error.message)
        return
      }

      setProgress(courseProgress)

      const { data, error } = await getCompletedLessons(user.id)

      if (error) {
        setProgressError(error.message)
      } else {
        setCompletedLessonIds(data.map((row) => row.lesson_id))
      }
    }

    loadProgress()
  }, [courseId, user])

  async function handleEnroll() {
    setEnrollmentError('')
    setEnrollmentLoading(true)

    const { data, error } = await enrollInCourse(user.id, courseId)

    if (error) {
      setEnrollmentError(error.message)
    } else {
      setEnrollment(data)
    }

    setEnrollmentLoading(false)
  }

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

          <div className="enrollment-box">
            {!user && (
              <p>
                Please log in to enroll in this course.{' '}
                <Link to="/login">Login</Link>
              </p>
            )}

            {user && enrollmentLoading && (
              <p className="status-message">Checking enrollment...</p>
            )}

            {user && !enrollmentLoading && enrollment && (
              <p className="success-message">Already enrolled</p>
            )}

            {user && !enrollmentLoading && !enrollment && (
              <button type="button" onClick={handleEnroll}>
                Enroll in course
              </button>
            )}

            {enrollmentError && (
              <p className="error-message">{enrollmentError}</p>
            )}
          </div>

          {user && progress && (
            <div className="progress-box">
              <p>Progress: {progress.percentage}%</p>
              <p>
                Completed lessons: {progress.completedLessons} /{' '}
                {progress.totalLessons}
              </p>
            </div>
          )}

          {progressError && <p className="error-message">{progressError}</p>}

          <div className="modules">
            {Object.entries(lessonsByModule).map(([moduleTitle, moduleLessons]) => (
              <section className="module-section" key={moduleTitle}>
                <h2>{moduleTitle}</h2>

                <ul className="lesson-list">
                  {moduleLessons.map((lesson) => (
                    <li key={lesson.id}>
                      {completedLessonIds.includes(lesson.id) && (
                        <span className="completed-indicator">✓</span>
                      )}
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
