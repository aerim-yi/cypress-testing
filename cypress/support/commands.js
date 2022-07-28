//Navigate to NavBar

import cypress from "cypress";
import { contains } from "cypress/types/jquery";

Cypress.Commands.add('navigateNavBar', (page) => {
    cy.get('[data-test-id="navbarMainMenu"]').contains(page)/parent().as['page'];
    cy.get('@page').click({ force: true});
})

// Logout Feature

Cypress.Commands.add('logout', () => {
    cy.get('cerberus-navbar-user-avatar').click({ force: true });
    cy.get('cerberus-navbar-user-menu').find('.user-menu__menu-item').eq(1).click()
    ({ force: true });
    cy.get('cerberus-navbar-call-to-action').find('[data-test-id="signinButton"]').should('contain.text', 'sign in');
})

// Login Feature

Cypress.Commands.add('login', () => {
    cy.session('login', () => {
        cy.visit('/account/login');
        const walletUser = Cypress.env('walletUser');
        const walletPass = Cypress.env('walletPass');

        cy.intercept('POST', '**/auth2*').as('authenticateCredentials');

        cy.get('[data-test-d="emailInput2"]').click().type(walletUser);
        cy.get('[data-test-id="passwordInput2" ]').click().type(walletPass);
        cy.get('[data-test-id="loginButton" ]').click({ force: true });
        cy.wait('@authenticateCredentials')
            .its('response.statusCode')
            .should('be.oneOf', [406, 401, 200])
            .then(handleRecaptcha('@authenticateCredentials'));
    });
    cy.wait(100);
    cy.visit('/')
})

// Handle Recaptcha 

/**
 * Because we have a fallback between v3 and v2 recaptchas, we have two
 * 'reCAPTCHA' iframes on the page. We need to find the one for v2
 * (the one that contains the #recaptcha-anchor element) to confirm
 * the captcha.
 */
 export const handleRecaptcha = (requestAlias) => (status) => {
    if (status == 406) {
      cy.wait(500);
      cy.get('iframe[src*=recaptcha]').each((iframe) => {
        cy.wrap(iframe)
          .its('0.contentDocument.body')
          .should('not.be.undefined')
          .and('not.be.empty')
          .then(cy.wrap)
          .then((body) => {
            const anchor = body.find('#recaptcha-anchor');
            if (anchor.length) {
              cy.wrap(anchor)
                .should('be.visible')
                .click();
              cy.wait(requestAlias)
                .its('response.statusCode')
                .should('be.oneOf', [406, 401, 200]);
            }
          });
      })
    }
  };
  