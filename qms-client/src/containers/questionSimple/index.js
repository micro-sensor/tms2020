//@flow

import React from "react";
import Grid from "@material-ui/core/Grid";
import {
  Paper,
  Divider,
  Typography,
  Button,
  Dialog,
  Tab,
  Tabs,
  TextField
} from "@material-ui/core";
import * as apiCategory from "../category/api";
import CategoryList from "../category/components/CategoryList";
import debounce from "lodash/debounce";
import * as api from "../question/api";
import DialogButton from "components/DialogButton";
import FileUpload from "containers/FileUpload";
import { saveAs, FileSaver } from 'file-saver';
import alertify from 'alertifyjs';


type Props = {};
type State = {
  categoryList: Array<{ id: number, name: string }>,
  categoryLoaded: boolean,
  categoryError: boolean,
  categorySelected: number,
  categoryUrlSelect: number,
  textSearch: string,
  questionList: Array<{
    id: number,
    name: string,
    level: number,
    categoriesNames: Array<string>
  }>
};

export const getDifficultyColor = (level: number) => {
  if (level == 1) {
    return "#03ab00";
  }
  if (level == 2) {
    return "#769400";
  }
  if (level == 3) {
    return "#bf9f00";
  }
  if (level == 4) {
    return "#d66d00";
  }
  if (level == 5) {
    return "#cc0000";
  }
  return "fff";
};

