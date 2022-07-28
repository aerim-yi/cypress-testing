const recapture = require('../commands/recapture').handleRecaptcha
const moment = require('moment')

describe('Star Store', () => {
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

    it('should match the star store url after clicking the star store dropdown menu', () => {
        cy.visit('/')
        cy.get('cerberus-navbar-main-menu-item gu-simple-text').contains('market').click()
        cy.get('cerberus-navbar-main-menu-sub-item li').contains('star store').click()
        cy.url().should('include', 'star-store')
    })

    it('should display restocking message when no cards are available', () => {
        cy.intercept('GET', 'https://game-legacy.ludia.nonprod.godsunchained.com/user/209022/shop', {})
        cy.visit('/star-store')
        cy.get('.emptyStateSection gu-heading-text').contains('the Star Store is Restocking')
    })

    it('has the same data as the mock card data', () => {
        cy.fixture('starStore.json').then((payload) => {
            const startTimeStamp = moment().toISOString();
            const endTimeStamp = moment().add(1, 'd').toISOString();
            payload.forEach(data => {
                data["start_timestamp"] = startTimeStamp
                data["end_timestamp"] = endTimeStamp
            })

            cy.intercept('GET', 'https://game-legacy.ludia.nonprod.godsunchained.com/user/209022/shop', payload).as('getActivities');
        })
        cy.visit('/star-store');
        cy.wait('@getActivities').then((interception) => {
            console.log('interception', interception)
        })

    })

    // count cards
    
    // check out card info

    // buy button

    // if no balance, say no balance, can't buy card

    // with balance, can buy card

    // cancel button



})
