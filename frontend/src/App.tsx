import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './router/router';
import ChatbotWrapper from './components/ChatbotWrapper';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ChatbotWrapper />
    </>
  );
}

export default App;