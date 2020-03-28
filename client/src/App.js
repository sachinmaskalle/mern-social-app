import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Landing from '../src/components/layout/Landing';
import Navbar from '../src/components/layout/Navbar';
import { loadUser } from './actions/auth-action';
import setAuthToken from './utilities/setAuthToken';
import Routes from './components/routing/Routes';

//Redux
import { Provider } from 'react-redux';
import store from './store';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <div className='App'>
      <Provider store={store}>
        <Router>
          <Fragment>
            <Navbar />
            <Switch>
                <Route exact path='/' component={Landing} />
                <Route component={Routes} />
            </Switch>
          </Fragment>
        </Router>
      </Provider>
    </div>
  );
};

export default App;
