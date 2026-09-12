/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('createStudentUser', () => {
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

Cypress.Commands.add('fillSignupForm', (name, email, password) => {
    cy.get('[data-testid="nav-signup-button"]').click()
    cy.get('[data-testid="signup-name-input"]').type(name)
    cy.get('[data-testid="signup-email-input"]').type(email)
    cy.get('[data-testid="signup-password-input"]').type(password)
    cy.get('[data-testid="signup-submit-button"]').click()
})