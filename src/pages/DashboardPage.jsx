function DashboardPage({ user }) {
  return (
    <section className="page-card">
      <h1>Dashboard</h1>
      <p>Your learning progress and enrolled courses will appear here.</p>
      <p className="user-email">Logged in as: {user?.email ?? 'Unknown user'}</p>
    </section>
  )
}

export default DashboardPage
