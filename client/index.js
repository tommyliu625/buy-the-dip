import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Store from './Store';

ReactDOM.render(
  <Store>
    <Router>
      <App />
    </Router>
  </Store>,
  document.getElementById('app')
);
