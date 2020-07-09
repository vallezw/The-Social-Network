import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import NavDropdown from 'react-bootstrap/NavDropdown'

export default function Navigationbar(){
  return(
    <Navbar variant="light"expand="lg">
      <Navbar.Brand href="/">The Social Network</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="login">Log In</Nav.Link>
          <Nav.Link href="signup">Sign Up</Nav.Link>
          {/* <NavDropdown title="Addon for Browser" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Chrome</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.2">Firefox</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.3">Opera</NavDropdown.Item>
          </NavDropdown> */}
        </Nav>
        {/* <Form inline>
          <FormControl type="text" placeholder="Search for Video" className="mr-sm-2" />
          <Button variant="outline-success">Search</Button>
        </Form> */}
      </Navbar.Collapse>
    </Navbar>
  )
}