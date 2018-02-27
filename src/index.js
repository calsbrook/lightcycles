import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import CanvasComponent from './CanvasComponent'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
