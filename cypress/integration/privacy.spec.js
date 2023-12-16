Cypress._.times(5, () => {
    it("Test privacy page", () => {
        cy.visit('./src/privacy.html');
        cy.get('#white-background p').should('contain', 'Não salvamos dados submetidos no formulário da aplicação CAC TAT.')
    });
    
})