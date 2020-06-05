//@flow
import React from "react";
import ReactTable from "react-table";
import * as api from "../question/api";
import {Button, Grid} from "@material-ui/core";
import "index.css";
import DialogButton from "../../components/DialogButton";
import FileUpload from "../FileUpload";
import alertify from 'alertifyjs';

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
          alertify.error("Could not load questions.");
        });
  };
  createNew = () => {
    this.props.history.push("/question/edit/0");
  };

  exportAll = () => {
    api
        .exportAll()
        .then(msg => {
          var FileSaver = require('file-saver');
          var blob = new Blob([msg.data], {type: "text/xml"});
          FileSaver.saveAs(blob, "allQuestions");
          alertify.success("Success. All questions exported.");
        })
        .catch(e => {
          alertify.error("Error. Could not export all questions.");
          console.log(e);
        });
  };

  exportFiltered = () => {
    const currentRecords = this.selectTable.getResolvedState().sortedData;
    var formData = new FormData();
    formData.append("questionIdList", currentRecords.map( q => q.id));
    api
        .exportFiltered(formData)
        .then(msg => {
          var FileSaver = require('file-saver');
          var blob = new Blob([msg.data], {type: "text/xml"});
          FileSaver.saveAs(blob, "filteredQuestions");
          alertify.success("Success. All filtered questions were exported.");
        })
        .catch(e => {
          alertify.error("Error. Could not export filtered questions.");
          console.log(e);
        });
  };

  removeAll = () => {
    api
        .deleteAll()
        .then(msg => {
          window.location.reload();
        })
        .catch(e => {
          alertify.error("Error. Could not delete all questions. Reason: " + e.response.data.message);
          console.log(e.response.data.message);
        });
  }

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
            <Grid container justify="center" style={{ margin: "10px 0px" }}>
              <Button
                  variant="contained"
                  color="primary"
                  onClick={this.createNew}
              >
                Create new
              </Button>
              <Button variant="contained"
                      color="secondary"
                      style={{ marginLeft: "5px" }}
                      onClick={this.removeAll}>
                Delete All
              </Button>
              <Button variant="contained"
                      color="primary"
                      style={{ marginLeft: "5px" }}
                      onClick={this.exportAll}>
                Export All
              </Button>
              <Button variant="contained"
                      color="primary"
                      style={{ marginLeft: "5px" }}
                      onClick={this.exportFiltered}>
                Export Filtered
              </Button>
              <DialogButton
                  title="IMPORT QUESTIONS"
                  buttonLabel="IMPORT QUESTIONS"
                  variant="contained"
                  style={{ marginLeft: "5px" }}
                  history = {this.props.history}
                  dialogContent={(close, open) => {
                    return (
                        <FileUpload
                            postUrl={api.importQuestions}
                            accept={["text/xml"]}
                            // multiple={true}
                            maxSize={100000000}
                            showMessage={(message) => alertify.error(message)}
                            rejectMessage="File rejected. Files must be smaller than 100 MB"
                            history = {this.props.history}
                            onSuccess={() => {
                              alertify.success("File successfully processed.");
                            }}
                        />
                    );
                  }}
              />
            </Grid>
            <link rel="stylesheet" href="https://unpkg.com/react-table@6.9.2/react-table.css"/>
            <ReactTable
                data={this.state.questionList}
                ref={(r) => {
                  this.selectTable = r;
                }}
                columns={columns}
                defaultSorted={[
                  {
                    id: "name",
                    desc: false
                  }
                ]}
                filterable
            />
          </div>
        </div>
    );
  }
}

export default QuestionTable;
