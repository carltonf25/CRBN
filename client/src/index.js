import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker, { unregister } from './registerServiceWorker';
import { BrowserRouter as Routes } from 'react-router-dom';


ReactDOM.render(<Routes><App /></Routes>, document.getElementById('root'));

unregister()
