import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function QuizPanel({ questions }) {
  const [proceedQuestions, setProceedQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const navigate = useNavigate();

  const randomizeArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const decodeHTMLEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const allQuestionsAnswered =
    Object.keys(answeredQuestions).length === (questions || []).length;

  const handleAnswerSelect = (questionId, answer) => {
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    const submittedAnswers = proceedQuestions.map((question) => ({
      ...question,
      selectedAnswer: answeredQuestions[question.id],
      isCorrectAnswer:
        answeredQuestions[question.id] === question.correct_answer,
    }));
    navigate('/quiz-results', {
      state: {
        submittedAnswers,
      },
    });
  };

  useEffect(() => {
    const customQuestions = (questions || [])
      .filter(
        (question) =>
          question &&
          question.incorrect_answers &&
          Array.isArray(question.incorrect_answers) &&
          question.correct_answer &&
          question.question
      )
      .map((question, index) => {
        const decodedQuestion = decodeHTMLEntities(question.question);
        const decodedCorrectAnswer = decodeHTMLEntities(
          question.correct_answer
        );
        const decodedIncorrectAnswers = question.incorrect_answers.map(
          (answer) => decodeHTMLEntities(answer)
        );
        const answers = randomizeArray([
          ...decodedIncorrectAnswers,
          decodedCorrectAnswer,
        ]);

        return {
          ...question,
          id: index,
          question: decodedQuestion,
          correct_answer: decodedCorrectAnswer,
          incorrect_answers: decodedIncorrectAnswers,
          answers,
        };
      });
    setProceedQuestions(customQuestions);
  }, [questions]);

  return (
    <div className="quiz">
      {proceedQuestions.map((question) => (
        <div className="question" key={question.id}>
          <span>{question.question || ''}</span>
          <div className="answers">
            {(question.answers || []).map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question.id, answer)}
                className={
                  answer === answeredQuestions[question.id]
                    ? 'selected-answer'
                    : 'unselected-answer'
                }
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      ))}
      {allQuestionsAnswered && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}
    </div>
  );
}

export default QuizPanel;
