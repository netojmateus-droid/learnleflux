import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@fontsource/inter/latin.css';
import '@fontsource/lexend/latin.css';
import './styles/globals.css';
import { registerServiceWorker } from './registerServiceWorker';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

const appTree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (googleClientId) {
  root.render(
    <GoogleOAuthProvider clientId={googleClientId}>{appTree}</GoogleOAuthProvider>
  );
} else {
  console.warn('Google OAuth client ID not configured. Google sign-in is disabled.');
  root.render(appTree);
}

registerServiceWorker();