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
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Chip,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import * as apiCategory from "../category/api";
import * as apiLang from "../language/api";
import CategoryList from "../category/components/CategoryList";
import debounce from "lodash/debounce";
import type { Question, Choice, Code } from "../types";
import uuidv1 from "uuid";
import DeleteIcon from "@material-ui/icons/DeleteRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as api from "../question/api";

type Props = {
  question: Question,
  updateQuestion: () => void,
  showSnack: (string, boolean) => void
};
type State = {
  categoryList: Array<{ id: number, name: string }>,
  categoryLoaded: boolean,
  categoryError: boolean,
  langList: Array<{ id: number, name: string }>,
  langLoaded: boolean,
  langError: boolean,
  loadComplete: boolean
};

class QuestionEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      categoryList: [],
      categoryLoaded: false,
      categoryError: false,
      langList: [],
      langLoaded: false,
      langError: false,
      loadComplete: false
    };
  }

  componentDidMount = () => {
    this.loadCategories();
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
            this.props.showSnack("Could not load categories.", false);
          } else {
            const list = m.data.sort(function(a, b) {
              return a.name < b.name ? -1 : 1;
            });
            this.setState(
                {
                  categoryLoaded: true,
                  categoryError: false,
                  categoryList: m.data
                },

                this.loadLang
            );
          }
        })
        .catch(e => {
          this.setState({
            categoryLoaded: true,
            categoryError: true
          });
          this.props.showSnack("Could not load categories.", false);
          console.log(e);
        });
  };

  loadLang = () => {
    apiLang
        .getAll()
        .then(m => {
          if (!m.data) {
            this.setState({
              langLoaded: true,
              langError: true
            });
            this.props.showSnack("Could not load languages.", false);
          } else {
            const list = m.data.sort(function(a, b) {
              return a.name < b.name ? -1 : 1;
            });
            this.setState(
                {
                  langLoaded: true,
                  langError: false,
                  langList: m.data
                },
                this.loadQuestion
            );
          }
        })
        .catch(e => {
          this.setState({
            langLoaded: true,
            langError: true
          });
          this.props.showSnack("Could not load languages.", false);
          console.log(e);
        });
  };

  loadQuestion = () => {
    const qid = this.props.match.params.qid;
    if (qid && qid != "0") {
      api.get(qid).then(msg => {
        console.log(msg.data);
        this.processSave(msg);
        this.setState({
          loadComplete: true
        });
      });
    } else {
      this.props.resetQuestion();
      this.setState({
        loadComplete: true
      });
    }
  };

  change = property => event => {
    const newQuestion = Object.assign({}, this.props.question);
    newQuestion[property] = event.target.value;
    this.props.updateQuestion(newQuestion);
  };

  addOption = () => {
    const newQuestion = Object.assign({}, this.props.question);
    newQuestion.choices = newQuestion.choices.concat([
      { body: "", correct: false, uuid: uuidv1() }
    ]);
    this.props.updateQuestion(newQuestion);
  };

  removeOption = uuid => () => {
    const newQuestion = Object.assign({}, this.props.question);
    const newChoices = [];
    newQuestion.choices.forEach(c => {
      if (c.uuid != uuid) {
        newChoices.push(c);
      }
    });
    newQuestion.choices = newChoices;
    this.props.updateQuestion(newQuestion);
  };

  changeAnswerCorrectness = uuid => event => {
    const c = this.findOption(uuid);
    c.correct = event.target.checked;
    const newQuestion = Object.assign({}, this.props.question);
    const newChoices = this.setInArray(c, newQuestion.choices, "uuid");
    newQuestion.choices = newChoices;
    this.props.updateQuestion(newQuestion);
  };

  changeAnswerBody = uuid => event => {
    const c = this.findOption(uuid);
    c.body = event.target.value;
    const newQuestion = Object.assign({}, this.props.question);
    const newChoices = this.setInArray(c, newQuestion.choices, "uuid");
    newQuestion.choices = newChoices;
    this.props.updateQuestion(newQuestion);
  };

  setInArray = (obj: any, arr: Array<any>, idtype: string): Array<any> => {
    const newArray = [];
    arr.forEach(o => {
      if (o[idtype] != obj[idtype]) {
        newArray.push(o);
      } else {
        newArray.push(obj);
      }
    });
    return newArray;
  };

  findOption = (uuid: any): Choice => {
    let select = undefined;
    this.props.question.choices.forEach(c => {
      if (uuid == c.uuid) {
        select = c;
      }
    });
    return Object.assign({}, select);
  };

  addCategory = (id: number) => () => {
    const newQuestion = Object.assign({}, this.props.question);
    const newCategory = newQuestion.categories.concat([id]);
    newQuestion.categories = newCategory;
    this.props.updateQuestion(newQuestion);
  };

  deleteCategory = (id: number) => () => {
    const newQuestion = Object.assign({}, this.props.question);
    newQuestion.categories = newQuestion.categories.filter(c => {
      return c != id;
    });
    this.props.updateQuestion(newQuestion);
  };

  getLanguage = (id: number) => {
    let lang = {};

    this.state.langList.forEach(l => {
      if (l.id == id) {
        lang = l;
      }
    });
    return lang;
  };

  getCode = (langId: number) => {
    let c = {};

    this.props.question.codes.forEach(code => {
      if (code.languageId == langId) {
        c = code;
      }
    });
    return c;
  };

  addCode = (id: number) => () => {
    const newQuestion = Object.assign({}, this.props.question);
    const newCodes = newQuestion.codes.concat({
      languageId: id,
      body: ""
    });
    newQuestion.codes = newCodes;
    this.props.updateQuestion(newQuestion);
  };

  deleteCode = (id: number) => () => {
    const newQuestion = Object.assign({}, this.props.question);
    const newCodes = newQuestion.codes.filter(code => {
      return code.languageId != id;
    });
    newQuestion.codes = newCodes;
    this.props.updateQuestion(newQuestion);
  };

  changeCodeBody = langId => event => {
    const c = this.getCode(langId);
    c.body = event.target.value;
    const newQuestion = Object.assign({}, this.props.question);
    const newCodes = this.setInArray(c, newQuestion.codes, "languageId");
    newQuestion.codes = newCodes;
    this.props.updateQuestion(newQuestion);
  };

  processSave = (msg: any) => {
    const newQuestion = msg.data;
    const categoryList = newQuestion.categories.map(c => c.id);
    newQuestion.categories = categoryList;
    const codeList = newQuestion.codes.map(c => {
      return { body: c.body, id: c.id, languageId: c.language.id };
    });
    newQuestion.codes = codeList;
    newQuestion.choices = newQuestion.choices.map(c => {
      c.uuid = uuidv1();
      return c;
    });
    this.props.updateQuestion(newQuestion);
  };

  export = () => {
    const { question } = this.props;
    question.choices = question.choices.reverse();
    api
        .exportQuestion(question.id)
        .then(msg => {
          var FileSaver = require('file-saver');
          var blob = new Blob([msg.data], {type: "text/xml"});
          FileSaver.saveAs(blob, "question");
          this.props.showSnack("Success. Question exported.", true);
        })
        .catch(e => {
          this.props.showSnack("Error. Could not export the question.", false);
          console.log(e);
        });
  };

  save = () => {
    const { question } = this.props;
    question.choices = question.choices.reverse();
    if (question.id) {
      api
          .save(question, question.id)
          .then(msg => {
            this.processSave(msg);
            this.props.showSnack("Success. Question updated.", true);
          })
          .catch(e => {
            this.props.showSnack("Error. Could not update question.", false);
            console.log(e);
          });
    } else {
      api
          .create(question)
          .then(msg => {
            this.processSave(msg);
            this.props.showSnack("Success. Question created.", true);
            this.props.history.push("/question/edit/" + msg.data.id);
          })
          .catch(e => {
            this.props.showSnack("Error. Could not create question.", false);
            console.log(e);
          });
    }
  };

  delete = () => {
    const { question } = this.props;
    question.choices = question.choices.reverse();
    api
        .remove(question.id)
        .then(msg => {
          this.props.showSnack("Success. Question deleted.", true);
          this.props.history.push("/question");
        })
        .catch(e => {
          this.props.showSnack("Error. Could not delete question.", false);
          console.log(e);
        });
  };

  render() {
    const { question, updateQuestion } = this.props;

    if (!question) {
      return <div />;
    }

    if (!this.state.loadComplete) {
      return <div />;
    }

    return (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={5}>
            <Paper>
              <div style={{ padding: 16 }}>
                <Typography variant="h4">Question Detail</Typography>
              </div>
              <Divider />
              <div style={{ padding: 16 }}>
                <TextField
                    error={question.title.length == 0}
                    style={{ width: "100%" }}
                    value={question.title}
                    onChange={this.change("title")}
                    label="Title"
                    InputProps={{ style: { fontSize: 24 } }}
                />
              </div>
              <Divider />
              <div style={{ padding: 16 }}>
                <TextField
                    error={question.body.length < 3}
                    multiline
                    label="Body"
                    value={question.body}
                    style={{ width: "100%" }}
                    onChange={this.change("body")}
                    helperText="The actual text of the question"
                    variant="outlined"
                >
                  {[1, 2, 3, 4, 5].map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                  ))}
                </TextField>
              </div>
              <Divider />
              <div style={{ padding: 16 }}>
                <TextField
                    select
                    label="Difficulty level"
                    value={question.level}
                    style={{ width: 128 }}
                    onChange={this.change("level")}
                >
                  {[1, 2, 3, 4, 5].map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                  ))}
                </TextField>
              </div>
            </Paper>
            <br />
            <Paper>
              <div style={{ padding: 16 }}>
                <Typography variant="h5">Answer Choices</Typography>
              </div>
              <Divider />
              {question.choices
                  .sort((c1, c2) => {
                    return c1.id > c2.id ? true : false;
                  })
                  .map(c => {
                    return (
                        <div key={c.uuid}>
                          <div style={{ padding: 16 }}>
                            <TextField
                                error={c.body.length == 0}
                                label="Answer"
                                value={c.body}
                                multiline
                                style={{ width: "100%" }}
                                onChange={this.changeAnswerBody(c.uuid)}
                            />
                            <Grid container justify="space-between">
                              <FormControlLabel
                                  control={
                                    <Switch
                                        checked={c.correct}
                                        onChange={this.changeAnswerCorrectness(c.uuid)}
                                        value={c.correct}
                                    />
                                  }
                                  label={c.correct ? "Correct" : "Wrong"}
                              />

                              <IconButton
                                  aria-label="Delete"
                                  onClick={this.removeOption(c.uuid)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Grid>
                          </div>
                          <Divider />
                        </div>
                    );
                  })}
              <div style={{ padding: 16 }}>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={this.addOption}
                >
                  Add Option
                </Button>
              </div>
            </Paper>
            <br />
            <Grid container justify="flex-end">
              <Button variant="contained" onClick={this.export}>
                EXPORT
              </Button>
              <Button
                  color="secondary"
                  onClick={this.delete}
                  style={{ marginRight: 16 }}
              >
                delete
              </Button>
              <Button color="primary" variant="contained" onClick={this.save}>
                save
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={7}>
            <Paper>
              <div style={{ padding: 16 }}>
                <Typography variant="h5">Belongs to categories</Typography>
              </div>
              <Divider />
              <div style={{ padding: 8 }}>
                <div style={{ padding: "4px 16px" }}>
                  <Typography variant="subtitle2">
                    {question.categories.length != 0
                        ? "Selected Categories"
                        : "No categories selected yet"}
                  </Typography>
                </div>

                {question.categories.map(c => {
                  let comp = null;
                  this.state.categoryList.forEach(cl => {
                    console.log();
                    if (c == cl.id) {
                      comp = (
                          <Chip
                              key={cl.id}
                              color="primary"
                              label={cl.name}
                              onDelete={this.deleteCategory(cl.id)}
                              style={{ margin: "4px 4px" }}
                          />
                      );
                    }
                  });
                  return comp;
                })}
              </div>
              <Divider />
              <div style={{ padding: 8 }}>
                <div style={{ padding: "4px 16px" }}>
                  <Typography variant="subtitle2">
                    {(this.state.categoryList &&
                        this.state.categoryList.length > 0) ||
                    !this.state.categoryLoaded
                        ? "All Categories"
                        : "Add category first."}
                  </Typography>
                </div>
                {question.categories &&
                this.state.categoryList
                    .filter(c => {
                      return !question.categories.includes(c.id);
                    })
                    .map(c => {
                      return (
                          <Chip
                              key={c.id}
                              label={c.name}
                              onClick={this.addCategory(c.id)}
                              style={{ margin: "4px 4px" }}
                          />
                      );
                    })}
              </div>
            </Paper>
            <br />
            <Paper>
              <div style={{ padding: 16 }}>
                <Typography variant="h5">Code Snippets</Typography>
              </div>
              <Divider />
              <div style={{ padding: 8 }}>
                <div style={{ padding: "4px 16px" }}>
                  <Typography variant="subtitle2">
                    {(this.state.langList && this.state.langList.length > 0) ||
                    !this.state.langLoaded
                        ? "Choose language for code snippet"
                        : "Add language first."}
                  </Typography>
                </div>
                {this.state.langList
                    .filter(c => {
                      let result = true;
                      question.codes.forEach(code => {
                        if (code.languageId == c.id) {
                          result = false;
                        }
                      });
                      return result;
                    })
                    .map(c => {
                      return (
                          <Chip
                              key={c.id}
                              label={c.name}
                              onClick={this.addCode(c.id)}
                              style={{ margin: "4px 4px" }}
                          />
                      );
                    })}
              </div>
              <Divider />
              {question.codes.map(code => {
                return (
                    <div key={code.languageId}>
                      <ExpansionPanel elevation={0} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">
                            {this.getLanguage(code.languageId).name}
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <Grid container>
                            <Grid item xs={12}>
                              <TextField
                                  error={code.body.length < 3}
                                  multiline
                                  variant="outlined"
                                  label="Code snippet body"
                                  value={code.body}
                                  style={{ width: "100%" }}
                                  onChange={this.changeCodeBody(code.languageId)}
                                  InputProps={{ style: { fontFamily: "monospace" } }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container justify="flex-end">
                                <IconButton
                                    aria-label="Delete"
                                    onClick={this.deleteCode(code.languageId)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                      <Divider />
                    </div>
                );
              })}
            </Paper>
          </Grid>
        </Grid>
    );
  }
}

export default QuestionEdit;
