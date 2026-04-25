import { useParams } from 'react-router-dom'

function LessonPage() {
  const { lessonId } = useParams()

  return (
    <section className="page-card">
      <h1>Lesson</h1>
      <p>Lesson content will appear here. Lesson ID: {lessonId}</p>
    </section>
  )
}

export default LessonPage
