import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/landingpage';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Error from '../components/Error';
import Quiz from '../pages/Quiz';
import QuizQuestions from '../pages/QuizQuestion';
import QuizCompleted from '../pages/QuizCompleted';
import Analysis from '../pages/Analysis';
import Parents from '../pages/Parents';
import Game from '../pages/Game';
import { PronunciationGame } from '../pages/games/PronunciationGame';
import { MathGame } from '../pages/games/MathGame';
import { MemoryGame } from '../pages/games/MemoryGame';
import { CreativeThinkingGame } from '../pages/games/CreativeThinkingGame';
import ChatBot from '../pages/ChatBot';
import ChatbotWrapper from '../components/ChatbotWrapper';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '*',
    element: <Error/>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/quiz',
    element: <Quiz />,
  },
  {
    path:'/quiz/:id',
    element: <QuizQuestions />,
  },
  {
    path:'/quiz-completed',
    element: <QuizCompleted />,
  },
  {
    path: '/analysis',
    element: <Analysis />,
  },
  {
    path: '/parents',
    element: <Parents />,
  },
  // Game routes
  {
    path: '/games',
    element: <Game />,
  },
  {
    path: '/games/pronunciation',
    element: <PronunciationGame />,
  },
  {
    path: '/games/math',
    element: <MathGame />,
  },
  {
    path: '/games/memory',
    element: <MemoryGame />,
  },
  {
    path: '/games/creative',
    element: <CreativeThinkingGame />,
  }
]);

export default router;