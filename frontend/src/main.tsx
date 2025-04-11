import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID="278409973236-2ip1nemhdhe5uj9oqbduhj5angffcjcr.apps.googleusercontent.com"

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);