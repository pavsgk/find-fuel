import React from 'react';
import ReactDOM from 'react-dom/client';
import './reset.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

if (process.env.NODE_ENV === 'development') {
    require('./mocks/browser');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
