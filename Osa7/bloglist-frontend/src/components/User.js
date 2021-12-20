import React from 'react'

const User = (user) => {
  if (!user.user) {
    return null
  }

  const blogs = user.user.blogs.map(blog =>
    <li key={blog.id}>{blog.title}</li>
  )

  return (
    <div>
      <h1>{user.user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {blogs}
      </ul>
    </div>
  )
}

export default User