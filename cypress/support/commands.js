
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', (firstName, lastName, email, phone, helpText) => {
    cy.get('#firstName').type(firstName, {delay: 0});
    cy.get('#lastName').type(lastName, {delay: 0});
    cy.get('#email').type(email, {delay: 0});
    cy.get('#phone').type(phone, {delay: 0});
    cy.get('#open-text-area').type(helpText, {delay: 0})
    cy.get('button[type="submit"]').click();
});
