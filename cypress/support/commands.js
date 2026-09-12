/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

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

Cypress.Commands.add('enrollInCurrentCourse', () => {
    cy.intercept('POST', '/api/enrollments').as('enroll')
    cy.get('[data-testid="enroll-button"]').click()
    cy.wait('@enroll')
    cy.get('[data-testid="enrollment-dashboard-link"]').click()
})

Cypress.Commands.add('openFirstEnrolledCourse', () => {
    cy.get('[data-testid^="enrolled-course-list-item-"]').first().click()
})

Cypress.Commands.add('completeCourseAndViewCertificate', () => {
    cy.intercept('PATCH', '/api/enrollments/*/complete').as('complete')
    cy.get('[data-testid="complete-course-button"]').click()
    cy.wait('@complete')
    cy.get('[data-testid="certificate-button"]').click()
})