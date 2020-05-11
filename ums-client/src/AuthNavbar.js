import React, {Component} from 'react';
import {Navbar, Nav, NavDropdown, Dropdown} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Logout from "./Logout";

/**
 * This is the navbar for authenticated users. It will only show the edit users
 * link if the logged in user is an admin or higher role.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
class AuthNavbar extends Component {
    /**
     * Nav components for all users
     *
     * @author J.R. Diehl
     * @version 0.1
     * @returns {*}
     */
    renderUserNav() {
        if (this.props.keycloak.tokenParsed.realm_access.roles.includes("user")) {
            return (
                <>
                    <LinkContainer exact to="/">
                        <Nav.Link href='#'>Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/profile">
                        <Nav.Link href='#'>Profile</Nav.Link>
                    </LinkContainer>
                </>
            );
        }
        return null;
    }

    /**
     * Nav components for admins and higher
     *
     * @author J.R. Diehl
     * @version 0.1
     * @returns {*}
     */
    renderAdminNav() {
        if (this.props.keycloak.tokenParsed.realm_access.roles.includes("admin")
                || this.props.keycloak.tokenParsed.realm_access.roles.includes("superadmin")) {
            return (
                <>
                    {/* <Nav.Link href='/users'>Edit Users</Nav.Link> */}
                    <Nav.Link href='https://tcs.ecs.baylor.edu/config'>Manage Content</Nav.Link>
                    <Nav.Link href='https://tcs.ecs.baylor.edu/questions'>Manage Questions</Nav.Link>
                </>
            )
        }
        return null;
    }

    renderAdminDropdowns() {
        if (this.props.keycloak.tokenParsed.realm_access.roles.includes("admin")
            || this.props.keycloak.tokenParsed.realm_access.roles.includes("superadmin")) {
            return (
                <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link}>Administration</Dropdown.Toggle>
                    <Dropdown.Menu renderOnMount={true} alignRight={true}>
                        <Dropdown.Item href="https://tcs.ecs.baylor.edu/questions">Question Management</Dropdown.Item>
                        <Dropdown.Item href="https://tcs.ecs.baylor.edu/config">Configuration Management</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )
        }
        return null;
    }

    render() {
        return (
            <Navbar bg='dark' variant='dark' static='top'>
                <span class="navbar-brand">Texas Teacher Training</span>
                {/* <LinkContainer exact to="/">
                    <Navbar.Brand href='#'>Texas Teacher Training</Navbar.Brand>
                </LinkContainer> */}
                <Nav className='mr-auto'>
                    {this.renderUserNav()}
                    {this.renderAdminNav()}
                </Nav>
                <Nav>
                    {this.renderAdminDropdowns()}
                    <Dropdown as={Nav.Item}>
                        <Dropdown.Toggle as={Nav.Link}>{this.props.keycloak.tokenParsed.name}</Dropdown.Toggle>
                        <Dropdown.Menu renderOnMount={true} alignRight={true}>
                            <LinkContainer exact to="/profile">
                                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                            </LinkContainer>
                            <Dropdown.Divider></Dropdown.Divider>
                            <Logout keycloak={this.props.keycloak} />
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* <NavDropdown title="Administration" id="basic-nav-dropdown" renderMenuOnMount={true}>
                        <NavDropdown.Item href="tcs.ecs.baylor.edu/questions">Question Management</NavDropdown.Item>
                        <NavDropdown.Item href="tcs.ecs.baylor.edu/config">Configuration Management</NavDropdown.Item>
                    </NavDropdown> */}
                    {/* <NavDropdown title={this.props.keycloak.tokenParsed.name} id="basic-nav-dropdown" renderMenuOnMount={true}>
                        <LinkContainer exact to="/profile">
                            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <Logout keycloak={this.props.keycloak} />
                    </NavDropdown> */}
                </Nav>
            </Navbar>
        );
    }
}

export default AuthNavbar;