class Question extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      categoryList: [],
      categoryLoaded: false,
      categoryError: false,
      categoryUrlSelect: -1,
      categorySelected: -1,
      textSearch: "",
      questionList: []
    };
    this.debouncedSearch = debounce(this.search, 200);
  }

  componentDidMount = () => {
    this.setStateFromUrl();
  };

  setStateFromUrl = () => {
    if (this.props.location.search) {
      const params = this.props.location.search.slice(1).split("&");
      this.setState(
          {
            categoryUrlSelect: params[0].split("=")[1],
            textSearch: decodeURI(params[1].split("=")[1])
          },
          this.loadCategories
      );
    } else {
      this.loadCategories();
    }
  };

  changeSearchTab = (event, value) => {
    this.setState({
      searchTab: value
    });
  };

  loadCategories = () => {
    apiCategory
        .getAll()
        .then(m => {
          if (!m.data) {
            this.setState({
              categoryLoaded: true,
              categoryError: true
            });
            alertify.error("Could not load categories.");
          } else {
            const list = m.data.sort(function(a, b) {
              return a.name < b.name ? -1 : 1;
            });

            let idSelected = -1;
            let cnt = 0;
            m.data.forEach(c => {
              if (c.id == this.state.categoryUrlSelect) {
                idSelected = cnt;
              }
              cnt++;
            });

            this.setState(
                {
                  categoryLoaded: true,
                  categoryError: false,
                  categoryList: m.data,
                  categorySelected: idSelected
                },
                this.search
            );
          }
        })
        .catch(e => {
          this.setState({
            categoryLoaded: true,
            categoryError: true
          });
          alertify.error("Could not load categories.");
          console.log(e);
        });
  };

  selectCategory = (event, id) => {
    this.setState(
        {
          categorySelected: id
        },
        this.search
    );
  };

  handleTextChange = event => {
    this.setState(
        {
          textSearch: event.target.value
        },
        this.debouncedSearch
    );
  };

  search = () => {
    const cat = this.state.categoryList[this.state.categorySelected];
    const id = cat ? cat.id : -1;
    this.props.history.push(
        "/question/?catId=" + id + "&text=" + this.state.textSearch
    );
    api
        .search(id, this.state.textSearch)
        .then(msg => {
          this.setState({
            questionList: msg.data.sort(function(a, b) {
              return a.name < b.name ? -1 : 1;
            })
          });
        })
        .catch(e => {
          console.log(e);
        });
  };

  exportSingle = (id: number) => {
    api
        .exportQuestion(id)
        .then(msg => {
          var FileSaver = require('file-saver');
          var blob = new Blob([msg.data], {type: "text/xml"});
          FileSaver.saveAs(blob, "question");
          alertify.success("Success. Question exported.");
        })
        .catch(e => {
          alertify.error("Error. Could not export the question.");
          console.log(e);
        });
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
    var formData = new FormData();
    formData.append("questionIdList", this.state.questionList.map( q => q.id));
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

  edit = (id: number) => {
    this.props.history.push("/question/edit/" + id);
  };

  createNew = () => {
    this.props.history.push("/question/edit/0");
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
    const { searchTab, categoryList } = this.state;
    return (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <Paper>
              <div style={{ padding: 16 }}>
                <Typography variant="h4">Search Questions</Typography>
              </div>
              <Divider />
              <div style={{ padding: "7px 32px 15px 32px" }}>
                <TextField
                    id="search-field"
                    label="Search question by name"
                    value={this.state.textSearch}
                    onChange={this.handleTextChange}
                    margin="normal"
                    variant="outlined"
                    style={{ width: 320 }}
                />
              </div>

              <Divider />
              <div>
                <CategoryList
                    selectedIndex={this.state.categorySelected}
                    handleListItemClick={this.selectCategory}
                    items={this.state.categoryList}
                    noTitle
                    noSelection
                />
              </div>
            </Paper>
            <br />
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={this.createNew}>
                Create new
              </Button>
              <Button variant="contained" color="secondary" style={{ marginLeft: "5px" }}onClick={this.removeAll}>
                Delete All
              </Button>
            </Grid>
            <Grid item xs={12} style={{ marginTop: "5px" }}>
              <Button variant="contained"
                      color="primary"
                      onClick={this.exportAll}>
                Export All
              </Button>
              <Button variant="contained"
                      color="primary"
                      style={{
                        marginLeft: "5px"
                      }}
                      onClick={this.exportFiltered}>
                Export Filtered
              </Button>
            </Grid>
            <DialogButton
                style={{
                  marginTop: "5px"
                }}
                title="IMPORT QUESTIONS"
                buttonLabel="IMPORT QUESTIONS"
                variant="contained"
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

          {/* as list */}
          <Grid
              item
              xs={12}
              sm={12}
              md={7}
              lg={7}
              style={{
                maxHeight: "calc(100vh - 100px)",
                overflowY: "scroll"
              }}
          >
            {this.state.questionList.map(q => {
              const color = getDifficultyColor(q.level);
              return (
                  <div style={{ marginBottom: 14 }} key={q.id}>
                    <Paper>
                      <div style={{ borderLeft: `solid 4px ${color}` }}>
                        <div
                            style={{
                              padding: "12px 16px"
                            }}
                        >
                          <Grid container justify="space-between">
                            <Typography variant="h6">{q.name}</Typography>
                            <div>
                              <Button
                                  variant="outlined"
                                  style={{
                                    marginRight: "5px"
                                  }}
                                  onClick={() => this.exportSingle(q.id)}
                              >
                                Export
                              </Button>
                              <Button
                                  variant="outlined"
                                  onClick={() => this.edit(q.id)}
                              >
                                Edit
                              </Button>
                            </div>
                          </Grid>
                        </div>
                        <Divider />
                        <div>
                          <Grid
                              container
                              justify="space-between"
                              style={{ padding: "4px 16px" }}
                          >
                            <Grid item>
                              <Grid container justify="flex-start">
                                {q.categoriesNames.map(name => (
                                    <Typography
                                        key={name}
                                        variant="body2"
                                        style={{ paddingRight: 16 }}
                                    >
                                      {name}
                                    </Typography>
                                ))}
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Grid container justify="flex-end">
                                <Typography
                                    variant="body2"
                                    style={{ paddingRight: 16 }}
                                >
                                  {"diff: " + q.level}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{ paddingRight: 4 }}
                                >
                                  {"id: " + q.id}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Paper>
                  </div>
              );
            })}
          </Grid>
        </Grid>
    );
  }
}

export default Question;
