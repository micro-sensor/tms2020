import React, {Component} from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'

/**
 * This is the navbar for unauthenticated users.
 * It shows a link to the welcome page and a link to the profile
 * view, which will force them to login if clicked.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
class DeauthNavbar extends Component {
    render() {
        return (
            <Navbar bg='dark' variant='dark' static='top'>
                <span class="navbar-brand">Texas Teacher Training</span>
                {/* <LinkContainer exact to="/">
                    <Navbar.Brand href='#'>Texas Teacher Training</Navbar.Brand>
                </LinkContainer> */}
                <Nav className='mr-auto'>
                    <LinkContainer exact to="/">
                        <Nav.Link href='#'>Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/profile">
                        <Nav.Link href='#'>Profile</Nav.Link>
                    </LinkContainer>
                </Nav>
                <Nav>
                    <Nav.Link onClick={this.props.login}>
                        Login &nbsp;
                    </Nav.Link>
                </Nav>
            </Navbar>
        );
    }
}

export default DeauthNavbar;
