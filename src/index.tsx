import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './styles/index.scss';
import Store from './store/index';
import { Provider } from 'mobx-react';
import mitt from 'mitt';

const emitter = mitt();
window.emitter = emitter;

declare global {
  interface Window {
    tcb: any;
    indexedDB: any;
    AMap: any;
    Loca: any;
    openInfoWin: any;
    emitter: any;
    webkitSpeechRecognition: any;
    turf: any;
  }
}

ReactDOM.render(
  <Provider {...Store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
