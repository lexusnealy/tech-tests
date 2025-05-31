import React from 'react';
import Quiz from '../../client/src/components/Quiz';

describe('Quiz Component', () => {
  beforeEach(() => {
    // Mock the API call for each test
    cy.intercept('GET', '/api/questions/random', (req) => {
      req.reply({
        statusCode: 200,
        body: [
          {
            _id: '1',
            question: 'Test Question 1',
            answers: [
              { text: 'Answer 1', isCorrect: true },
              { text: 'Answer 2', isCorrect: false },
              { text: 'Answer 3', isCorrect: false },
              { text: 'Answer 4', isCorrect: false }
            ]
          },
          {
            _id: '2',
            question: 'Test Question 2',
            answers: [
              { text: 'Answer 1', isCorrect: false },
              { text: 'Answer 2', isCorrect: true },
              { text: 'Answer 3', isCorrect: false },
              { text: 'Answer 4', isCorrect: false }
            ]
          }
        ],
        delay: 100 // Add a small delay to simulate network latency
      })
    }).as('getQuestions')
  })

  it('renders without crashing', () => {
    cy.mount(<Quiz />);
    cy.get('[data-testid="quiz-container"]').should('be.visible');
  });

  it('displays the first question', () => {
    cy.mount(<Quiz />);
    cy.get('[data-testid="quiz-container"]').should('be.visible');
    cy.get('button').contains('Start Quiz').click();
    
    // Wait for API call to complete
    cy.wait('@getQuestions');
    
    // Wait for loading spinner to disappear and question to appear
    cy.get('[data-testid="loading"]').should('not.exist');
    cy.get('[data-testid="question"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="question"]').should('contain', 'Test Question 1');
  });

  it('allows selecting an answer', () => {
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    
    // Wait for API call to complete
    cy.wait('@getQuestions');
    
    // Wait for loading spinner to disappear and question to appear
    cy.get('[data-testid="loading"]').should('not.exist');
    cy.get('[data-testid="question"]', { timeout: 10000 }).should('be.visible');
    
    // Select the first answer
    cy.get('[data-testid="answer-option"]').first().click();
    cy.get('[data-testid="next-button"]').should('be.visible');
  });

  it('shows score after completing all questions', () => {
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    
    // Wait for API call to complete
    cy.wait('@getQuestions');
    
    // Wait for loading spinner to disappear and question to appear
    cy.get('[data-testid="loading"]').should('not.exist');
    cy.get('[data-testid="question"]', { timeout: 10000 }).should('be.visible');
    
    // Answer first question
    cy.get('[data-testid="answer-option"]').first().click();
    cy.get('[data-testid="next-button"]').click();
    
    // Answer second question
    cy.get('[data-testid="answer-option"]').first().click();
    cy.get('[data-testid="next-button"]').click();
    
    // Verify completion message
    cy.get('[data-testid="final-score"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="final-score"]').should('contain', 'Your score');
  });
}); 