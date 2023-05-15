describe('The Registration Form', () => {
  it('loading passes', () => {
    cy.visit('http://localhost:3000')
  });

  it('has a username field', () => {
    cy.visit('http://localhost:3000')
    cy.get('#username').should('exist')
    cy.get('#username').should('be.visible')
  });

  it('has a password field', () => {
    cy.visit('http://localhost:3000')
    cy.get('#password').should('exist')
    cy.get('#password').should('be.visible')
  });

  it('cant log in with empty fields', () => {
    cy.visit('http://localhost:3000')
    cy.get('#login').click()
    cy.url().should('eq', 'http://localhost:3000/login');
  });

  it('cant log in with invalid credentials', () => {
    cy.visit('http://localhost:3000')
    cy.get('#username').type('test')
    cy.get('#password').type('test')
    cy.get('#login').click()
    cy.url().should('eq', 'http://localhost:3000/login');
  });

  it('can log in with proper username and password', () => {
    cy.visit('http://localhost:3000')
    cy.get('#username').type('tchibo')
    cy.get('#password').type('password')
    cy.get('#login').click()
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('can log out', () => {
    cy.visit('http://localhost:3000')
    cy.get('#username').type('tchibo')
    cy.get('#password').type('password')
    cy.get('#login').click()
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('#basic-button').should('exist')
    cy.get('#basic-button').click();
    cy.get('#logout').should('exist')
    cy.get('#logout').should('be.visible')
    cy.get('#logout').click()
    cy.url().should('eq', 'http://localhost:3000/login');
  });
});

describe('The main page', () => {
  it('Admin has 4 sections', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('eq', 'http://localhost:3000/login');
    cy.get('#username').type('tchibo')
    cy.get('#password').type('password')
    cy.get('#login').click()
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('div.main-menu')
      .children('.md') 
      .should('have.length', 4); 
  });

  it('Regular has 2 sections', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('eq', 'http://localhost:3000/login');
    cy.get('#username').type('user_regular_1')
    cy.get('#password').type('password')
    cy.get('#login').click()
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('div.main-menu')
      .children('.md') 
      .should('have.length', 2); 
  });

  it('Moderator has 2 sections', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('eq', 'http://localhost:3000/login');
    cy.get('#username').type('user_moderator_1')
    cy.get('#password').type('password')
    cy.get('#login').click()
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('div.main-menu')
      .children('.md') 
      .should('have.length', 2); 
  });

  it('Guest has 2 sections', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('eq', 'http://localhost:3000/login');
    cy.get('#btnguest').click()
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('div.main-menu')
      .children('.md') 
      .should('have.length', 2); 
  });

  it('Cannot access admin specific sections as normal users', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('eq', 'http://localhost:3000/login');
    cy.get('#username').type('user_regular_1')
    cy.get('#password').type('password')
    cy.get('#login').click()
    cy.url().should('eq', 'http://localhost:3000/');

    cy.visit('http://localhost:3000/manage-users')
    cy.url().should('eq', 'http://localhost:3000/');

    cy.visit('http://localhost:3000/manage-database')
    cy.url().should('eq', 'http://localhost:3000/');
  });
});

describe('The manage users page', () => {

    it('Admin can access manage users page', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#username').type('tchibo')
      cy.get('#password').type('password')
      cy.get('#login').click()
      cy.url().should('eq', 'http://localhost:3000/');

      cy.visit('http://localhost:3000/manage-users')
    });

    it('Admin can set global page size', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#username').type('tchibo')
      cy.get('#password').type('password')
      cy.get('#login').click()
      cy.url().should('eq', 'http://localhost:3000/');

      cy.visit('http://localhost:3000/manage-users')

      cy.get('#page-size-input').should('exist')
      cy.get('#page-size-input').should('be.visible')
      cy.get('#page-size-input').type('5')
      cy.get('#page-size-input').should('have.value', '5')
      cy.get('#page-size-button').should('exist')
      cy.get('#page-size-button').should('be.visible')
      cy.get('#page-size-button').click()

      cy.wait(1000)

      cy.visit('http://localhost:3000/manage-users')

      cy.get('#table-body').children().should('have.length', 5)
    });
});