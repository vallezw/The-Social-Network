import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';

// Navbar
import Navbar from './components/Navbar'
// Pages
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
//import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF7F50',
    },
    secondary: {
      main: '#FF8C00',
    },
  },
})

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={LogIn} />
              <Route exact path="/signup" component={SignUp} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
