/// <reference types="cypress" />
import React from 'react'
import type { Question } from '../../client/src/models/Question'
import Quiz from '../../client/src/components/Quiz'

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

  it('renders the initial state correctly', () => {
    cy.mount(React.createElement(Quiz))
    cy.get('[data-testid="quiz-container"]').should('be.visible')
    cy.get('.btn.btn-primary').contains('Start Quiz').should('be.visible')
  })

  it('shows loading state when fetching questions', () => {
    cy.mount(React.createElement(Quiz))
    cy.get('.btn.btn-primary').contains('Start Quiz').should('be.visible').click()
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should('be.visible')
  })

  it('displays questions after loading', () => {
    cy.mount(React.createElement(Quiz))
    cy.get('.btn.btn-primary').contains('Start Quiz').click()
    
    // Wait for API call to complete
    cy.wait('@getQuestions')
    
    // Wait for loading spinner to disappear and question to appear
    cy.get('[data-testid="loading"]').should('not.exist')
    cy.get('[data-testid="question"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="question"]').should('contain', 'Test Question 1')
    
    // Check if answer options are displayed
    cy.get('[data-testid="answer-option"]').should('have.length', 4)
  })

  it('handles correct answer selection', () => {
    cy.mount(React.createElement(Quiz))
    cy.get('.btn.btn-primary').contains('Start Quiz').click()
    
    // Wait for API call to complete
    cy.wait('@getQuestions')
    
    // Wait for loading spinner to disappear and question to appear
    cy.get('[data-testid="loading"]').should('not.exist')
    cy.get('[data-testid="question"]', { timeout: 10000 }).should('be.visible')
    
    // Select the correct answer (first one in our mock)
    cy.get('[data-testid="answer-option"]').first().click()
    
    // Click next question button
    cy.get('[data-testid="next-button"]').click()
    
    // Verify we're on the second question
    cy.get('[data-testid="question"]').should('contain', 'Test Question 2')
  })

  it('shows completion message after all questions', () => {
    cy.mount(React.createElement(Quiz))
    cy.get('.btn.btn-primary').contains('Start Quiz').click()
    
    // Wait for API call to complete
    cy.wait('@getQuestions')
    
    // Wait for loading spinner to disappear and question to appear
    cy.get('[data-testid="loading"]').should('not.exist')
    cy.get('[data-testid="question"]', { timeout: 10000 }).should('be.visible')
    
    // Answer first question
    cy.get('[data-testid="answer-option"]').first().click()
    cy.get('[data-testid="next-button"]').click()
    
    // Answer second question
    cy.get('[data-testid="answer-option"]').first().click()
    cy.get('[data-testid="next-button"]').click()
    
    // Verify completion message
    cy.get('[data-testid="final-score"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="final-score"]').should('contain', 'Your score')
  })
}) 