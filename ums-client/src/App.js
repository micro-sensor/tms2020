import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route } from 'react-router-dom';
import Keycloak from 'keycloak-js';
import Secured from './Secured';
import './App.css';
import Welcome from "./Welcome";
import EditUsers from "./EditUsers";

const TITLE = 'UMS';

/**
 * This provides a router to the welcome page, profile view, and
 * edit users page. It is the application root.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keycloak: null,
            authenticated: false,
            authFinished: false
        };
    }

    componentDidMount() {
        this.setState({
            keycloak: null,
            authenticated: false,
            authFinished: false
        });
        const keycloakInstance = Keycloak('keycloak.json');
        keycloakInstance.init({onLoad: 'check-sso'}).success((authenticated) => {
            this.setState({
                keycloak: keycloakInstance,
                authenticated: authenticated,
                authFinished: true
            });
            console.log(authenticated);
        }).error(() => {
            this.setState({
                keycloak: null,
                authenticated: false,
                authFinished: true
            });
        });
    }

    login = () => {
        this.setState({
            keycloak: null,
            authenticated: false,
            authFinished: false
        });
        const keycloakInstance = Keycloak('keycloak.json');
        keycloakInstance.init({onLoad: 'login-required'}).success((authenticated) => {
            this.setState({
                keycloak: keycloakInstance,
                authenticated: authenticated,
                authFinished: true
            });
            console.log(authenticated);
        }).error(() => {
            this.setState({
                keycloak: null,
                authenticated: false,
                authFinished: true
            });
        });
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>{ TITLE }</title>
                </Helmet>
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                  <div>
                    <Route exact path="/" render={(props) =>
                        <Welcome {...props} keycloak={this.state.keycloak} authenticated={this.state.authenticated} login={this.login} />
                    } />
                    <Route path='/profile' render={(props) =>
                        <Secured {...props} keycloak={this.state.keycloak} authenticated={this.state.authenticated} authFinished={this.state.authFinished} login={this.login} />
                    } />
                    <Route path='/users' render={(props) =>
                        // <div className='App-header'>
                        //     <EditUsers keycloak={this.props.keycloak} authenticated={this.props.authenticated} />
                        // </div>
                        <Secured {...props} keycloak={this.state.keycloak} authenticated={this.state.authenticated} authFinished={this.state.authFinished} login={this.login} />
                    } />
                  </div>
                </BrowserRouter>
            </>
        );
    }
}
export default App;
