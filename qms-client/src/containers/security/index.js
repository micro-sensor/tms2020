import React, { Component } from "react";
import Keycloak from "keycloak-js";
import TopLevelContainer from "../TopLevelContainer";
import { CircularProgress } from "@material-ui/core";
import api from "api";

export function intercept(keycloak: Object) {
  api.interceptors.request.use(config => {
    return new Promise((resolve, reject) => {
      if (keycloak && keycloak.token) {
        // this function updates token if expired
        // it is smart enough to not spam requests to Keycloak server all the time
        // by default it refreshes token only if expired, or going to expire withing 5 seconds
        keycloak
          .updateToken()
          .success(() => {
            config.headers = {
              ...config.headers,
              ...{ Authorization: "Bearer " + keycloak.token }
            };
            resolve(config);
          })
          .error(() => {
            keycloak.login();
            reject("Failed to refresh token");
          });
      } else {
        reject("No token");
      }
    });
  });
}

class Secured extends Component {
  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false };
  }

  componentDidMount() {
    const keycloak = Keycloak(process.env.PUBLIC_URL + "/keycloak.json");
    keycloak.init({ onLoad: "login-required" }).success(authenticated => {
      this.setState({ keycloak: keycloak, authenticated: authenticated });
      if (authenticated) {
        intercept(keycloak);
      }
    });
  }

  logout = () => {
    this.state.keycloak.logout();
  };

  render() {
    const noAccessStyles = {
      width: "100%",
      textAlign: "center",
      top: "120px",
      position: "relative",
      fontSize: "x-large",
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      fontWeight: "200"
    };

    if (this.state.keycloak) {
      if (this.state.authenticated) {
        if (
          this.state.keycloak.tokenParsed.realm_access.roles.includes("admin")
        ) {
          return (
            <TopLevelContainer
              logout={this.logout}
              name={this.state.keycloak.tokenParsed.name}
            />
          );
        } else {
          return (
            <div style={noAccessStyles}>
              You do not have access to this service.
            </div>
          );
        }
      } else {
        return <div style={noAccessStyles}>Unable to authenticate!</div>;
      }
    }
    return (
      <div>
        <CircularProgress
          style={{
            position: "absolute",
            top: "calc(50% - 100px)",
            left: "calc(50% - 20px)"
          }}
        />
      </div>
    );
  }
}
export default Secured;
