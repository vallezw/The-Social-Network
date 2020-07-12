import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import themeFile from './util/theme'
import jwtDecode from 'jwt-decode'
//Redux
import { Provider } from 'react-redux'
import store from './redux/store'
import { SET_AUTHENTICATED } from './redux/types'
import { logoutUser, getUserData } from './redux/actions/userActions'

// Components
import Navbar from './components/Layout/Navbar'
import AuthRoute from './util/AuthRoute'
// Pages
import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'
//import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import axios from 'axios';


const theme = createMuiTheme(themeFile)

// Token stuff
const token = localStorage.FBIdToken
if(token){
  const decodedToken = jwtDecode(token)
  const ts = Date.now()
  const currentTime = Math.floor(ts/1000) - 7200
  if(decodedToken.exp < currentTime){
    store.dispatch(logoutUser())
    window.location.href = '/login'
  }
  else {
    store.dispatch({ type: SET_AUTHENTICATED })
    axios.defaults.headers.common['Authorization'] = token
    store.dispatch(getUserData())
  }
}


function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute exact path="/login" comp={login} />
              <AuthRoute exact path="/signup" comp={signup} />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
