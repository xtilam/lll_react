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
    if (timeNow - 1000 < time) { window.getSelection()?.removeAllRanges(); }
  }
  document.addEventListener('dblclick', evtClick)
  document.addEventListener('mousedown', () => { time = new Date().getTime(); })
})();

(window as any).loginDefault = () => {
  window.localStorage.token = 'eyJhbGciOiJIUzUxMiJ9.eyJjb2RlIjoiTlZDIiwidG9rZW5JZCI6NDAxOTkwNDQ2NjY3NDcxNCwiaWQiOjU3MTc0NzkzOTM1NjAwNSwiZXhwIjoxOTE3NjA0MzQxLCJpYXQiOjE2MDIyNDQzNDF9.lj8B8Nmt1rkZ7NLc2vRpWDbjz5q0KuK1j7kEuSCied9oFf2I6bXZa-pPrmjQPzyoVu4NN5fpvlZIeEBUj9hBAg';
}
(window as any).accs = function accs(value: string){
  console.log(value);
  console.log(this);
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
