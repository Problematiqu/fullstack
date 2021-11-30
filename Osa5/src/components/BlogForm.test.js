import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogFrom from './BlogForm'

test('New blog is created with correct information', () => {

  const handleNewBlog = jest.fn()

  const component = render(
    <BlogFrom handleNewBlog={handleNewBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'blogin testausta' }
  })
  fireEvent.change(author, {
    target: { value: 'tauno testaaja' }
  })
  fireEvent.change(url, {
    target: { value: 'http://www.google.com' }
  })
  fireEvent.submit(form)

  expect(handleNewBlog.mock.calls[0][0].title).toBe('blogin testausta')
  expect(handleNewBlog.mock.calls[0][0].author).toBe('tauno testaaja')
  expect(handleNewBlog.mock.calls[0][0].url).toBe('http://www.google.com')
})
