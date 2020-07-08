import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/training">Training</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Switch>
          <Route exact path="/">
            Home
          </Route>
          <Route path="/training">
            Training
          </Route>
          <Route path="*">
            Not Found
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
