import React, {Component} from 'react';
import DeauthNavbar from "./DeauthNavbar";
import AuthNavbar from './AuthNavbar';

/**
 * This is the navbar for the application. It has two views:
 * one for unauthenticated users, and one for authenticated users.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
class AppNavbar extends Component {
    render() {
        if (this.props.authenticated && this.props.keycloak) {
            return <AuthNavbar keycloak={this.props.keycloak}/>;
        } else {
            return <DeauthNavbar login={this.props.login}/>;
        }
    }
}

export default AppNavbar;
