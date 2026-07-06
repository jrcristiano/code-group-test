import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import { App } from './app/App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/home.css';
import './styles/not-found.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
