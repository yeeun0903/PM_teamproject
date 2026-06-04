import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ReactGA from 'react-ga4';
import TagManager from 'react-gtm-module';

TagManager.initialize({ gtmId: 'GTM-TSFSN39Q' });
ReactGA.initialize('G-6G86NR91T4');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
