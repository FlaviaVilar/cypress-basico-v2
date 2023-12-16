import { faker } from "@faker-js/faker";

/// <reference types="Cypress" />
describe("Central de Atendimento ao Cliente TAT", function () {
  const THREE_SECONDS_IN_MS = 3000;
  let firstName = faker.person.firstName();
  let lastName = faker.person.lastName();
  let email = faker.internet.email();
  let phone = faker.number.int({ min: 111111111, max: 999999999 });
  let helpText = faker.lorem.paragraph();

  beforeEach(() => {
    cy.visit("./src/index.html");
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  Cypress._.times(5, () => {
    // using Lodash to run same test 5 times
    it("Fill mandatory fields and send form", () => {
      cy.clock();

      cy.fillMandatoryFieldsAndSubmit(
        firstName,
        lastName,
        email,
        phone,
        helpText
      );

      cy.get(".success").should("contain", "Mensagem enviada com sucesso.");
      cy.tick(THREE_SECONDS_IN_MS); // clock and tick used to freeze and go foward with time
      cy.get(".success").should("not.be.visible");
    });
  });

  it("Submit form with an invalid email format", () => {
    cy.clock();

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
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("Validate phone field only accept numbers", () => {
    cy.get("#phone").type(faker.lorem.word());
    cy.get("#phone").should("have.value", "");
  });

  it("Displays an error message when the phone becomes mandatory", () => {
    cy.clock();

    cy.get("#phone-checkbox").check().should("be.checked");
    cy.get("#firstName").type(faker.person.firstName(), { delay: 0 });
    cy.get("#lastName").type(faker.person.lastName(), { delay: 0 });
    cy.get("#email").type(faker.internet.email(), { delay: 0 });
    cy.get("#open-text-area").type(faker.lorem.paragraph(), { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get(".error").should("contain", "Valide os campos obrigatórios!");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("Fill and clean fields", () => {
    const name = faker.person.firstName();
    cy.get("#firstName").type(name, { delay: 0 }).should("have.value", name);
    cy.get("#firstName").clear().should("have.value", "");
  });

  it("Submit form not filling mandatory fields", () => {
    cy.clock();

    cy.get('button[type="submit"]').click();
    cy.get(".error").should("contain", "Valide os campos obrigatórios!");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
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

  it("Validate opening link in another tab without clicking", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("Validate opening link in another tab removing target", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();
    cy.get("#white-background p").should(
      "contain",
      "Não salvamos dados submetidos no formulário da aplicação CAC TAT."
    );
  });

  it("Invoke and hive success and error messages on the screen", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("Fill text area using invoke", () => {
    const longText = Cypress._.repeat("123456789", 20); //using Lodash to repeat a val 20 times, creating a long number

    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("Make a HTTP request", () => {
    cy.request("https://cac-tat.s3.eu-central-1.amazonaws.com/index.html").then(
      (response) => {
        const { status, statusText, body } = response;
        expect(status).to.equal(200);
        expect(statusText).to.equal("OK");
        expect(body).to.include("CAC TAT");
      }
    );
  });

  it("Find hidden cat", () => {
    cy.get("#cat")
    .invoke("show")
    .should("be.visible");

    cy.get('#title').invoke('text', 'CAT TAT'); 
    cy.get('#subtitle').invoke('text', 'I ❤️ cats')
  });
});
