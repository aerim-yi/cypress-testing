const recapture = require('../commands/recapture').handleRecaptcha

describe('dummy test suite to run the login flow', () => {
    beforeEach(() => {
        const username = Cypress.env('USERNAME');
        const password = Cypress.env('PASSWORD');

        cy.session('login', () => {
            cy.intercept('POST', '**/auth2*').as('authenticateCredentials');
            cy.visit('/account/login')

            cy.get('[data-test-id="emailInput2"]').click().type(username);
            cy.get('[data-test-id="passwordInput2" ]').click().type(password);
            cy.get('[data-test-id="loginButton"]').click({ force: true });
            cy.wait('@authenticateCredentials')
                .its('response.statusCode')
                .should('be.oneOf', [406, 401, 200])
                .then(recapture('@authenticateCredentials'));

            cy.url().should('not.contain', '/account/login')
        })
    })

    it('dummy test to see login flow works', () => {
        cy.visit('/')
    })
})
