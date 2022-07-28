import cypress from "cypress";
import { contains } from "cypress/types/jquery";

const recapture = require('../commands/recapture')

Cypress.Commands.add('recapture', recapture)

// Cypress.Commands.add('navigateNavBar', (page) => {
//   cy.get('[data-test-id="navbarMainMenu"]').contains(page).parent().as('page');
//   cy.get('@page').click({ force: true });
// });

// Cypress.Commands.add("shouldNotBeActionable", { prevSubject: "element" }, (subject, done) => {
//   cy.once("fail", (err) => {
//     expect(err.message).to.include("`cy.click()` failed because this element");
//     expect(err.message).to.include("is being covered by another element");
//     done();
//   });

//   cy.wrap(subject).click(position, { timeout: 100 }).then(() =>
//     done(new Error("Expected element NOT to be clickable, but click() succeeded")));
// });
