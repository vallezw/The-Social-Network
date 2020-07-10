import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import themeFile from './util/theme'
import jwtDecode from 'jwt-decode'

// Components
import Navbar from './components/Navbar'
import AuthRoute from './util/AuthRoute'
// Pages
import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
//import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme(themeFile)

// Token stuff
let authenticated
const token = localStorage.FBIdToken
if(token){
  const decodedToken = jwtDecode(token)
  const ts = Date.now()
  const currentTime = Math.floor(ts/1000) - 7200
  if(decodedToken.exp < currentTime){
    window.location.href = '/login'
    authenticated = false
  }
  else {
    authenticated = true
  }
}


function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute exact path="/login" comp={login} authenticated={authenticated}/>
              <AuthRoute exact path="/signup" comp={signup} authenticated={authenticated} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
