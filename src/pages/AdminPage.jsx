import { useCallback, useEffect, useState } from 'react'
import {
  createCourse,
  createLesson,
  deleteCourse,
  deleteLesson,
  updateCourse,
  updateLesson,
} from '../services/adminService'
import { getAllLessons, getCourses } from '../services/courseService'
import { getProfile } from '../services/profileService'

const emptyCourseForm = {
  title: '',
  description: '',
  level: '',
}

const emptyLessonForm = {
  course_id: '',
  module_title: '',
  title: '',
  description: '',
  video_url: '',
  practice_instructions: '',
  lesson_order: '',
}

function AdminPage({ user }) {
  const [profile, setProfile] = useState(null)
  const [courses, setCourses] = useState([])
  const [lessons, setLessons] = useState([])
  const [courseForm, setCourseForm] = useState(emptyCourseForm)
  const [lessonForm, setLessonForm] = useState(emptyLessonForm)
  const [courseEdits, setCourseEdits] = useState({})
  const [lessonEdits, setLessonEdits] = useState({})
  const [editingLessonId, setEditingLessonId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loadAdminData = useCallback(async () => {
    const { data: courseData, error: courseError } = await getCourses()
    const { data: lessonData, error: lessonError } = await getAllLessons()

    if (courseError) {
      setErrorMessage(courseError.message)
      return
    }

    if (lessonError) {
      setErrorMessage(lessonError.message)
      return
    }

    setCourses(courseData)
    setLessons(lessonData)
    setCourseEdits(createCourseEditState(courseData))
    setLessonEdits(createLessonEditState(lessonData))
  }, [])

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await getProfile(user.id)

      if (!error) {
        setProfile(data)
      }

      if (data?.role === 'admin') {
        await loadAdminData()
      }

      setLoading(false)
    }

    loadProfile()
  }, [loadAdminData, user])

  function updateCourseForm(field, value) {
    setCourseForm({
      ...courseForm,
      [field]: value,
    })
  }

  function updateLessonForm(field, value) {
    setLessonForm({
      ...lessonForm,
      [field]: value,
    })
  }

  function updateCourseEdit(courseId, field, value) {
    setCourseEdits({
      ...courseEdits,
      [courseId]: {
        ...courseEdits[courseId],
        [field]: value,
      },
    })
  }

  function updateLessonEdit(lessonId, field, value) {
    setLessonEdits({
      ...lessonEdits,
      [lessonId]: {
        ...lessonEdits[lessonId],
        [field]: value,
      },
    })
  }

  function cancelLessonEdit(lesson) {
    setLessonEdits({
      ...lessonEdits,
      [lesson.id]: createLessonEditValues(lesson),
    })
    setEditingLessonId(null)
  }

  async function handleCreateCourse(event) {
    event.preventDefault()
    setMessage('')
    setErrorMessage('')

    const { error } = await createCourse(courseForm)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setCourseForm(emptyCourseForm)
    setMessage('Course created successfully.')
    await loadAdminData()
  }

  async function handleUpdateCourse(courseId) {
    setMessage('')
    setErrorMessage('')

    const { error } = await updateCourse(courseId, courseEdits[courseId])

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setMessage('Course updated successfully.')
    await loadAdminData()
  }

  async function handleDeleteCourse(courseId) {
    setMessage('')
    setErrorMessage('')

    const { error } = await deleteCourse(courseId)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setMessage('Course deleted successfully.')
    await loadAdminData()
  }

  async function handleCreateLesson(event) {
    event.preventDefault()
    setMessage('')
    setErrorMessage('')

    const lessonData = {
      ...lessonForm,
      lesson_order: Number(lessonForm.lesson_order),
    }

    const { error } = await createLesson(lessonData)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setLessonForm(emptyLessonForm)
    setMessage('Lesson created successfully.')
    await loadAdminData()
  }

  async function handleUpdateLesson(lessonId) {
    setMessage('')
    setErrorMessage('')

    const lessonData = {
      ...lessonEdits[lessonId],
      lesson_order: Number(lessonEdits[lessonId].lesson_order),
    }

    const { error } = await updateLesson(lessonId, lessonData)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setMessage('Lesson updated successfully.')
    setEditingLessonId(null)
    await loadAdminData()
  }

  async function handleDeleteLesson(lessonId) {
    setMessage('')
    setErrorMessage('')

    const { error } = await deleteLesson(lessonId)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setMessage('Lesson deleted successfully.')
    setEditingLessonId(null)
    await loadAdminData()
  }

  if (loading) {
    return (
      <section className="page-card">
        <p>Loading admin panel...</p>
      </section>
    )
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <section className="page-card">
        <h1>Admin</h1>
        <p>Access denied. Admins only.</p>
      </section>
    )
  }

  return (
    <section className="page-card admin-page">
      <h1>Admin Panel</h1>
      <p>Use this panel to manage courses and lessons stored in Supabase.</p>

      <div className="admin-summary">
        <article className="admin-card">
          <span className="admin-summary-label">Total courses</span>
          <strong>{courses.length}</strong>
        </article>

        <article className="admin-card">
          <span className="admin-summary-label">Total lessons</span>
          <strong>{lessons.length}</strong>
        </article>

        <article className="admin-card">
          <span className="admin-summary-label">Role</span>
          <strong>Admin</strong>
        </article>
      </div>

      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="admin-grid">
        <section className="admin-section">
          <h2>Create Course</h2>
          <p className="admin-helper">Add a new course for students to browse.</p>

          <form className="admin-form" onSubmit={handleCreateCourse}>
            <label>
              Title
              <input
                type="text"
                value={courseForm.title}
                onChange={(event) =>
                  updateCourseForm('title', event.target.value)
                }
                required
              />
            </label>

            <label>
              Description
              <textarea
                value={courseForm.description}
                onChange={(event) =>
                  updateCourseForm('description', event.target.value)
                }
                required
              />
            </label>

            <label>
              Level
              <input
                type="text"
                value={courseForm.level}
                onChange={(event) =>
                  updateCourseForm('level', event.target.value)
                }
                required
              />
            </label>

            <button type="submit">Create course</button>
          </form>
        </section>

        <section className="admin-section">
          <h2>Create Lesson</h2>
          <p className="admin-helper">Attach a lesson to an existing course.</p>

          <form className="admin-form" onSubmit={handleCreateLesson}>
            <label>
              Course
              <select
                value={lessonForm.course_id}
                onChange={(event) =>
                  updateLessonForm('course_id', event.target.value)
                }
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Module title
              <input
                type="text"
                value={lessonForm.module_title}
                onChange={(event) =>
                  updateLessonForm('module_title', event.target.value)
                }
                required
              />
            </label>

            <label>
              Title
              <input
                type="text"
                value={lessonForm.title}
                onChange={(event) =>
                  updateLessonForm('title', event.target.value)
                }
                required
              />
            </label>

            <label>
              Description
              <textarea
                value={lessonForm.description}
                onChange={(event) =>
                  updateLessonForm('description', event.target.value)
                }
                required
              />
            </label>

            <label>
              Video URL
              <input
                type="url"
                value={lessonForm.video_url}
                onChange={(event) =>
                  updateLessonForm('video_url', event.target.value)
                }
              />
            </label>

            <label>
              Practice instructions
              <textarea
                value={lessonForm.practice_instructions}
                onChange={(event) =>
                  updateLessonForm('practice_instructions', event.target.value)
                }
              />
            </label>

            <label>
              Lesson order
              <input
                type="number"
                min="1"
                value={lessonForm.lesson_order}
                onChange={(event) =>
                  updateLessonForm('lesson_order', event.target.value)
                }
                required
              />
            </label>

            <button type="submit">Create lesson</button>
          </form>
        </section>
      </div>

      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <h2>Manage Courses</h2>
            <p className="admin-helper">Edit course names, descriptions, and levels.</p>
          </div>
          <span>{courses.length} courses</span>
        </div>

        <div className="admin-list">
          {courses.map((course) => (
            <article className="admin-item admin-card" key={course.id}>
              <label>
                Title
                <input
                  type="text"
                  value={courseEdits[course.id]?.title ?? ''}
                  onChange={(event) =>
                    updateCourseEdit(course.id, 'title', event.target.value)
                  }
                />
              </label>

              <label>
                Description
                <textarea
                  value={courseEdits[course.id]?.description ?? ''}
                  onChange={(event) =>
                    updateCourseEdit(
                      course.id,
                      'description',
                      event.target.value,
                    )
                  }
                />
              </label>

              <label>
                Level
                <input
                  type="text"
                  value={courseEdits[course.id]?.level ?? ''}
                  onChange={(event) =>
                    updateCourseEdit(course.id, 'level', event.target.value)
                  }
                />
              </label>

              <div className="admin-actions">
                <button type="button" onClick={() => handleUpdateCourse(course.id)}>
                  Save
                </button>
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <h2>Manage Lessons</h2>
            <p className="admin-helper">Update lesson content and lesson order.</p>
          </div>
          <span>{lessons.length} lessons</span>
        </div>

        <div className="admin-list">
          {lessons.map((lesson) => (
            <article className="admin-item admin-card" key={lesson.id}>
              {editingLessonId !== lesson.id && (
                <>
                  <div className="lesson-compact">
                    <div>
                      <p className="admin-muted">
                        {lesson.courses?.title || lesson.course_id}
                      </p>
                      <h3>{lesson.title}</h3>
                      <p>{lesson.module_title}</p>
                    </div>
                    <span>Order {lesson.lesson_order}</span>
                  </div>

                  <div className="admin-actions">
                    <button
                      type="button"
                      onClick={() => setEditingLessonId(lesson.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}

              {editingLessonId === lesson.id && (
                <>
                  <p className="admin-muted">
                    Editing: {lesson.courses?.title || lesson.course_id}
                  </p>

                  <label>
                    Course
                    <select
                      value={lessonEdits[lesson.id]?.course_id ?? ''}
                      onChange={(event) =>
                        updateLessonEdit(
                          lesson.id,
                          'course_id',
                          event.target.value,
                        )
                      }
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Module title
                    <input
                      type="text"
                      value={lessonEdits[lesson.id]?.module_title ?? ''}
                      onChange={(event) =>
                        updateLessonEdit(
                          lesson.id,
                          'module_title',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Title
                    <input
                      type="text"
                      value={lessonEdits[lesson.id]?.title ?? ''}
                      onChange={(event) =>
                        updateLessonEdit(lesson.id, 'title', event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      value={lessonEdits[lesson.id]?.description ?? ''}
                      onChange={(event) =>
                        updateLessonEdit(
                          lesson.id,
                          'description',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Video URL
                    <input
                      type="url"
                      value={lessonEdits[lesson.id]?.video_url ?? ''}
                      onChange={(event) =>
                        updateLessonEdit(
                          lesson.id,
                          'video_url',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Practice instructions
                    <textarea
                      value={
                        lessonEdits[lesson.id]?.practice_instructions ?? ''
                      }
                      onChange={(event) =>
                        updateLessonEdit(
                          lesson.id,
                          'practice_instructions',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Lesson order
                    <input
                      type="number"
                      min="1"
                      value={lessonEdits[lesson.id]?.lesson_order ?? ''}
                      onChange={(event) =>
                        updateLessonEdit(
                          lesson.id,
                          'lesson_order',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <div className="admin-actions">
                    <button
                      type="button"
                      onClick={() => handleUpdateLesson(lesson.id)}
                    >
                      Save
                    </button>
                    <button type="button" onClick={() => cancelLessonEdit(lesson)}>
                      Cancel
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

function createCourseEditState(courses) {
  const editState = {}

  courses.forEach((course) => {
    editState[course.id] = {
      title: course.title || '',
      description: course.description || '',
      level: course.level || '',
    }
  })

  return editState
}

function createLessonEditState(lessons) {
  const editState = {}

  lessons.forEach((lesson) => {
    editState[lesson.id] = createLessonEditValues(lesson)
  })

  return editState
}

function createLessonEditValues(lesson) {
  return {
    course_id: lesson.course_id || '',
    module_title: lesson.module_title || '',
    title: lesson.title || '',
    description: lesson.description || '',
    video_url: lesson.video_url || '',
    practice_instructions: lesson.practice_instructions || '',
    lesson_order: lesson.lesson_order ?? '',
  }
}

export default AdminPage
