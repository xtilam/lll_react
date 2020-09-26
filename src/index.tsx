import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { App } from './App';
import moment from 'moment';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode >
  ,
  document.getElementById('root')
);
(() => {
  let time: number;
  (window as any).moment = moment;
  let evtClick = (evt: any) => {
    let timeNow = new Date().getTime();
    if (timeNow - 100 < time) { window.getSelection()?.removeAllRanges(); }
  }
  document.addEventListener('dblclick', evtClick)
  document.addEventListener('mousedown', () => { time = new Date().getTime(); })
})();

(window as any).loginDefault = () => {
  window.localStorage.token = 'eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlbklkIjozMDkyNjc4MjQxMTcxNDU1LCJhZG1pbklkIjo1NzE3NDc5MzkzNTYwMDUsImFkbWluQ29kZSI6Ik5WQyIsImV4cCI6MTkxMzU2MjYxOCwiaWF0IjoxNTk4MjAyNjE4fQ.VYT-aBPMcQtc2W67K-i5PLGyp6jEXTvV9zY7du0gZ_PbH4Qj3FDy0QzQEmLxIMhjYEAtKDZd_CuLRfHOjAvkig';
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
