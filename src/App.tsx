import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import ScreenProvider from './contexts/screen-context';
import LoginPage from './pages/admin/admin-login';
import AdminLogout from './pages/admin/admin-logout';
import AdminPage from './pages/admin/admin-page';

export function App() {
  return (
    <ScreenProvider>
      <Router>
        <div className="App">
          <input type="text" style={{position: 'fixed', top: -99}} id="lost-focus"></input>
          <Switch>
            <Route exact path="/admin/login" component={LoginPage}></Route>
            <Route exact path="/admin/logout" render={() => {
              return <AdminLogout />;
            }}></Route>
            <Route path="/admin" component={AdminPage} />
            <Route path="/"><NotFound></NotFound></Route>
          </Switch>
        </div>
      </Router >
    </ScreenProvider>
  );
}
function NotFound() {
  return (<div>
    <h2>Not Found</h2>
    <h2><Link to="/admin" children="Go to Admin Page :)"/></h2>
  </div>);
}
 

