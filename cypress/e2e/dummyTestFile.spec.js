// Create your test file here
it('visit GU website', () => {
    cy.visit('/')
    cy.get('cerberus-navbar-main-menu-item gu-simple-text').contains('market').click()
    cy.get('cerberus-navbar-main-menu-sub-item li').contains('star store').click()
})

it('login'), () => {
    it('How to use env varibales'), () => {
        const username = Cypress.env('USERNAME');
        const password = Cypress.env('PASSWORD');

        cy.intercept('POST', '**/auth2*').as('authenticateCredentials');

        cy.get('[data-test-id="emailInput2"]').click().type(username);
        cy.get('[data-test-id="passwordInput2" ]').click().type(password);
        cy.get('[data-test-id="loginButton"]').click({ force: true });
        cy.wait('@authenticateCredentials')
            .its('response.statusCode')
            .should('be.oneOf', [406, 401, 200])
            .then(recapture('@authenticateCredentials'));

    }
}