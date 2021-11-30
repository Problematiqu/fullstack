describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Tauno Testaaja',
      username: 'testuser',
      password: 'testuser'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.login({ username: 'testuser', password: 'testuser' })
      cy.contains('Tauno Testaaja logged in')
    })
    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'testuser' })
    })

    it('A blog can be created', function() {
      const blog = {
        title: 'Cypress',
        author: 'T.A Tester',
        url: 'http://www.yle.fi'
      }
      cy.createBlog(blog)

      cy.contains('Cypress')
    })

    it('A blog can be liked', function() {
      const blog = {
        title: 'Cypress',
        author: 'T.A Tester',
        url: 'http://www.yle.fi'
      }
      cy.createBlog(blog)

      cy.contains('Cypress')
        .contains('show')
        .click()

      cy.contains('Cypress')
        .contains('like')
        .click()

      cy.contains('Cypress')
        .contains('1')

    })
  })
})