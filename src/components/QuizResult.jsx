import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function QuizResult() {
  const [calculatedScore, setCalculatedScore] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const { submittedAnswers } = location.state || {};

  const getAnswerClassName = (answer, question) => {
    if (answer === question.correct_answer) {
      return 'correct-answer';
    }
    if (answer === question.selectedAnswer) {
      return 'incorrect-answer';
    }
    return 'unselected-answer';
  };

  const getScoreColorClassName = (score) => {
    if (score <= 1) {
      return 'score-red';
    } else if (score >= 2 && score <= 3) {
      return 'score-yellow';
    } else if (score >= 4) {
      return 'score-green';
    }
    return '';
  };

  const backToCreateNewQuiz = () => {
    navigate('/');
  };

  useEffect(() => {
    if (submittedAnswers) {
      const score = submittedAnswers.filter(
        (question) => question.isCorrectAnswer
      ).length;
      setCalculatedScore(score);
    }
  }, [submittedAnswers]);

  if (!Array.isArray(submittedAnswers) || !submittedAnswers.length) {
    return (
      <div className="quiz-result">
        <div className="error-message">Can't find quiz results</div>
        <button onClick={() => navigate('/')}>Back to create new quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-result">
      <h1>RESULTS</h1>
      <div className="quiz-panel">
        <div className="quiz">
          {submittedAnswers.map((question) => (
            <div className="question" key={question.id}>
              <span>{question.question}</span>
              <div className="answers">
                {(question.answers || []).map((answer, index) => {
                  const className = getAnswerClassName(answer, question);
                  return (
                    <button key={index} className={className}>
                      {answer}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div
            className={`result-label ${getScoreColorClassName(
              calculatedScore
            )}`}
          >
            <div className="result-label-text">
              Your scored {calculatedScore} out of {submittedAnswers.length}
            </div>
          </div>
          <button className="renew-btn" onClick={backToCreateNewQuiz}>
            Create a new quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;
