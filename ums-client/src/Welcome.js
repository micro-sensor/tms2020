import React, { Component } from 'react';
import './App.css';
import AppNavbar from "./AppNavbar";
import {Row, Card} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Welcome extends Component {
    renderLinks() {
        if (this.props.authenticated) {
            return (
                <Row>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Link href="https://tcs.ecs.baylor.edu/exams">Exam Area</Card.Link>
                            <Card.Text>
                                Take an exam or view your previous results here.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <LinkContainer to="/profile">
                                <Card.Link href="#">My Profile</Card.Link>
                            </LinkContainer>
                            <Card.Text>
                                View your profile information.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Row>
            )
        } else {
            return (
                <Row>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Link href="#" onClick={this.props.login}>Login</Card.Link>
                            <Card.Text>
                                Login to your account to get started!
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Row>
            )
        }
    }

    renderAdminLinks() {
        const { keycloak, authenticated } = this.props;
        if (authenticated &&
            (keycloak.tokenParsed.realm_access.roles.includes("admin")
                || keycloak.tokenParsed.realm_access.roles.includes("superadmin"))) {
            return (
                <>
                    <Row>
                        <h2>Administration tools</h2>
                    </Row>
                    <br/>
                    <Row>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Link href="https://tcs.ecs.baylor.edu/questions">Questions and Categories</Card.Link>
                                <Card.Text>
                                    Create and manage exam questions and categories here.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Link href="https://tcs.ecs.baylor.edu/config">Exam Configurations and Assignments</Card.Link>
                                <Card.Text>
                                    Configure and assign exams here.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Link href="https://tcs.ecs.baylor.edu/users">User Management</Card.Link>
                                <Card.Text>
                                    Search and manage users here.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Row>
                </>
            )
        }
        return null;
    }

    render() {
        console.log(this.props.keycloak);
        return (
            <div className="Welcome">
                <AppNavbar keycloak={this.props.keycloak} authenticated={this.props.authenticated} login={this.props.login}/>
                <div className='App-header'>
                    <br/>
                    <Row>
                        <h1>Welcome to the Texas Teacher Training System!</h1>
                    </Row>
                    <br/>
                    {this.renderLinks()}
                    <br/>
                    {this.renderAdminLinks()}
                </div>
            </div>
        );
    }
}
export default Welcome;
