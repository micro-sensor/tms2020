//@flow

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/HomeRounded";
import CategoryIcon from "@material-ui/icons/CategoryRounded";
import ChatIcon from "@material-ui/icons/ChatRounded";
import CheckIcon from "@material-ui/icons/CheckCircleRounded";
import CloseIcon from "@material-ui/icons/Close";
import AssessmentIcon from "@material-ui/icons/Assessment";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import config from "configuration";

import { withRouter } from "react-router-dom";
import {
  Snackbar,
  SnackbarContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Grid
} from "@material-ui/core";
import * as type from "containers/types";

const styles = theme => ({
  root: { display: "flex" },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    flexGrow: 1,
    backgroundColor: "#1e90ff!important"
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
    padding: "0 16px",
    height: "56px",
    "&:hover": {
      backgroundColor: "#2b8ae4",
      cursor: "pointer"
    }
  },
  topNavText: {
    color: "#fafafad1",
    fontSize: 16,
    position: "relative",
    top: "16px"
  }
});

const drawerWidth = 240;

type Props = { ...type.topState };
type State = {};

class AppWrap extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: null
    };
  }

  redirectTo = (url: string) => {
    this.props.history.push("/" + url);
  };

  getTitleName = () => {
    if (this.props.location.pathname.substring(0, 5) === "/cate") {
      return "QMS - Categories";
    }
    if (this.props.location.pathname.substring(0, 5) === "/lang") {
      return "QMS - Languages";
    }
    if (this.props.location.pathname.substring(0, 5) === "/ques") {
      return "QMS - Questions";
    }
    return "Question Management System";
  };

  handleMenuClick = event => {
    this.setState({ menuAnchor: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchor: null });
  };

  handleRedirect = (to: string) => {
    window.location = to;
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Grid container justify="flex-start">
              <div>
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className={classes.grow}
                  onClick={() => this.redirectTo("")}
                >
                  {/* {this.getTitleName()} */}
                  Question Management System
                </Typography>
              </div>
              <div
                onClick={() => this.redirectTo("category")}
                className={classes.topNav}
              >
                <Typography variant="body2" className={classes.topNavText}>
                  Categories
                </Typography>
              </div>
              <div
                onClick={() => this.redirectTo("language")}
                className={classes.topNav}
              >
                <Typography variant="body2" className={classes.topNavText}>
                  Languages
                </Typography>
              </div>
              <div
                onClick={() => this.redirectTo("question")}
                className={classes.topNav}
              >
                <Typography variant="body2" className={classes.topNavText}>
                  Questions
                </Typography>
              </div>
              <div
                onClick={() => this.redirectTo("report")}
                className={classes.topNav}
              >
                <Typography variant="body2" className={classes.topNavText}>
                  Report
                </Typography>
              </div>
            </Grid>

            <Button
              color="inherit"
              onClick={this.handleMenuClick}
              style={{ width: 150 }}
            >
              {this.props.name}
            </Button>
            <Menu
              anchorEl={this.state.menuAnchor}
              open={Boolean(this.state.menuAnchor)}
              onClose={this.handleMenuClose}
            >
              <MenuItem onClick={() => this.handleRedirect(config.dashboard)}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => this.handleRedirect(config.profileUrl)}>
                My Profile
              </MenuItem>
              <MenuItem onClick={this.props.logout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        {/* <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem
              button
              key={"home"}
              onClick={() => this.redirectTo("home")}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItem>
            <ListItem
              button
              key={"category"}
              onClick={() => this.redirectTo("category")}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary={"Categories"} />
            </ListItem>
            <ListItem
              button
              key={"language"}
              onClick={() => this.redirectTo("language")}
            >
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary={"Languages"} />
            </ListItem>
            <ListItem
              button
              key={"question"}
              onClick={() => this.redirectTo("question")}
            >
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText primary={"Questions"} />
            </ListItem>
            <ListItem
              button
              key={"report"}
              onClick={() => this.redirectTo("report")}
            >
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary={"Report"} />
            </ListItem>
          </List>
        </Drawer> */}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.props.snackGood}
          autoHideDuration={5000}
          onClose={this.props.closeSnack(true)}
        >
          <SnackbarContent
            message={<span id="message-id">{this.props.snackGoodText}</span>}
            style={{ backgroundColor: "#2e9b00" }}
          />
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.props.snackBad}
          autoHideDuration={5000}
          onClose={this.props.closeSnack(false)}
        >
          <SnackbarContent
            message={<span id="message-id">{this.props.snackBadText}</span>}
            style={{ backgroundColor: "#960000" }}
          />
        </Snackbar>
        <Dialog
          open={this.props.confirmDialogOpen}
          onClose={this.props.closeConfirmDialog}
        >
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent style={{ minWidth: 480 }}>
            <Typography variant="body1">
              {this.props.confirmDialogText}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.closeConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.props.confirmAction}
              color="primary"
              autoFocus
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>

        <Grid
          container
          alignItems="center"
          justify="center"
          style={{ width: "100%" }}
        >
          <Grid xs={10}>
            <main className={classes.content}>
              <div className={classes.toolbar} />
              {this.props.children}
            </main>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(AppWrap));
