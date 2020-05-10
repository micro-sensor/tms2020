import React, { Component } from "react";
import Keycloak from "keycloak-js";
import TopLevelContainer from "../TopLevelContainer";
import {CircularProgress, Grid} from "@material-ui/core";
import api from "api";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import config from "configuration";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";

const styles = theme => ({
  root: { display: "flex" },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    flexGrow: 1,
    backgroundColor: "#1e90ff!important",
    minHeight: '3.25rem',
    boxShadow: 'none'
  },
  grow: {
    flexGrow: 1,
    fontSize: "18px",
    position: "relative",
    top: "13px",
    marginRight: 16,
    "&:hover": {
      cursor: "pointer"
    }
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  toolbar: theme.mixins.toolbar,
  topNav: {
    padding: '.5rem',
    "&:hover": {
      backgroundColor: "#2366d1",
      cursor: "pointer"
    }
  },
  topNavText: {
    color: "#fff",
    fontSize: '1rem',
    position: "relative",
    fontWeight: 'bold',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    lineHeight: 'inherit'
  },
  noBold: {
    fontWeight: 'normal'
  },
  topNavNoHover: {
    padding: '.5rem'
  },
  dropdown: {
    position: 'relative',
    "&:hover div": {
      display: "block"
    }
  },
  dropdownMenu: {
    display: 'none',
    position:'absolute',
    right: 0,
    left: 'auto',
    border: '1px solid rgba(0,0,0,.15)',
    borderRadius: '.25rem',
    zIndex: theme.zIndex.drawer + 2,
    padding: '.5rem 0',
    backgroundColor: '#fff',
    "&:hover": {
      display: 'block'
    },
    "& button": {
      justifyContent: 'left',
      textTransform: 'none',
      width: '100%',
      fontWeight: 'bold',
      color: 'black',
      border: 'none',
      '&:hover': {
        border: 'none'
      },
      whiteSpace: 'nowrap',
      padding: '.25rem 1.5rem'
    }
  }
});
const drawerWidth = 240;

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

  handleRedirect = (to: string) => {
    window.location = to;
  };

  render() {
    const { classes } = this.props;
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
              <div>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                  <Toolbar>
                    <Grid container justify="flex-start">
                      <div className={classes.topNavNoHover}>
                        <Typography
                            variant="subtitle1"
                            color="inherit"
                            className={classes.topNavText + " " + classes.noBold}
                        >
                          {/* {this.getTitleName()} */}
                          TMS: Question Management
                        </Typography>
                      </div>
                      <div
                          onClick={() => this.handleRedirect(config.dashboard)}
                          className={classes.topNav + " navbarItem"}
                      >
                        <Typography variant="body2" className={classes.topNavText}>
                          Home
                        </Typography>
                      </div>
                    </Grid>
                    <div className={classes.topNav + " " + classes.dropdown}>
                      <Typography variant="body2" className={classes.topNavText}>
                        {this.state.keycloak.tokenParsed.name}&nbsp;&#9660;
                      </Typography>
                      <div className={classes.dropdownMenu}>
                        <ButtonGroup
                            orientation="vertical"
                            color="primary"
                        >
                          <Button onClick={() => this.handleRedirect(config.profileUrl)}>My Profile</Button>
                          <Button onClick={() => this.handleRedirect(config.examUrl)}>My Exams</Button>
                          <Button onClick={this.logout}>Sign Out</Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  </Toolbar>
                </AppBar>
                <div style={noAccessStyles}>
                  You do not have access to this service.
                </div>
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
// export default Secured;
export default withStyles(styles)(Secured);
