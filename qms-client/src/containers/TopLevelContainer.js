//@flow

import React from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import Home from "./home";
import AppWrap from "./appWrap";
import Category from "./category";
import Question from "./question";
import QuestionEdit from "./questionEdit";
import Language from "./language";
import * as type from "containers/types";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";
import red from "@material-ui/core/colors/red";
import Report from "containers/report";
import config from "configuration";

type Props = {};
type State = { ...type.topState };

const defaultQuestion = {
  title: "",
  level: 1,
  body: "",
  questionType: "SELECT_ONE",
  categories: [],
  choices: [],
  codes: []
};

const theme = createMuiTheme({
  overrides: {
    MuiToolbar: {
      regular: {
        minHeight: "3.25rem !important"
      }
    }
  },
  palette: {
    primary: {
      light: blue[300],
      main: blue[800],
      dark: blue[900]
    },
    secondary: {
      light: pink[500],
      main: pink[600],
      dark: pink[800]
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700]
    }
  }
});

class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      snackGood: false,
      snackBad: false,
      snackGoodText: "",
      snackBadText: "",
      confirmDialogOpen: false,
      confirmDialogText: "",
      confirmAction: undefined,
      activeQuestion: defaultQuestion
    };
  }

  closeSnack = good => () => {
    if (good) {
      this.setState({
        snackGood: false
      });
    } else {
      this.setState({
        snackBad: false
      });
    }
  };

  showSnack = (message: string, good: boolean) => {
    if (good) {
      this.setState({
        snackGoodText: message,
        snackGood: true,
        snackBad: false
      });
    } else {
      this.setState({
        snackBadText: message,
        snackBad: true,
        snackGood: false
      });
    }
  };

  closeConfirmDialog = () => {
    this.setState({
      confirmDialogOpen: false,
      confirmDialogText: ""
    });
  };

  confirmAction = () => {
    if (this.state.confirmAction) {
      this.state.confirmAction();
    }

    this.setState({
      confirmDialogOpen: false,
      confirmDialogText: "",
      confirmAction: undefined
    });
  };

  showConfirmDialog = (message: string, action: () => void) => {
    // console.log("show dialog");
    this.setState({
      confirmDialogOpen: true,
      confirmDialogText: message,
      confirmAction: action
    });
  };

  updateQuestion = (newQuestion: Question) => {
    // console.log(newQuestion);
    this.setState({
      activeQuestion: newQuestion
    });
  };

  resetQuestion = () => {
    // console.log(newQuestion);
    this.setState({
      activeQuestion: defaultQuestion
    });
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router basename={config.routerBase}>
          <AppWrap
            {...this.state}
            closeSnack={this.closeSnack}
            closeConfirmDialog={this.closeConfirmDialog}
            confirmAction={this.confirmAction}
            logout={this.props.logout}
            name={this.props.name}
          >
            <Switch>
              <Route
                path="/category"
                render={route => (
                  <Category
                    {...route}
                    showSnack={this.showSnack}
                    showConfirmDialog={this.showConfirmDialog}
                  />
                )}
              />
              <Route
                path="/question/edit/:qid"
                render={route => (
                  <QuestionEdit
                    {...route}
                    showSnack={this.showSnack}
                    showConfirmDialog={this.showConfirmDialog}
                    question={this.state.activeQuestion}
                    updateQuestion={this.updateQuestion}
                    resetQuestion={this.resetQuestion}
                  />
                )}
              />
              <Route
                path="/question"
                render={route => (
                  <Question
                    {...route}
                    showSnack={this.showSnack}
                    showConfirmDialog={this.showConfirmDialog}
                  />
                )}
              />
              <Route
                path="/language"
                render={route => (
                  <Language
                    {...route}
                    showSnack={this.showSnack}
                    showConfirmDialog={this.showConfirmDialog}
                  />
                )}
              />
              <Route
                path="/report"
                render={route => (
                  <Report
                    {...route}
                    showSnack={this.showSnack}
                    showConfirmDialog={this.showConfirmDialog}
                  />
                )}
              />
              <Route path="/" component={Home} />
            </Switch>
          </AppWrap>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
