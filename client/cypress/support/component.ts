import { mount } from 'cypress/react18';
import 'bootstrap/dist/css/bootstrap.min.css';

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);

// Example of a custom command for getting testId
Cypress.Commands.add('getBySel', (selector) => {
  return cy.get(`[data-testid="${selector}"]`);
}); 