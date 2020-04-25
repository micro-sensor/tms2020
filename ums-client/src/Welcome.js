import React, { Component } from 'react';
import './App.css';
import AppNavbar from "./AppNavbar";
import {Row, Card} from 'react-bootstrap';

/**
 * This is the welcome page. It is entirely unremarkable. Someone should make it better probably. Not me.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
class Welcome extends Component {
    render() {
        return (
            <div className="Welcome">
                <AppNavbar keycloak={this.props.keycloak} authenticated={this.props.authenticated} />
                <div className='App-header'>
                    <Row>
                        <p>Welcome to User Management!</p>
                    </Row>
                    <Row>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Take a Test</Card.Title>
                                <Card.Text>
                                    Placeholder text explaining exam-management service
                                </Card.Text>
                                <Card.Link href="http://tcs.ecs.baylor.edu/exams">Take a Test</Card.Link>
                            </Card.Body>
                        </Card>
                    </Row>
                </div>
            </div>
        );
    }
}
export default Welcome;
