import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

// Nav Stuff
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
// Icons
import Notifications from '@material-ui/icons/Notifications'
import AddIcon from '@material-ui/icons/Add';
import { Tooltip } from '@material-ui/core';

class Navigationbar extends Component{
  render(){
    const { authenticated } = this.props
    return(
      <Navbar variant="light"expand="lg">
        <Navbar.Brand href="/">The Social Network</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        { authenticated ? (
          <Fragment>
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Button>
                <Tooltip title="Create a Post!">
                  <AddIcon color="primary"/>
                </Tooltip>
              </Button>
              <Button>
                <Tooltip title="Notifications">
                  <Notifications color="primary"/>
                </Tooltip>
              </Button>
            </Nav>
          </Navbar.Collapse>
          </Fragment>
        ): (
          <Fragment>
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="login">Log In</Nav.Link>
              <Nav.Link href="signup">Sign Up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Fragment>
        )}
      </Navbar>
    )
  }
}

Navigationbar.propTypes = {
  authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
})

export default connect(mapStateToProps)(Navigationbar)