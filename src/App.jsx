import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import QuizCreation from './components/QuizCreation';
import QuizResult from './components/QuizResult';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<QuizCreation />} />
          <Route path="/quiz-results" element={<QuizResult />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
