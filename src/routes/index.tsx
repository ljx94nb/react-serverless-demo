import React from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import { Login, Home } from '@/pages';

function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/home" component={Home} exact />
        <Redirect to="/login" />
      </Switch>
    </HashRouter>
  );
}

export default Router;
