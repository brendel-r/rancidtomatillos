import { movieData } from "../../src/sampledata";

describe("Landing Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "https://rancid-tomatillos.herokuapp.com/api/v2/movies", {
      statusCode: 200,
      body: movieData
    })
      .visit("http://localhost:3000/")
  });

  it("should display an error if api response is not ok", () => {
    cy.intercept("GET", "https://rancid-tomatillos.herokuapp.com/api/v2/movies", {
      statusCode: 500,
      body: "Error loading movies"
    })
    cy.get("h2").contains("Something went wrong! Try again later!");
  });

  it("should display Rancid Tomatillos in the header", () => {
    cy.get("main header img").should('have.attr', "alt", "Rancid Tomatillos");
  });

  it("should display a list of movie cards with ratings", () => {
    cy.get("main").find(".movie-card").should("have.length", 8)
      .first().find('img').should('have.attr', "src", "https://image.tmdb.org/t/p/original//6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg")
      .get("p").first().contains('7')
      .get('img').last().should('have.attr', "src", "https://image.tmdb.org/t/p/original//kiX7UYfOpYrMFSAGbI6j1pFkLzQ.jpg")
      .get('p').last().contains('5')
  });

  it("should allow user to filter movies by ratings", () => {
    cy.get(".form-container").find("label").contains("Filter by rating")
      .get(".react-select__control").click()
      .get(".react-select__menu").find(".react-select__option").first().next().next().next().next().click()
      .get(".submit-button").click()
      .get(".movie-card").should("have.length", 4)
  });

  it("should allow user to clear filter and reload main movie list", () => {
    cy.get(".form-container").find("label").contains("Filter by rating")
      .get(".react-select__control").click()
      .get(".react-select__menu").find(".react-select__option").first().next().next().next().next().click()
      .get(".submit-button").click()
      .get(".movie-card").should("have.length", 4)
      .get(".clear-button").click()
      .get(".movie-card").should("have.length", 8)
  });

  it("should allow user to filter movies by ratings", () => {
    cy.get(".form-container").find("label").contains("Filter by rating")
      .get(".react-select__control").click()
      .get(".react-select__menu").find(".react-select__option").last().click()
      .get(".submit-button").click()
      .get(".movie-card").should("have.length", 0)
      .get("h2").contains("No movies found! Pick another rating.")
  });
});