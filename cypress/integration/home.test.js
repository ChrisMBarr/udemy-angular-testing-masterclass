describe("Home Page", () => {
  beforeEach(() => {
    cy.fixture("courses.json").as("coursesJSON"); //provide some mock data and set an alias for it
    cy.server(); //start our mock backend server
    cy.route("/api/courses", "@coursesJSON").as("courses"); //Use the mock data at this URL, and alias it
    cy.visit("/");
  });

  it("should display a list of courses", () => {
    cy.contains("All Courses");
    cy.wait("@courses"); //wait for the data at the specified alias to be loaded
    cy.get("mat-card").should("have.length", 9);
  });

  it("should display the advanced courses", () => {
    cy.get(".mat-mdc-tab").should("have.length", 2);
    cy.get(".mat-mdc-tab").last().click();
    cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title").its("length").should("be.gt", 1);
    cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title").first().should("contain", "Angular Security Course");
  });
});
