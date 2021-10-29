const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../middleware/userExtractor')
const tokenExtractor = require('../middleware/tokenExtractor')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!request.token || !user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  if (blog.title && blog.url) {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } else {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  if (!request.token || !user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Unauthorized action' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const blog = {
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
  response.json(updatedBlog)
})

module.exports = blogsRouter