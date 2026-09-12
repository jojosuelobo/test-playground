/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

const STUDENT_CREDENTIALS = { email: 'demo@example.com', password: 'Password123!' }
const TEACHER_CREDENTIALS = { email: 'professor@admin.com', password: 'admin' }

describe('Login', () => {
    describe('GUI', () => {
        beforeEach(() => {
            cy.visit('/')
        })

        it('opens the modal from home-login-button and nav-login-button', () => {
            // home-login-button
            cy.get('[data-testid="home-login-button"]').click()
            cy.get('[data-testid="login-modal"]').should('exist').and('be.visible')
            cy.get('[data-testid="login-modal-close-button"]').click()

            // nav-login-button
            cy.get('[data-testid="nav-login-button"]').click()
            cy.get('[data-testid="login-modal"]').should('exist').and('be.visible')
        })

        it('logs in successfully as a student and redirects to /dashboard', () => {
            cy.intercept('POST', '/api/auth/login').as('login')

            cy.get('[data-testid="nav-login-button"]').click()
            cy.get('[data-testid="login-email-input"]').type(STUDENT_CREDENTIALS.email)
            cy.get('[data-testid="login-password-input"]').type(STUDENT_CREDENTIALS.password)
            cy.get('[data-testid="login-submit-button"]').click()

            cy.wait('@login').then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.user.email).to.eq(STUDENT_CREDENTIALS.email)
                expect(interception.response.body.user.role).to.eq('STUDENT')
            })

            cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
            cy.contains('Meu Dashboard').should('be.visible')
        })

        it('logs in successfully as a professor and redirects to /professor', () => {
            cy.intercept('POST', '/api/auth/login').as('login')

            cy.get('[data-testid="nav-login-button"]').click()
            cy.get('[data-testid="login-email-input"]').type(TEACHER_CREDENTIALS.email)
            cy.get('[data-testid="login-password-input"]').type(TEACHER_CREDENTIALS.password)
            cy.get('[data-testid="login-submit-button"]').click()

            cy.wait('@login').then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.user.email).to.eq(TEACHER_CREDENTIALS.email)
                expect(interception.response.body.user.role).to.eq('TEACHER')
            })

            cy.url().should('eq', `${Cypress.config().baseUrl}/professor`)
            cy.get('[data-testid="professor-page"]').should('be.visible')
        })

        it('shows an error and stays in the modal with a wrong password', () => {
            cy.get('[data-testid="nav-login-button"]').click()
            cy.get('[data-testid="login-email-input"]').type(STUDENT_CREDENTIALS.email)
            cy.get('[data-testid="login-password-input"]').type('wrong-password-123')
            cy.get('[data-testid="login-submit-button"]').click()

            cy.get('[data-testid="login-error-message"]').should('be.visible')
            cy.get('[data-testid="login-error-message"]').should('contain.text', 'Email ou senha inválidos.')
            cy.get('[data-testid="login-modal"]').should('be.visible')
        })

        it('shows an error with an unregistered email', () => {
            cy.get('[data-testid="nav-login-button"]').click()
            cy.get('[data-testid="login-email-input"]').type(faker.internet.email())
            cy.get('[data-testid="login-password-input"]').type('some-password-123')
            cy.get('[data-testid="login-submit-button"]').click()

            cy.get('[data-testid="login-error-message"]').should('be.visible')
            cy.get('[data-testid="login-error-message"]').should('contain.text', 'Email ou senha inválidos.')
            cy.get('[data-testid="login-modal"]').should('be.visible')
        })

        it('blocks submit with empty fields via browser required validation', () => {
            cy.intercept('POST', '/api/auth/login').as('login')

            cy.get('[data-testid="nav-login-button"]').click()
            cy.get('[data-testid="login-submit-button"]').click()

            cy.get('[data-testid="login-email-input"]').then(([input]) => {
                expect(input.checkValidity()).to.be.false
                expect(input.validationMessage).to.not.be.empty
            })
            cy.get('[data-testid="login-modal"]').should('be.visible')
            cy.get('@login.all').should('have.length', 0)
        })
    })

    describe('API', () => {
        it('accepts valid credentials, returning 200 and setting the session cookie', () => {
            cy.request('POST', '/api/auth/login', STUDENT_CREDENTIALS)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.user).to.deep.equal({
                        id: response.body.user.id,
                        name: response.body.user.name,
                        email: STUDENT_CREDENTIALS.email,
                        role: 'STUDENT',
                    })
                    expect(response.body.user.id).to.exist

                    expect(response.headers['set-cookie']).to.exist
                    const sessionCookie = response.headers['set-cookie'].find((cookie) => cookie.startsWith('session='))
                    expect(sessionCookie).to.exist
                })
        })

        it('rejects invalid credentials with a 401', () => {
            cy.request({
                method: 'POST',
                url: '/api/auth/login',
                body: { email: STUDENT_CREDENTIALS.email, password: 'wrong-password-123' },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(401)
            })
        })

        it('rejects a malformed payload (missing email/password) with a 400', () => {
            cy.request({
                method: 'POST',
                url: '/api/auth/login',
                body: {},
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400)
            })
        })
    })
})

describe('Logout', () => {
    describe('GUI', () => {
        beforeEach(() => {
            cy.request('POST', '/api/auth/login', STUDENT_CREDENTIALS)
            cy.visit('/')
        })

        it('removes the session cookie and redirects to / when clicking nav-logout-button', () => {
            cy.get('[data-testid="nav-logout-button"]').click()

            cy.url().should('eq', `${Cypress.config().baseUrl}/`)
            cy.getCookie('session').should('not.exist')
        })
    })

    describe('API', () => {
        beforeEach(() => {
            cy.request('POST', '/api/auth/login', STUDENT_CREDENTIALS)
        })

        it('clears the session cookie on an authenticated call, returning 200', () => {
            cy.request('POST', '/api/auth/logout').then((response) => {
                expect(response.status).to.eq(200)
            })

            cy.getCookie('session').should('not.exist')
        })

        it('GET /api/auth/me returns 401 without a session', () => {
            cy.clearCookie('session')

            cy.request({
                method: 'GET',
                url: '/api/auth/me',
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(401)
            })
        })

        it('GET /api/auth/me returns 200 and the user with a valid session', () => {
            cy.request('GET', '/api/auth/me').then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.user.email).to.eq(STUDENT_CREDENTIALS.email)
                expect(response.body.user.role).to.eq('STUDENT')
            })
        })
    })
})
