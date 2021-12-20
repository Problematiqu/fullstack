import React from 'react'

const Blogview = ({ blog, handleUpdateBlog, handleDeleteBlog, user }) => {
  if (!blog) {
    return null
  }

  const handleUpdate = () => {
    const updated = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title ,
      url: blog.url
    }
    handleUpdateBlog(updated, blog.id)

  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDeleteBlog(blog.id)
    }
  }

  const removeButton = () => {
    if (blog.user.username === user.username) {
      return <button onClick={handleDelete}>remove</button>
    }
    return <></>
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <br/>
      {blog.url}
      <br/>
      likes {blog.likes} <button onClick={handleUpdate}>like</button>
      <br/>
      added by {blog.user.name}
      <br/>
      {removeButton()}
    </div>
  )
}

export default Blogview