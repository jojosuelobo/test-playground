/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Strong Selectors', () => {
    let courseId

    before(() => {
        cy.request('GET', '/api/courses').then((response) => {
            const course = response.body.courses.find((c) => c.slug === 'java-fundamentals')
            expect(course, `course with slug "java-fundamentals"`).to.exist
            courseId = course.id
        })
    })

    describe('Bad - class/CSS selectors', () => {
        beforeEach(() => {
            cy.createStudentUser()
            cy.visit(`/course/${courseId}`)
        })

        it('enrolls, completes the course and views the certificate', () => {
            cy.get('.bg-indigo-600.text-white.shadow-sm').click() // enroll-button
            cy.get('.text-indigo-600.hover\\:underline').click() // Go to Dashboard
            cy.get('.rounded-lg.border.border-gray-200.bg-white').first().click()

            cy.get('.bg-emerald-600.text-white.shadow-sm').click() // complete-course-button
            cy.get('.bg-amber-500.text-white.shadow-sm').click() // certificate-button

            cy.get('.uppercase.tracking-widest.text-amber-600')
                .should('contain.text', 'Certificado de Conclusão')
        })
    })

    describe('Good - id selectors', () => {
        beforeEach(() => {
            cy.createStudentUser()
            cy.visit(`/course/${courseId}`)
        })

        it('enrolls, completes the course and views the certificate', () => {
            cy.intercept('POST', '/api/enrollments').as('enroll')
            cy.intercept('PATCH', '/api/enrollments/*/complete').as('complete')

            cy.get('#enroll-button').click()

            cy.wait('@enroll').then((interception) => {
                const enrollmentId = interception.response.body.enrollment.id

                cy.get('#enrollment-dashboard-link').click()
                cy.get(`#enrolled-course-list-item-${enrollmentId}`).click()

                cy.get('#complete-course-button').click()
                cy.wait('@complete')
                cy.get('#certificate-button').click()

                cy.contains('Certificado de Conclusão').should('be.visible')
            })
        })
    })

    describe('Great - data-testid selectors (equivalent to data-cy)', () => {
        beforeEach(() => {
            cy.createStudentUser()
            cy.visit(`/course/${courseId}`)
        })

        it('enrolls, completes the course and views the certificate', () => {
            cy.intercept('POST', '/api/enrollments').as('enroll')
            cy.intercept('PATCH', '/api/enrollments/*/complete').as('complete')

            cy.get('[data-testid="enroll-button"]').click()

            cy.wait('@enroll').then((interception) => {
                const enrollmentId = interception.response.body.enrollment.id

                cy.get('[data-testid="enrollment-dashboard-link"]').click()
                cy.get(`[data-testid="enrolled-course-list-item-${enrollmentId}"]`).click()

                cy.get('[data-testid="complete-course-button"]').click()
                cy.wait('@complete')
                cy.get('[data-testid="certificate-button"]').click()

                cy.contains('Certificado de Conclusão').should('be.visible')
            })
        })
    })
})

describe('Waits', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    describe('Bad - fixed wait', () => {
        it('signs up and sleeps for a fixed 10s before checking the result', () => {
            const name = faker.person.firstName()
            const email = faker.internet.email()
            const password = faker.internet.password()
            cy.fillSignupForm(name, email, password)

            cy.wait(10000)

            cy.contains('Meu Dashboard').should('be.visible')
        })
    })

    describe('Good - timeout option', () => {
        it('signs up and extends the assertion timeout instead of guessing a fixed wait', () => {
            const name = faker.person.firstName()
            const email = faker.internet.email()
            const password = faker.internet.password()
            cy.fillSignupForm(name, email, password)

            cy.contains('Meu Dashboard', { timeout: 15000 }).should('be.visible')
        })
    })

    describe('Great - intercept', () => {
        it('signs up and waits on the actual network response', () => {
            cy.intercept('POST', '/api/auth/signup').as('signup')

            const name = faker.person.firstName()
            const email = faker.internet.email()
            const password = faker.internet.password()
            cy.fillSignupForm(name, email, password)

            cy.wait('@signup').its('response.statusCode').should('eq', 201)

            cy.contains('Meu Dashboard').should('be.visible')
        })
    })
})

describe('Flaky Tests', () => {
    // Each of these re-rolls its randomness on every run/retry (fresh request, fresh
    // page load), so cypress.config.ts's `retries.runMode` can genuinely rescue them -
    // this isn't a deterministic bug retries would just paper over.

    it('flakes on an unreliable backend response', () => {
        // ~50% of requests come back with success: false - a flaky dependency/API.
        cy.request('GET', '/api/demo/flaky').its('body.success').should('eq', true)
    })

    it('flakes on a UI element that can render after the assertion timeout', () => {
        // The message shows up after a random 0-6s delay, checked with the default
        // 4s command timeout - fails whenever the delay happens to land past 4s.
        cy.visit('/demo/flaky')
        cy.get('[data-testid="flaky-ready-message"]').should('be.visible')
    })

    it('flakes on a UI element that only renders about half the time', () => {
        // The banner is a coin flip on every page load - a classic "works on my
        // machine" race with no network involved at all.
        cy.visit('/demo/flaky')
        cy.get('[data-testid="flaky-banner"]').should('exist')
    })
})
