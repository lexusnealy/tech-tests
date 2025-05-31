describe('Tech Quiz E2E', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001')
    })
  
    it('should display the quiz container and start button', () => {
      // Check if the quiz container is visible
      cy.get('[data-testid="quiz-container"]').should('be.visible')
      
      // Check if the start button is visible
      cy.get('.btn.btn-primary').contains('Start Quiz').should('be.visible')
    })
  
    it('should start the quiz when the start button is clicked', () => {
      // Click the start button
      cy.get('.btn.btn-primary').contains('Start Quiz').click()
      
      // Wait for the loading state to appear (if it does)
      cy.get('body').then($body => {
        if ($body.find('.spinner-border').length > 0) {
          cy.get('.spinner-border').should('be.visible')
          // Wait for the loading spinner to disappear
          cy.get('.spinner-border').should('not.exist')
        }
      })
      
      // Check if a question is displayed
      cy.get('[data-testid="question"]', { timeout: 10000 }).should('be.visible')
      
      // Check if answer options are displayed
      cy.get('[data-testid="answer-option"]', { timeout: 10000 }).should('have.length.at.least', 1)
    })
  
    it('should allow selecting an answer and moving to next question', () => {
      // Start the quiz
      cy.get('.btn.btn-primary').contains('Start Quiz').click()
      
      // Wait for questions to load
      cy.get('[data-testid="question"]', { timeout: 10000 }).should('be.visible')
      
      // Store the first question text
      let firstQuestionText: string
      cy.get('[data-testid="question"]')
        .invoke('text')
        .then(text => {
          firstQuestionText = text
        })
      
      // Select the first answer
      cy.get('[data-testid="answer-option"]').first().click()
      
      // Click next question button
      cy.get('[data-testid="next-button"]').click()
      
      // Verify we're on a new question
      cy.get('[data-testid="question"]').should('be.visible').then($newQuestion => {
        expect($newQuestion.text()).not.to.equal(firstQuestionText)
      })
    })
  
    it('should complete the quiz and show final score', () => {
      // Start the quiz
      cy.get('.btn.btn-primary').contains('Start Quiz').click()
      
      // Function to answer all questions
      const answerAllQuestions = (): void => {
        cy.get('body').then($body => {
          // If we see the final score, we're done
          if ($body.find('[data-testid="final-score"]').length > 0) {
            cy.get('[data-testid="final-score"]')
              .should('be.visible')
              .and('contain', 'Your score')
            return
          }
  
          // Answer current question and move to next
          cy.get('[data-testid="answer-option"]').first().click()
          cy.get('[data-testid="next-button"]').click()
          
          // Recursively handle next question
          answerAllQuestions()
        })
      }
  
      // Start answering questions
      answerAllQuestions()
    })
  
    it('should allow starting a new quiz after completion', () => {
      // Start the quiz
      cy.get('.btn.btn-primary').contains('Start Quiz').click()
      
      // Answer all questions to complete the quiz
      const completeQuiz = (): void => {
        cy.get('body').then($body => {
          if ($body.find('[data-testid="final-score"]').length > 0) {
            return
          }
          cy.get('[data-testid="answer-option"]').first().click()
          cy.get('[data-testid="next-button"]').click()
          completeQuiz()
        })
      }
      
      completeQuiz()
      
      // Verify final score is shown
      cy.get('[data-testid="final-score"]').should('be.visible')
      
      // Start new quiz
      cy.get('.btn.btn-primary').contains('Take New Quiz').click()
      
      // Verify we're back to questions
      cy.get('[data-testid="question"]').should('be.visible')
      cy.get('[data-testid="answer-option"]').should('have.length.at.least', 1)
    })
  }) 