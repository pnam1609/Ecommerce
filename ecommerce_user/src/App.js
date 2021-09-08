import React from 'react'
import { Route,BrowserRouter as Router, Switch } from 'react-router-dom';
import "./assets/css/sb-admin-2.min.css"
// import "./assets/css/argon.min.css"
import routes from './routes'

function App() {
  return (
    <Router>
      {showContentMenus(routes)}
    </Router>
  )

  function showContentMenus(routes){
    var result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        );
      });
    }
    return <Switch>{result}</Switch>;
  }
}

export default App

