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
  const unixExpDate = decodedToken.exp
  const dateExpDate = new Date(unixExpDate * 1000)
  console.log(dateExpDate > Date.now());
  
  if(dateExpDate > Date.now()){
    window.location.href = '/login'
    //console.log(decodedToken);
    
    authenticated = false
    //console.log('authenticated is false');
  }
  else {
    //console.log('authenticated is true');
    
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
