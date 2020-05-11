import React, { Component } from 'react';
import LoggedInUserInfo from "./LoggedInUserInfo";
import AppNavbar from "./AppNavbar";
import history from './History';
import EditUsers from "./EditUsers";

/**
 * This will be the parent for all of the application's secured components.
 * Depending on the path, it will render either the profile view or the
 * edit users view.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
class Secured extends Component {
    componentDidMount() {
        if (this.props.authFinished && !this.props.authenticated) {
            this.props.login();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.authFinished && !this.props.authenticated) {
            this.props.login();
        }
    }

    /**
     * Decide whether to render the profile view or the edit users view
     * based on the path.
     *
     * @author J.R. Diehl
     * @version 0.1
     * @returns {*}
     */
    renderPage() {
        const noAccessStyles = {
            width: "100%",
            textAlign: "center",
            top: "120px",
            position: "relative",
            fontSize: "x-large",
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            fontWeight: "200"
        };
        if (this.props.match.path === "/profile" || history.location.pathname === "/profile" || history.location.pathname === "/profile/") {
            return (
                <>
                    <AppNavbar keycloak={this.props.keycloak} authenticated={this.props.authenticated} login={this.props.login} />
                    <div className='App-header'>
                        <LoggedInUserInfo keycloak={this.props.keycloak} />
                    </div>
                </>
            );
        } else if (this.props.match.path === "/users" || history.location.pathname === "/users" || history.location.pathname === "/users/") {
            if(this.props.keycloak.tokenParsed.realm_access.roles.includes("admin")
                || this.props.keycloak.tokenParsed.realm_access.roles.includes("superadmin"))
            {
                return (
                    <>
                        <AppNavbar keycloak={this.props.keycloak} authenticated={this.props.authenticated} login={this.props.login} />
                        <div className='App-header'>
                            <EditUsers keycloak={this.props.keycloak} authenticated={this.props.authenticated} />
                        </div>
                    </>
                )
            }
            else{
                return (
                    <>
                        <AppNavbar keycloak={this.props.keycloak} authenticated={this.props.authenticated} login={this.props.login} />
                        <div style={noAccessStyles}>
                            You do not have access to this service.
                        </div>
                    </>
                )
            }

        }
        return null;
    }

    render() {
        if (this.props.keycloak && this.props.authFinished) {
            if (this.props.authenticated) {
                return (
                    <div>
                        {this.renderPage()}
                    </div>
                );
            } else return (<div>Unable to authenticate!</div>)
        }
        return (
            <div>Initializing Keycloak...</div>
        );
    }
}
export default Secured;
