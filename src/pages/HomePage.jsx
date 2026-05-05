import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="container home-page">
      <div className="hero-section">
        <h1>LearnTrack</h1>
        <p>
          Structured online learning platform with progress tracking and
          learning support.
        </p>

        <div className="hero-actions">
          <Link className="button" to="/courses">
            Browse Courses
          </Link>
          <Link className="button button-secondary" to="/dashboard">
            Go to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid feature-grid">
        <article className="card">
          <h2>Structured courses</h2>
          <p className="muted">
            Courses are organized into modules and lessons for clear learning.
          </p>
        </article>

        <article className="card">
          <h2>Progress tracking</h2>
          <p className="muted">
            Students can mark lessons complete and see progress update.
          </p>
        </article>

        <article className="card">
          <h2>Rule-based lesson helper</h2>
          <p className="muted">
            A simple assistant helps students understand lessons and tasks.
          </p>
        </article>

        <article className="card">
          <h2>Admin content management</h2>
          <p className="muted">
            Admins can create and manage course and lesson content.
          </p>
        </article>
      </div>
    </section>
  )
}

export default HomePage
