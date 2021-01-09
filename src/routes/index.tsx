import React from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { Login, Home } from '@/pages'

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/home" component={Home} exact />
        <Redirect to="/login" />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
