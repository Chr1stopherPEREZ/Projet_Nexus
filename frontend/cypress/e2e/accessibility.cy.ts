/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('Has no detectable accessibility violations on load', () => {
    cy.checkA11y();
  });

  it('Has no detectable accessibility violations on the login page', () => {
    cy.visit('/auth/login');
    cy.injectAxe();
    cy.checkA11y();
  });

  it('Has no detectable accessibility violations on the dashboard page', () => {
    // This test assumes the user is already logged in
    // In a real test, you would need to log in first
    cy.visit('/dashboard');
    cy.injectAxe();
    cy.checkA11y();
  });

  it('Has no detectable accessibility violations on the lists page', () => {
    // This test assumes the user is already logged in
    // In a real test, you would need to log in first
    cy.visit('/lists');
    cy.injectAxe();
    cy.checkA11y();
  });
});
