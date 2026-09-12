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
                .should('contain.text', 'Certificate of Completion')
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

                cy.contains('Certificate of Completion').should('be.visible')
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

                cy.contains('Certificate of Completion').should('be.visible')
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

            cy.contains('My Dashboard').should('be.visible')
        })
    })

    describe('Good - timeout option', () => {
        it('signs up and extends the assertion timeout instead of guessing a fixed wait', () => {
            const name = faker.person.firstName()
            const email = faker.internet.email()
            const password = faker.internet.password()
            cy.fillSignupForm(name, email, password)

            cy.contains('My Dashboard', { timeout: 15000 }).should('be.visible')
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

            cy.contains('My Dashboard').should('be.visible')
        })
    })
})

describe('Flaky Tests', () => {
    it('flakes on an unreliable backend response', () => {
        cy.request('GET', '/api/demo/flaky').its('body.success').should('eq', true)
    })

    it('flakes on a UI element that can render after the assertion timeout', () => {
        cy.visit('/demo/flaky')
        cy.get('[data-testid="flaky-ready-message"]').should('be.visible')
    })

    it('flakes on a UI element that only renders about half the time', () => {
        cy.visit('/demo/flaky')
        cy.get('[data-testid="flaky-banner"]').should('exist')
    })
})

describe('Page Objects', () => {
    let courseId

    before(() => {
        cy.request('GET', '/api/courses').then((response) => {
            const course = response.body.courses.find((c) => c.slug === 'java-fundamentals')
            expect(course, `course with slug "java-fundamentals"`).to.exist
            courseId = course.id
        })
    })

    describe('Bad - no modularization', () => {
        it('enrolls, completes the course and views the certificate', () => {
            const name = faker.person.firstName()
            const email = faker.internet.email()
            const password = faker.internet.password({ length: 10 })
            cy.request('POST', '/api/auth/signup', { name, email, password, phone: '' })

            cy.visit(`/course/${courseId}`)

            cy.intercept('POST', '/api/enrollments').as('enroll')
            cy.get('[data-testid="enroll-button"]').click()
            cy.wait('@enroll')
            cy.get('[data-testid="enrollment-dashboard-link"]').click()

            cy.get('[data-testid^="enrolled-course-list-item-"]').first().click()

            cy.intercept('PATCH', '/api/enrollments/*/complete').as('complete')
            cy.get('[data-testid="complete-course-button"]').click()
            cy.wait('@complete')
            cy.get('[data-testid="certificate-button"]').click()

            cy.contains('Certificate of Completion').should('be.visible')
        })
    })

    describe('Good - custom commands', () => {
        beforeEach(() => {
            cy.createStudentUser()
            cy.visit(`/course/${courseId}`)
        })

        it('enrolls, completes the course and views the certificate', () => {
            cy.enrollInCurrentCourse()
            cy.openFirstEnrolledCourse()
            cy.completeCourseAndViewCertificate()

            cy.contains('Certificate of Completion').should('be.visible')
        })
    })

    describe('Great - custom commands + before/beforeEach/after (with cleanup)', () => {
        before(() => {
            cy.createStudentUser()
        })

        beforeEach(() => {
            cy.visit(`/course/${courseId}`)
        })

        after(() => {
            cy.request('DELETE', '/api/auth/me')
        })

        it('enrolls, completes the course and views the certificate', () => {
            cy.enrollInCurrentCourse()
            cy.openFirstEnrolledCourse()
            cy.completeCourseAndViewCertificate()

            cy.contains('Certificate of Completion').should('be.visible')
        })
    })
})

describe('Cy Prompt + Self Heal', () => {
    let courseId
    let sqlCourseId

    before(() => {
        cy.request('GET', '/api/courses').then((response) => {
            const course = response.body.courses.find((c) => c.slug === 'java-fundamentals')
            expect(course, `course with slug "java-fundamentals"`).to.exist
            courseId = course.id

            const sqlCourse = response.body.courses.find((c) => c.slug === 'sql-fundamentals')
            expect(sqlCourse, `course with slug "sql-fundamentals"`).to.exist
            sqlCourseId = sqlCourse.id
        })
    })

    describe('cy.prompt only', () => {
        beforeEach(() => {
            cy.createStudentUser()
            cy.visit(`/course/${courseId}`)
        })

        it('enrolls, completes the course and views the certificate, described in plain language', () => {
            cy.prompt([
                'Click the button to enroll in this course',
                'Click the link to go to the dashboard',
                'Click on the enrolled course in the list to open it',
                'Click the button to mark the course as complete',
                'Click the button to view the certificate',
                'Confirm the text "Certificate of Completion" is visible on the page',
            ])
        })
    })

    describe('Self-heal against an unstable label', () => {
        it('still enrolls even though the button text is different on every load', () => {
            cy.createStudentUser()
            cy.visit(`/course/${sqlCourseId}`)

            cy.prompt(['Click the blue button with id "enroll-button" to enroll in this course'])

            cy.get('[data-testid="enrollment-dashboard-link"]').should('be.visible')
        })
    })
})