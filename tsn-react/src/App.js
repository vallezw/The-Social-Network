import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';

// Navbar
import Navbar from './components/Navbar'
// Pages
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/signup" component={SignUp} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
