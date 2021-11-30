import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sorted = blogs.sort((first, second) => second.likes - first.likes)
      setBlogs( sorted )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (expection) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setMessage('logged out')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleNewBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      setMessage(`${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (expection) {
      setMessage('creating a new blog failed')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleUpdateBlog = async (blog, id) => {
    try {
      const updatedBlog = await blogService.update(blog, id)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    } catch (expection) {
      setMessage('giving a like failed')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (expection) {
      setMessage('removing a blog failed')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <LoginForm handleLogin={handleLogin} />
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm
        handleNewBlog={handleNewBlog}
      />
    </Togglable>
  )



  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} />
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in </p>
      {logoutForm()}
      <br/>
      <h2>create a new </h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleUpdateBlog={handleUpdateBlog} handleDeleteBlog={handleDeleteBlog} user={user}/>
      )}
    </div>
  )
}

export default App