import React, { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import { createNotification  } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, updateBlog, removeBlog } from './reducers/blogReducer'
import { logUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/userlistReducer'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Blogview from './components/Blogview'
import styled from 'styled-components'
import { Link } from 'react-router-dom'


const Navigation = styled.div`
  background: grey
  `

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(logUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const blogFormRef = useRef()
  const userlist = useSelector(state => state.userlist)

  const userMatch = useRouteMatch('/users/:id')
  const matchedUser = userMatch
    ? userlist.find(user => user.id === userMatch.params.id)
    : null

  const blogMatch = useRouteMatch('/blogs/:id')
  const matchedBlog = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(logUser(user))
    } catch (expection) {
      dispatch(createNotification('wrong username or password', 5))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedUser')
    dispatch(logUser(null))
    dispatch(createNotification('logged out', 5))

  }

  const handleNewBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    try {
      dispatch(createBlog(newBlog))
      dispatch(createNotification(`${newBlog.title} by ${newBlog.author} added`, 5))
    } catch (expection) {
      dispatch(createNotification('creating a new blog failed', 5))
    }
  }

  const handleUpdateBlog = async (blog, id) => {
    try {
      dispatch(updateBlog(blog, id))
    } catch (expection) {
      dispatch(createNotification('giving a like failed', 5))
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      dispatch(removeBlog(id))
    } catch (expection) {
      dispatch(createNotification('removing a blog failed', 5))
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
        <Notification />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Navigation>
        <Link to="/">blogs </Link>
        <Link to="/users">users </Link>
        {user.name} logged in
        {logoutForm()}
      </Navigation>
      <h2>blogs</h2>
      <Notification />
      <Switch>
        <Route path="/blogs/:id">
          <Blogview blog={matchedBlog} handleUpdateBlog={handleUpdateBlog} handleDeleteBlog={handleDeleteBlog} user={user}/>
        </Route>
        <Route path="/users/:id">
          <User user={matchedUser}/>
        </Route>
        <Route path="/users">
          <Users users={userlist}/>
        </Route>
        <Route path="/">
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleUpdateBlog={handleUpdateBlog} handleDeleteBlog={handleDeleteBlog} user={user}/>
          )}
        </Route>
      </Switch>
    </div>
  )
}

export default App