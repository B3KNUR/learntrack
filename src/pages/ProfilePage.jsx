function ProfilePage({ user }) {
  return (
    <section className="page-card">
      <h1>Profile</h1>
      <p>User information and account settings will appear here.</p>
      <p className="user-email">Email: {user?.email ?? 'Unknown user'}</p>
    </section>
  )
}

export default ProfilePage
