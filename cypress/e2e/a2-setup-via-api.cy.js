/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Setup via API (cy.request)', () => {
    let courseId
    let user

    before(() => {
        cy.request('GET', '/api/courses').then((response) => {
            const course = response.body.courses.find((c) => c.slug === 'java-fundamentals')
            expect(course, `course with slug "java-fundamentals"`).to.exist
            courseId = course.id
        })
    })

    beforeEach(() => {
        user = {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10 }),
        }

        cy.request('POST', '/api/auth/signup', { ...user, phone: '' })
    })

    afterEach(() => {
        cy.request('DELETE', '/api/auth/me')
    })

    it('shows the empty state on the dashboard', () => {
        cy.visit('/dashboard')
        cy.get('[data-testid="dashboard-empty-state"]').should('be.visible')
    })

    it('enrolls in a course and sees it on the dashboard', () => {
        cy.visit(`/course/${courseId}`)
        cy.enrollInCurrentCourse()
        cy.get('[data-testid^="enrolled-course-list-item-"]').should('have.length', 1)
    })

    it('shows the user email on the account page', () => {
        cy.visit('/account')
        cy.get('[data-testid="account-email-display"]').should('have.value', user.email)
    })
})
