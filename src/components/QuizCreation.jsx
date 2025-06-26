import { useState, useEffect } from 'react';
import QuizPanel from './QuizPanel';

function QuizCreation() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({
    categories: false,
    quiz: false,
  });
  const [error, setError] = useState({
    categories: false,
    quiz: false,
  });
  const [questions, setQuestions] = useState([]);

  const difficulties = ['easy', 'medium', 'hard'];

  const fetchCategories = async () => {
    try {
      setLoading((prev) => ({ ...prev, categories: true }));
      setError((prev) => ({ ...prev, categories: false }));

      const response = await fetch('https://opentdb.com/api_category.php');

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.trivia_categories && data.trivia_categories.length > 0) {
        setCategories(data.trivia_categories);
      } else {
        throw new Error('Cannot find categories!');
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        categories: 'Failed to load categories. ' + err,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading((prev) => ({ ...prev, quiz: true }));
      setError((prev) => ({ ...prev, quiz: false }));

      const response = await fetch(
        `https://opentdb.com/api.php?amount=5&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setQuestions(data.results);
      } else {
        throw new Error('Cannot find questions!');
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        quiz: 'Failed to create questions. Please try again. ' + err,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, quiz: false }));
    }
  };

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="quiz-creation">
      <h1>QUIZ MAKER</h1>
      {error.categories && (
        <div className="error-message">{error.categories}</div>
      )}
      {!error.categories && (
        <form onSubmit={handleCreateQuiz}>
          <div className="creation-form">
            {loading.categories ? (
              <div className="loading-message">Loading categories...</div>
            ) : (
              <select
                id="categorySelect"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}

            <select
              id="difficultySelect"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">Select difficulty</option>
              {difficulties.map((difficulty, index) => (
                <option key={index} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>

            <button
              type="submit"
              id="createBtn"
              className="create-btn"
              disabled={
                loading.quiz || !selectedCategory || !selectedDifficulty
              }
            >
              Create
            </button>
          </div>
        </form>
      )}

      <div className="quiz-panel">
        {loading.quiz && (
          <div className="loading-message">Loading questions...</div>
        )}
        {error.quiz && <div className="error-message">{error.quiz}</div>}
        {!loading.quiz && !error.quiz && questions.length > 0 && (
          <QuizPanel
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
            questions={questions}
          />
        )}
      </div>
    </div>
  );
}

export default QuizCreation;
