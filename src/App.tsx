import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link, HashRouter } from 'react-router-dom';
import './App.css';
import AdminPage from './pages/admin/admin-page';
import GlobalProvider, { setRedirect, GlobalContext } from './contexts/global-context';
import LoginPage from './pages/admin/admin-login';
import authentication from './admin-auth';
import AdminLogout from './pages/admin/admin-logout';

function App() {
  return (
    <GlobalProvider>
      <Router getUserConfirmation={(a, b) => {
        console.log(a, b);
      }}>
        <div className="App">
          <Switch>
            <Route exact path="/admin/login" > <LoginPage /> </Route>
            <Route exact path="/admin/logout">{authentication.logout}</Route>
            <Route path="/admin" component={AdminPage} onEnter={() => { window.location.href = '/' }}/>
            <Route path="/"><NotFound></NotFound></Route>
          </Switch>
        </div>
      </Router >
    </GlobalProvider>
  );
}

function NotFound() {
  return <h2>Not Found this Page</h2>;
}

export default App;
