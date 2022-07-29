import { handleRecaptcha } from '../commands/recapture';

const recapture = require('../commands/recapture')

Cypress.Commands.add('recapture', recapture)

Cypress.Commands.add('navigateNavBar', (page) => {
  cy.get('[data-test-id="navbarMainMenu"]').contains(page).parent().as('page');
  cy.get('@page').click({ force: true });
});

Cypress.Commands.add('login', () => {
    cy.session('login', () => {
      cy.visit('/account/login');
      const walletUser = Cypress.env('USERNAME');
      const walletPass = Cypress.env('PASSWORD');
      cy.intercept('POST', '**/auth2*').as('authenticateCredentials');
      cy.get('[data-test-id="emailInput2"]').click().type(walletUser);
      cy.get('[data-test-id="passwordInput2" ]').click().type(walletPass);
      cy.get('[data-test-id="loginButton"]').click({ force: true });
      cy.wait('@authenticateCredentials')
        .its('response.statusCode')
        .should('be.oneOf', [406, 401, 200])
        .then(handleRecaptcha('@authenticateCredentials'));
    });
    cy.wait(100);
    cy.visit('/');
  });

// Cypress.Commands.add("shouldNotBeActionable", { prevSubject: "element" }, (subject, done) => {
//   cy.once("fail", (err) => {
//     expect(err.message).to.include("`cy.click()` failed because this element");
//     expect(err.message).to.include("is being covered by another element");
//     done();
//   });

//   cy.wrap(subject).click(position, { timeout: 100 }).then(() =>
//     done(new Error("Expected element NOT to be clickable, but click() succeeded")));
// });
