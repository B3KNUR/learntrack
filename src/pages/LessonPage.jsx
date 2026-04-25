import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AIAssistant from '../components/AIAssistant'
import {
  getLessonById,
  isLessonCompleted,
  markLessonCompleted,
  unmarkLessonCompleted,
} from '../services/lessonService'

function LessonPage({ user }) {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completionLoading, setCompletionLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [completionError, setCompletionError] = useState('')

  useEffect(() => {
    async function loadLesson() {
      setLoading(true)
      setErrorMessage('')

      const { data, error } = await getLessonById(lessonId)

      if (error) {
        setErrorMessage(error.message)
      } else {
        setLesson(data)
      }

      setLoading(false)
    }

    loadLesson()
  }, [lessonId])

  useEffect(() => {
    async function loadCompletion() {
      setCompleted(false)
      setCompletionError('')

      if (!user) {
        return
      }

      setCompletionLoading(true)

      const { data, error } = await isLessonCompleted(user.id, lessonId)

      if (error) {
        setCompletionError(error.message)
      } else {
        setCompleted(data)
      }

      setCompletionLoading(false)
    }

    loadCompletion()
  }, [lessonId, user])

  async function handleMarkCompleted() {
    setCompletionError('')
    setCompletionLoading(true)

    const { error } = await markLessonCompleted(user.id, lessonId)

    if (error) {
      setCompletionError(error.message)
    } else {
      setCompleted(true)
    }

    setCompletionLoading(false)
  }

  async function handleMarkNotCompleted() {
    setCompletionError('')
    setCompletionLoading(true)

    const { error } = await unmarkLessonCompleted(user.id, lessonId)

    if (error) {
      setCompletionError(error.message)
    } else {
      setCompleted(false)
    }

    setCompletionLoading(false)
  }

  return (
    <section className="page-card">
      {loading && <p className="status-message">Loading lesson...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && lesson && (
        <div className="lesson-content">
          <Link className="text-link" to={`/courses/${lesson.course_id}`}>
            Back to course
          </Link>

          <h1>{lesson.title}</h1>
          <p className="module-label">{lesson.module_title}</p>
          <p>{lesson.description}</p>

          {lesson.video_url && (
            <div className="video-wrapper">
              <iframe
                src={lesson.video_url}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {lesson.practice_instructions && (
            <div className="practice-box">
              <h2>Practice</h2>
              <p>{lesson.practice_instructions}</p>
            </div>
          )}

          <div className="completion-box">
            {!user && <p>Please log in to track your progress.</p>}

            {user && completionLoading && (
              <p className="status-message">Updating progress...</p>
            )}

            {user && !completionLoading && !completed && (
              <button type="button" onClick={handleMarkCompleted}>
                Mark as completed
              </button>
            )}

            {user && !completionLoading && completed && (
              <>
                <p className="success-message">Completed</p>
                <button type="button" onClick={handleMarkNotCompleted}>
                  Mark as not completed
                </button>
              </>
            )}

            {completionError && (
              <p className="error-message">{completionError}</p>
            )}
          </div>

          <AIAssistant lesson={lesson} />
        </div>
      )}
    </section>
  )
}

export default LessonPage
