import blogService from '../services/blogs'

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (data) => {
  return async dispatch => {
    const newBlog = await blogService.create(data)
    dispatch({
      type: 'CREATE',
      data: newBlog
    })
  }
}

export const updateBlog = (blog, id) => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog, id)
    dispatch({
      type: 'UPDATE',
      data: updatedBlog
    })
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'REMOVE',
      data: id
    })
  }
}

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS': {
    const sorted = action.data.sort((first, second) => second.likes - first.likes)
    return sorted
  }
  case 'CREATE': {
    console.log(action.data)
    return [...state, action.data]
  }
  case 'UPDATE': {
    const updatedBlogs = state.map(blog => blog.id !== action.data.id ? blog : action.data)
    const sorted = updatedBlogs.sort((first, second) => second.likes - first.likes)
    return sorted
  }
  case 'REMOVE': {
    const filtered = state.filter(blog => blog.id !== action.data)
    return filtered
  }
  default: return state
  }
}

export default blogReducer