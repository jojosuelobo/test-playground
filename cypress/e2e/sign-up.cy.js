/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Sign Up', () => {
    describe('GUI', () => {
        beforeEach(() => {
            cy.visit('/')
        })

        it('opens and closes the modal from home-signup-button and nav-signup-button', () => {
            // home-signup-button
            cy.get('[data-testid="home-signup-button"]').click()
            cy.get('[data-testid="signup-modal"]').exists().and('be.visible')
            cy.get('[data-testid="signup-modal-close-button"]').click()

            // nav-signup-button
            cy.get('[data-testid="nav-signup-button"]').click()
            cy.get('[data-testid="signup-modal"]').exists().and('be.visible')
            cy.get('[data-testid="signup-modal-close-button"]').click()
        })

        it('creates a new user with success', () => {
            cy.intercept('POST', '/api/auth/signup').as('signup')
            const name = faker.person.firstName()
            const email = faker.internet.email()
            const password = faker.internet.password()

            cy.get('[data-testid="nav-signup-button"]').click()
            cy.get('[data-testid="signup-name-input"]').type(name)
            cy.get('[data-testid="signup-email-input"]').type(email)
            cy.get('[data-testid="signup-password-input"]').type(password)
            cy.get('[data-testid="signup-submit-button"]').click()

            cy.wait('@signup').then((interception) => {
                expect(interception.response.statusCode).to.eq(201)
                expect(interception.response.body.user.name).to.eq(name)
                expect(interception.response.body.user.email).to.eq(email)
                expect(interception.response.body.user.role).to.eq('STUDENT')
                expect(interception.response.body.user.id).to.exist
            })

            cy.contains('Meu Dashboard').should('be.visible')
        })

        it('creates a new user from sign up in the login modal', () => {
            cy.intercept('POST', '/api/auth/signup').as('signup')
            const name = faker.person.firstName()
            const email = faker.internet.email()
            const password = faker.internet.password()

            cy.get('[data-testid="nav-login-button"]').click()
            cy.get('[data-testid="login-switch-to-signup-button"]').click()
            cy.get('[data-testid="signup-name-input"]').type(name)
            cy.get('[data-testid="signup-email-input"]').type(email)
            cy.get('[data-testid="signup-password-input"]').type(password)
            cy.get('[data-testid="signup-submit-button"]').click()

            cy.wait('@signup').then((interception) => {
                expect(interception.response.statusCode).to.eq(201)
                expect(interception.response.body.user.name).to.eq(name)
                expect(interception.response.body.user.email).to.eq(email)
                expect(interception.response.body.user.role).to.eq('STUDENT')
                expect(interception.response.body.user.id).to.exist
            })

            cy.contains('Meu Dashboard').should('be.visible')
        });

        it('creates a new user with invalid name', () => {
            const email = faker.internet.email()
            const password = faker.internet.password()

            cy.get('[data-testid="nav-signup-button"]').click()
            cy.get('[data-testid="signup-name-input"]').type(' ')
            cy.get('[data-testid="signup-email-input"]').type(email)
            cy.get('[data-testid="signup-password-input"]').type(password)
            cy.get('[data-testid="signup-submit-button"]').click()

            cy.get('[data-testid="signup-error-message"]').should('be.visible')
            cy.get('[data-testid="signup-error-message"]').should('contain.text', 'Não foi possível criar a conta.')
        })

        it('creates a new user with invalid password', () => {
            const name = faker.person.firstName()
            const email = faker.internet.email()

            cy.get('[data-testid="nav-signup-button"]').click()
            cy.get('[data-testid="signup-name-input"]').type(name)
            cy.get('[data-testid="signup-email-input"]').type(email)
            cy.get('[data-testid="signup-password-input"]').type('123')
            cy.get('[data-testid="signup-submit-button"]').click()

            cy.get('[data-testid="signup-error-message"]').should('be.visible')
            cy.get('[data-testid="signup-error-message"]').should('contain.text', 'Não foi possível criar a conta.')
        })

        it('creates a new user with existing email', () => {
            cy.intercept('POST', '/api/auth/signup').as('signup')
            const name = faker.person.firstName()
            const email = 'demo@example.com'
            const password = faker.internet.password()

            cy.get('[data-testid="nav-signup-button"]').click()
            cy.get('[data-testid="signup-name-input"]').type(name)
            cy.get('[data-testid="signup-email-input"]').type(email)
            cy.get('[data-testid="signup-password-input"]').type(password)
            cy.get('[data-testid="signup-submit-button"]').click()

            cy.wait('@signup').then((interception) => {
                expect(interception.response.statusCode).to.eq(409)
                expect(interception.response.body.message).to.eq('Este email já está em uso.')
            })

            cy.get('[data-testid="signup-error-message"]').should('be.visible')
            cy.get('[data-testid="signup-error-message"]').should('contain.text', 'Este email já está em uso.')
        })
    })

    describe('API', () => {
        it('creates a new user with a valid payload, returning 201 and setting the session cookie', () => {
            const name = faker.person.firstName()
            const email = faker.internet.email()
            const password = faker.internet.password({ length: 10 })

            cy.request('POST', '/api/auth/signup', { name, email, password, phone: '' })
                .then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body.user).to.deep.equal({
                        id: response.body.user.id,
                        name,
                        email,
                        role: 'STUDENT',
                    })
                    expect(response.body.user.id).to.exist

                    expect(response.headers['set-cookie']).to.exist
                    const sessionCookie = response.headers['set-cookie'].find((cookie) => cookie.startsWith('session='))
                    expect(sessionCookie).to.exist
                })
        })

        it('rejects a payload with a short name with a 400', () => {
            const email = faker.internet.email()
            const password = faker.internet.password({ length: 10 })

            cy.request({
                method: 'POST',
                url: '/api/auth/signup',
                body: { name: 'a', email, password, phone: '' },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400)
            })
        })

        it('rejects a payload with an invalid email with a 400', () => {
            const name = faker.person.firstName()
            const password = faker.internet.password({ length: 10 })

            cy.request({
                method: 'POST',
                url: '/api/auth/signup',
                body: { name, email: 'not-an-email', password, phone: '' },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400)
            })
        })

        it('rejects a payload with a short password with a 400', () => {
            const name = faker.person.firstName()
            const email = faker.internet.email()

            cy.request({
                method: 'POST',
                url: '/api/auth/signup',
                body: { name, email, password: '123', phone: '' },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400)
            })
        })

        it('rejects a duplicate email with a 409', () => {
            const name = faker.person.firstName()
            const email = 'demo@example.com'
            const password = faker.internet.password({ length: 10 })

            cy.request({
                method: 'POST',
                url: '/api/auth/signup',
                body: { name, email, password, phone: '' },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(409)
                expect(response.body.message).to.eq('Este email já está em uso.')
            })
        })
    })
})
