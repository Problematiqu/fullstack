const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
  {
    title: 'Testiblogi numero yksi',
    author: 'Timo Testimies',
    url: 'http://www.yle.fi',
    likes: 2
  },
  {
    title: 'Kakkostesti',
    author: 'Tuunaaja',
    url: 'http://www.google.com',
    likes: 4
  },
  {
    title: 'Kolmonen',
    author: 'Buginmurskaaja',
    url: 'http://www.hs.fi',
    likes: 5
  }
]
const initialUser =  {
  username: 'tester',
  name: 'Test user',
  password: 'tester'
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
  await User.deleteMany({})
})

describe('Blogs are accessible and correct', () => {
  test('blogs are returned and have the correct type', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all the blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blogs have an id field', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('Functionality to add blogs', () => {
  test('Adding a blog works', async () => {
    await api
      .post('/api/users')
      .send(initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const user = {
      username: 'tester',
      password: 'tester'
    }

    const login = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blog = {
      title: 'Testiblogi',
      author: 'Testaaja',
      url: 'http://www.google.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const blogs = response.body.map(blog => blog.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(blogs).toContain('Testiblogi')
  })

  test('Adding a blog without a value in likes', async () => {

    await api
      .post('/api/users')
      .send(initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const user = {
      username: 'tester',
      password: 'tester'
    }

    const login = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blog = {
      title: 'Testiblogi',
      author: 'Testaaja',
      url: 'http://www.google.com'
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const addedBlog = response.body.filter(blog => blog.title === 'Testiblogi')
    expect(addedBlog[0].likes).toBe(0)
  })

  test('Adding a blog without a title or an url fails', async () => {

    await api
      .post('/api/users')
      .send(initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const user = {
      username: 'tester',
      password: 'tester'
    }

    const login = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogNoTitle = {
      author: 'Testaaja',
      url: 'http://www.google.com'
    }

    const blogNoUrl = {
      title: 'Testiblogi',
      author: 'Testaaja',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${login.body.token}`)
      .send(blogNoTitle)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${login.body.token}`)
      .send(blogNoUrl)
      .expect(400)

    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(initialBlogs.length)
  })
})

describe('Modifying blogs', () => {
  test('Deleting a blog', async () => {

    await api
      .post('/api/users')
      .send(initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const user = {
      username: 'tester',
      password: 'tester'
    }

    const login = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blog = {
      title: 'Testiblogi',
      author: 'Testaaja',
      url: 'http://www.google.com',
      likes: 5
    }

    const returnedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${login.body.token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .delete(`/api/blogs/${returnedBlog.body.id}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length)
  })

  test('Updating a blog', async () => {

    await api
      .post('/api/users')
      .send(initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const user = {
      username: 'tester',
      password: 'tester'
    }

    const login = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blog = {
      title: 'Testiblogi',
      author: 'Testaaja',
      url: 'http://www.google.com',
      likes: 5
    }

    const returnedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${login.body.token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updateBlog = {
      likes: 999
    }

    await api
      .put(`/api/blogs/${returnedBlog.body.id}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .send(updateBlog)
      .expect(200)

    const blogAtEnd = await api.get(`/api/blogs/${returnedBlog.body.id}`)
    expect(blogAtEnd.body.likes).toBe(999)
  })
})

afterAll(() => {
  mongoose.connection.close()
})