// Create your test file here

it('How to use env varibales', () => {
    const username = Cypress.env('USERNAME');
    const password = Cypress.env('PASSWORD');
})
