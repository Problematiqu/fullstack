const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (likes, blog) => {
    if (blog.likes > likes) {
      likes = blog.likes
    }
    return likes
    }
  const favorite = blogs.reduce(reducer, 0)

  return blogs.find(blog => blog.likes === favorite)
}

const mostBlogs = (blogs) => {
  const authors = new Map()

  blogs.forEach(blog => {
    if (authors.has(blog.author)) {
      authors.set(blog.author, authors.get(blog.author) + 1)
    } else {
      authors.set(blog.author, 1)  
    }
  })

  let writer = ''
  let total = 0

  authors.forEach((value, key) => {
    if (value > total) {
      writer = key 
      total = value
    }
  })

  const most = {
    'author': writer,
    'blogs': total
  }

  return most.blogs === 0
    ? undefined 
    : most
  
}

const mostLikes = (blogs) => {
  const authors = new Map()  

  blogs.forEach(blog => {
    if (authors.has(blog.author)) {
      authors.set(blog.author, authors.get(blog.author) + blog.likes)
    } else {
      authors.set(blog.author, blog.likes)
    }
  })

  let writer = ''
  let total = 0

  authors.forEach((value, key) => {
    if (value > total) {
      writer = key
      total = value
    }
  })

  const most = {
    'author': writer,
    'likes': total
  }

  return most.likes === 0
    ? undefined 
    : most
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}