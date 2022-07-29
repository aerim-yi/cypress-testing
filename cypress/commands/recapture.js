export const handleRecaptcha = (requestAlias) => (status) => {
    if (status == 406) {
        cy.wait(5000);
        cy.get('iframe[src*=recaptcha]').each((iframe) => {
            console.log('iframe', iframe)
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
