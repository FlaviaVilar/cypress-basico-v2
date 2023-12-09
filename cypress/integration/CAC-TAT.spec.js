import { faker } from "@faker-js/faker";

/// <reference types="Cypress" />
describe("Central de Atendimento ao Cliente TAT", function () {
  let firstName = faker.person.firstName();
  let lastName = faker.person.lastName();
  let email = faker.internet.email();
  let phone = faker.number.int({ min: 111111111, max: 999999999 });
  let helpText = faker.lorem.paragraph();

  beforeEach(() => {
    cy.visit("./src/index.html");
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("Fill mandatory fields and send form", () => {
    cy.fillMandatoryFieldsAndSubmit(
      firstName,
      lastName,
      email,
      phone,
      helpText
    );
    cy.get(".success").should("contain", "Mensagem enviada com sucesso.");
  });

  it("Submit form with an invalid email format", () => {
    email = faker.lorem.word();
    cy.fillMandatoryFieldsAndSubmit(
      firstName,
      lastName,
      email,
      phone,
      helpText
    );
    cy.get('button[type="submit"]').click();
    cy.get(".error").should("contain", "Valide os campos obrigatórios!");
  });

  it("Validate phone field only accept numbers", () => {
    cy.get("#phone").type(faker.lorem.word());
    cy.get("#phone").should("have.value", "");
  });

  it("Displays an error message when the phone becomes mandatory", () => {
    cy.get("#phone-checkbox").check().should("be.checked");
    cy.get("#firstName").type(faker.person.firstName(), { delay: 0 });
    cy.get("#lastName").type(faker.person.lastName(), { delay: 0 });
    cy.get("#email").type(faker.internet.email(), { delay: 0 });
    cy.get("#open-text-area").type(faker.lorem.paragraph(), { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get(".error").should("contain", "Valide os campos obrigatórios!");
  });

  it("Fill and clean fields", () => {
    const name = faker.person.firstName();
    cy.get("#firstName").type(name, { delay: 0 }).should("have.value", name);
    cy.get("#firstName").clear().should("have.value", "");
  });

  it("Submit form not filling mandatory fields", () => {
    cy.get('button[type="submit"]').click();
    cy.get(".error").should("contain", "Valide os campos obrigatórios!");
  });

  it("Select product by text", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("Select product by value", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("Select product by index", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it("Check radio with type Feedback", () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("Check all radio types", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("Check both checkboxes and uncheck the last", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("Selec file from fixtures folder", () => {
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("cypress/fixtures/image.png")
      .should(($input) => {
        console.log($input);
        expect($input[0].files[0].name).to.equal("image.png");
      });
  });

  it("Selec file from fixtures folder simulating drag-and-drop", () => {
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("cypress/fixtures/image.png", { action: "drag-drop" })
      .should(($input) => {
        console.log($input);
        expect($input[0].files[0].name).to.equal("image.png");
      });
  });

  it("Selec file from fixtures using alias", () => {
    cy.fixture("image.png").as("sampleFile");
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("@sampleFile")
      .should(($input) => {
        console.log($input);
        expect($input[0].files[0].name).to.equal("image.png");
      });
  });
});
