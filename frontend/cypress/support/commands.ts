/// <reference types="cypress" />
/// <reference types="cypress-axe" />

// Import axe-core for accessibility testing
import 'cypress-axe';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Add custom login command for testing
Cypress.Commands.add('login', (username: string, role: string) => {
  cy.visit('/auth/login');
  cy.get('input[formControlName="username"]').type(username);
  cy.get('select[formControlName="role"]').select(role);
  cy.get('button[type="submit"]').click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, role: string): Chainable<void>
      // Add types for axe commands
      injectAxe(): Chainable<void>
      checkA11y(
        context?: string | Node | null,
        options?: any,
        violationCallback?: (violations: any) => void,
        skipFailures?: boolean
      ): Chainable<void>
    }
  }
}
