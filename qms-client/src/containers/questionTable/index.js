//@flow
import React from "react";
import ReactTable from "react-table";
import * as api from "../questionEdit/api";
import "react-table/react-table.css";
import { Button } from "@material-ui/core";
import "index.css";

type State = {
  questionList: Array<{
    id: number,
    name: string,
    level: number,
    categoriesNames: Array<string>
  }>,
  loaded: boolean,
  err: boolean
};

class QuestionTable<Props, State> extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionList: [],
      loaded: false,
      err: false
    };
  }

  edit = (id: number) => {
    this.props.history.push("/question/edit/" + id);
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    api
      .search(-1, "")
      .then(msg => {
        this.setState({
          questionList: msg.data,
          loaded: true,
          err: false
        });
      })
      .catch(e => {
        this.setState({
          loaded: true,
          err: true
        });
        console.log(e);
        this.props.showSnack("Could not load questions.", false);
      });
  };
  createNew = () => {
    this.props.history.push("/question/edit/0");
  };

  render() {
    if (!this.state.loaded) {
      return <div />;
    }

    if (this.state.err) {
      return <div>Could not load questions.</div>;
    }

    const columns = [
      {
        Header: "Id",
        accessor: "id", // String-based value accessors!
        width: 64,
        resizable: false,
        Cell: props => (
          <span style={{ verticalAlign: "middle" }}>{props.value}</span>
        )
      },
      {
        Header: "Name",
        accessor: "name",
        filterMethod: (filter, row) => {
          return row.name.toLowerCase().includes(filter.value.toLowerCase());
        },
        Cell: props => (
          <span style={{ verticalAlign: "middle" }}>{props.value}</span>
        )
      },
      {
        Header: "Categories",
        accessor: "categoriesNames",
        Cell: props => (
          <span style={{ verticalAlign: "middle" }}>
            {props.value.join(", ")}
          </span>
        ),
        filterMethod: (filter, row) => {
          return row.categoriesNames
            .join(",")
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        }
      },
      {
        Header: "Level",
        accessor: "level",
        width: 64,
        resizable: false,
        Cell: props => (
          <span style={{ verticalAlign: "middle" }}>{props.value}</span>
        )
      },

      {
        Header: "action",
        accessor: "id",
        Cell: props => (
          <Button
            size="small"
            color="primary"
            onClick={() => this.edit(props.value)}
            style={{ padding: "0px 8px" }}
          >
            edit
          </Button>
        ),
        width: 80,
        resizable: false
      }
    ];

    return (
      <div>
        <div style={{ paddingTop: 42 }}>
          <ReactTable
            data={this.state.questionList}
            columns={columns}
            defaultSorted={[
              {
                id: "id",
                desc: false
              }
            ]}
            filterable
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.createNew}
            style={{ marginTop: 16 }}
          >
            Create new
          </Button>
        </div>
      </div>
    );
  }
}

export default QuestionTable;
