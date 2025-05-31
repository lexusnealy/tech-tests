import { useState, useEffect } from 'react';
import type { Question } from '../models/Question';
import { getQuestions } from '../services/questionApi';

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const getRandomQuestions = async () => {
    try {
      setIsLoading(true);
      const questions = await getQuestions();

      if (!questions) {
        throw new Error('something went wrong!');
      }

      setQuestions(questions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerClick = (isCorrect: boolean, index: number) => {
    setSelectedAnswer(index);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleStartQuiz = async () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    await getRandomQuestions();
  };

  if (!quizStarted) {
    return (
      <div className="p-4 text-center" data-testid="quiz-container">
        <button className="btn btn-primary d-inline-block mx-auto" onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" data-testid="quiz-container">
        <div className="spinner-border text-primary" role="status" data-testid="loading">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="card p-4 text-center" data-testid="quiz-container">
        <h2>Quiz Completed</h2>
        <div className="alert alert-success" data-testid="final-score">
          Your score: {score}/{questions.length}
        </div>
        <button className="btn btn-primary d-inline-block mx-auto" onClick={handleStartQuiz}>
          Take New Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" data-testid="quiz-container">
        <div className="spinner-border text-primary" role="status" data-testid="loading">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className='card p-4' data-testid="quiz-container">
      <h2 data-testid="question">{currentQuestion.question}</h2>
      <div className="mt-3">
      {currentQuestion.answers.map((answer, index) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <button 
            className={`btn ${selectedAnswer === index ? 'btn-success' : 'btn-primary'}`}
            data-testid="answer-option"
            onClick={() => handleAnswerClick(answer.isCorrect, index)}
            disabled={selectedAnswer !== null}
          >
            {index + 1}
          </button>
          <div className="alert alert-secondary mb-0 ms-2 flex-grow-1">{answer.text}</div>
        </div>
      ))}
      </div>
      {selectedAnswer !== null && (
        <button 
          className="btn btn-primary mt-3" 
          data-testid="next-button"
          onClick={handleNextQuestion}
        >
          Next Question
        </button>
      )}
    </div>
  );
};

export default Quiz;