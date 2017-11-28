import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import allReducers from './reducers';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';





import registerServiceWorker from './utils/registerServiceWorker';


const store = createStore(
    allReducers,
    applyMiddleware(thunk, promise)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>

  , document.getElementById('root'));
registerServiceWorker();
