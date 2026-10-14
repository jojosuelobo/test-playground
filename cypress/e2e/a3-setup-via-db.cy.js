/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

// Fastest: the user is inserted directly in the database with a SQL query (cy.task -> pg).
// Needs the app running locally with access to its database, e.g.:
// CYPRESS_BASE_URL=http://localhost:3000 npx cypress run --spec cypress/e2e/a3-setup-via-db.cy.js
describe('Setup via database (SQL)', () => {
    let courseId
    let user

    before(() => {
        cy.task('db:query', { sql: 'SELECT id FROM "Course" WHERE slug = $1', params: ['java-fundamentals'] }).then((rows) => {
            expect(rows, `course with slug "java-fundamentals"`).to.have.length(1)
            courseId = rows[0].id
        })
    })

    beforeEach(() => {
        user = {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10 }),
        }

        cy.task('hashPassword', user.password).then((passwordHash) => {
            cy.task('db:query', {
                sql: 'INSERT INTO "User" (id, name, email, "passwordHash", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, now())',
                params: [user.name, user.email, passwordHash],
            })
        })

        // Logging in over the API only to get the session cookie
        cy.request('POST', '/api/auth/login', { email: user.email, password: user.password })
    })

    afterEach(() => {
        cy.task('db:query', { sql: 'DELETE FROM "User" WHERE email = $1', params: [user.email] })
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
