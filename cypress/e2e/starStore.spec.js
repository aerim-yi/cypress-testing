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

    it('should navigate to star store page when access via the navbar', () => {
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

    it('should show purchase menu when the buy button is clicked - use mock data', () => {
        cy.fixture('starStore.json').then((payload) => {
            const startTimeStamp = moment().toISOString();
            const endTimeStamp = moment().add(1, 'd').toISOString();
            payload.forEach(data => {
                data["start_timestamp"] = startTimeStamp
                data["end_timestamp"] = endTimeStamp
            })

            cy.intercept('GET', 'https://game-legacy.ludia.nonprod.godsunchained.com/user/209022/shop', payload);
        })
        cy.visit('/star-store');
        cy.get('.storeSection__specials__item').shadow().find('.middleSection__cta').eq(0).click()
    })


    it('should show insuffucent fund menu when the buy button is clicked - use mock data', () => {
        cy.fixture('starStore.json').then((payload) => {
            const startTimeStamp = moment().toISOString();
            const endTimeStamp = moment().add(1, 'd').toISOString();
            payload.forEach(data => {
                data["start_timestamp"] = startTimeStamp
                data["end_timestamp"] = endTimeStamp
            })

            cy.intercept('GET', 'https://game-legacy.ludia.nonprod.godsunchained.com/user/209022/shop', payload);
        })
        cy.visit('/star-store');
        cy.get('.storeSection__specials__item').shadow().find('.middleSection__cta').eq(1).click()
        cy.get('cerberus-modal-window').find('.ctaSection__primary').click()
        cy.get('.cerberusModal__content gu-heading-text').contains('NOT ENOUGH STARS!')
    })
})
