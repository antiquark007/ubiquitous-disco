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
  },{
    path: '/quiz',
    element: <Quiz />,
  }
]);

export default router;
