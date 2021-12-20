import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  user: {
    username: 'testi',
    name: 'juu niin',
    id: '1ab'
  },
  likes: 5,
  author: 'kirjoittaja',
  title: 'otsikko',
  url: 'http://www.yle.fi'
}

const user = {
  username: 'testi',
  name: 'juu niin'
}

describe('Tests for blog-component', () => {
  test('renders content', () => {
    const component = render(
      <Blog blog={blog} />
    )

    expect(component.container).toHaveTextContent(
      'otsikko'
    )
    expect(component.container).toHaveTextContent(
      'kirjoittaja'
    )
  })

  test('renders full content after clicking button', () => {
    const component = render(
      <Blog blog={blog} user={user} />
    )
    const button = component.getByText('show')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      'otsikko'
    )
    expect(component.container).toHaveTextContent(
      'kirjoittaja'
    )
    expect(component.container).toHaveTextContent(
      '5'
    )
    expect(component.container).toHaveTextContent(
      'http://www.yle.fi'
    )
  })

  test('like button works', () => {
    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={blog} user={user} handleUpdateBlog={mockHandler} />
    )

    const button = component.getByText('show')
    fireEvent.click(button)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})