import React, { useState } from 'react'

const Blog = ({ blog, handleUpdateBlog, handleDeleteBlog, user }) => {
  const [fullDetails, setFullDetails] = useState(false)

  const toggleFullDetails = () => {
    setFullDetails(!fullDetails)
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

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeButton = () => {
    if (blog.user.username === user.username) {
      return <button onClick={handleDelete}>remove</button>
    }
    return <></>
  }

  if (fullDetails) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleFullDetails}>hide</button>
        <br/>
        {blog.url}
        <br/>
        likes {blog.likes} <button onClick={handleUpdate}>like</button>
        <br/>
        {blog.user.name}
        <br/>
        {removeButton()}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleFullDetails}>show</button>
    </div>
  )
}

export default Blog