import { useParams } from 'react-router-dom'

function CourseDetailsPage() {
  const { courseId } = useParams()

  return (
    <section className="page-card">
      <h1>Course Details</h1>
      <p>Details for course: {courseId}</p>
    </section>
  )
}

export default CourseDetailsPage
