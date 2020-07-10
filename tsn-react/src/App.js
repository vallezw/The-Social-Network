import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';

// Navbar
import Navbar from './components/Navbar'
// Pages
import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'
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
              <Route exact path="/" component={home} />
              <Route exact path="/login" component={login} />
              <Route exact path="/signup" component={signup} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
