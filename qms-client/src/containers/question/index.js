//@flow

import React from "react";
import Simple from "../questionSimple";
import {Button, Paper} from "@material-ui/core";
import QuestionTable from "../questionTable";

type Props = {};
type State = {
  view: "simple" | "table"
};

class Question extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let v = localStorage.getItem("view");
    if (!v) {
      v = "simple";
    }
    this.state = {
      view: v
    };
  }

  switchView = (view: string) => {
    this.setState({
      view: view
    });
    localStorage.setItem("view", view);
  };

  render() {
    const { view } = this.state;
    return (
        <div>
          <h3> Instructions: </h3>
          <p>In this page you can create, edit and delete a questions. Questions can be in one or more categories, and can contain zero or more code snippets, one per language.</p>
          <p>To find existing questinos, you can search by title and filter by category, and you can switch to table view if there are too many questions.</p>
          <div style={{ height: 0, width: "100%", position: "relative" }}>
            <div style={{ position: "absolute", right: 6 }}>
              {view == "simple" ? (
                  <Button
                      onClick={() => this.switchView("table")}
                      // variant="outlined"
                      color="primary"
                      size="small"
                      style={{ position: "relative", top: -24 }}
                  >
                    switch to table view
                  </Button>
              ) : (
                  <Button
                      onClick={() => this.switchView("simple")}
                      // variant="outlined"
                      color="primary"
                      size="small"
                  >
                    switch to simple view
                  </Button>
              )}
            </div>
          </div>
          {view == "simple" ? (
              <Simple {...this.props} />
          ) : (
              <QuestionTable {...this.props} />
          )}
        </div>
    );
  }
}

export default Question;