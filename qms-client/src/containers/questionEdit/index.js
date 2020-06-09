//@flow

import React from "react";
import Grid from "@material-ui/core/Grid";
import CKEditor from '@ckeditor/ckeditor5-react';
import {ClassicEditor, InlineEditor} from '@barsbek/ckeditor5-build-baylor-tms';
import {
  Paper,
  Divider,
  Typography,
  Button,
  Dialog,
  Tab,
  Tabs,
  TextField,
  InputLabel,
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
import alertify from 'alertifyjs';

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
            alertify.error("Could not load categories.");
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
          alertify.error("Could not load categories.");
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
            alertify.error("Could not load languages.");
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
          alertify.error("Could not load languages.");
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

  change = (property, event) => {
    const newQuestion = Object.assign({}, this.props.question);
    newQuestion[property] = event.target ? event.target.value : event.getData();
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

  changeAnswerBody = (uuid, event) => {
    const c = this.findOption(uuid);
    c.body = event.target ? event.target.value : event.getData();
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

  changeCodeBody = (langId, event) => {
    const c = this.getCode(langId);
    c.body = event.target ? event.target.value : event.getData();
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
          alertify.success("Success. Question exported.");
        })
        .catch(e => {
          alertify.error("Error. Could not export the question.");
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
            alertify.success("Success. Question updated.");
          })
          .catch(e => {
            alertify.error("Error. Could not update question.");
            console.log(e);
          });
    } else {
      api
          .create(question)
          .then(msg => {
            this.processSave(msg);
            alertify.success("Success. Question created.");
            this.props.history.push("/question/edit/" + msg.data.id);
          })
          .catch(e => {
            alertify.error("Error. Could not create question.");
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
          alertify.success("Success. Question deleted.");
          this.props.history.push("/question");
        })
        .catch(e => {
          alertify.error("Error. Could not delete question.");
          console.log(e);
        });
  };

  render() {
    const { question, updateQuestion } = this.props;

    let classicEditorConfiguration = {
      toolbar: {
        items: [
          "heading", "|", "undo", "redo", "|",
          "selectAll", "bold", "italic", "underline", "strikethrough", "subscript", "superscript", "fontColor", "fontBackgroundColor", "blockQuote", "|",
          "code", "codeBlock", "|" ,
          "numberedList", "bulletedList", "|" ,
          "alignment", "indent", "outdent", "|" ,
          "specialCharacters","insertTable", "link", "mediaEmbed",  "|" ,
          "removeFormat"
        ],
        // viewportTopOffset: 500,
        shouldNotGroupWhenFull: true,
      },
      // toolbar: [],
      placeholder: "The actual text of the question",
      typing: {
        transformations: {include: [ 'symbols', 'mathematical',],}
      },
      codeBlock: {
        languages: [{ language: 'plaintext', label: 'CodeBlock'}]
      }
    };
    const inlineEditorConfiguration = {
      toolbar: {
        items: [
          "undo", "redo", "|",
          "selectAll", "bold", "italic", "underline", "strikethrough", "subscript", "superscript", "fontColor", "fontBackgroundColor", "blockQuote", "|",
          "code", "codeBlock", "|" ,
          "numberedList", "bulletedList", "|" ,
          "alignment", "indent", "outdent", "|" ,
          "specialCharacters","insertTable", "link", "mediaEmbed",  "|" ,
          "removeFormat"
        ],
        shouldNotGroupWhenFull: false,
      },
      typing: {
        transformations: {include: [ 'symbols', 'mathematical',],}
      },
      codeBlock: {
        languages: [{ language: 'plaintext', label: 'CodeBlock'}]
      }
    }
    let codeEditorConfiguration = Object.assign({}, classicEditorConfiguration);
    codeEditorConfiguration.placeholder = "Code snippet body";

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
                    onChange={event => this.change("title", event)}
                    label="Title"
                    InputProps={{ style: { fontSize: 24 } }}
                />
              </div>
              <Divider />
              <div style={{ padding: 16 }}>
                <InputLabel style={{ marginBottom: "5px" }} error={question.body.length < 3}>
                  {question.body.length < 3 ? "Body must have at least 3 characters" : "Body"}
                </InputLabel>
                <CKEditor
                    data={question.body}
                    editor={ ClassicEditor }
                    config={classicEditorConfiguration}
                    onChange={( event, editor ) => this.change("body", editor)}
                    onInit={ editor => {
                      editor.setData(question.body);
                      console.log( 'Editor init() function (Question Body)');
                    }}
                    onError={error => {
                      alertify.error("Problem initializing rich-text editor.");
                      console.log("Question.body: ", question.body);
                      console.log("Problem initializing rich-text editor (Question Body): ", error);
                    }}
                />
              </div>
              <Divider />
              <div style={{ padding: 16 }}>
                <TextField
                    select
                    label="Difficulty level"
                    value={question.level}
                    style={{ width: 128 }}
                    onChange={event => this.change("level", event)}
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
                            <InputLabel style={{ marginBottom: "5px" }} error={c.body.length == 0}>
                              {c.body.length == 0 ? "Answer cannot be empty" : "Answer"}
                            </InputLabel>
                            <div style={{ border: "1px solid lightgray" }}>
                              <CKEditor
                                  data={c.body}
                                  editor={ InlineEditor }
                                  config={inlineEditorConfiguration}
                                  onInit={ editor => {
                                    editor.setData(c.body);
                                    console.log( 'Editor init() function (Answer Choice Body)');
                                  }}
                                  onChange={( event, editor ) => this.changeAnswerBody(c.uuid, editor)}
                                  onError={error => {
                                    alertify.error("Problem initializing rich-text editor.");
                                    console.log("answer choise - c.body: ", c.body);
                                    console.log("Problem initializing rich-text editor (Answer Choice Body): ", error);
                                  }}
                              />
                            </div>
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
                              <InputLabel style={{ marginBottom: "5px" }} error={code.body.length < 3}>
                                {code.body.length < 3 ? "Code snippet body must have at least 3 characters" : "Code snippet body"}
                              </InputLabel>
                              <CKEditor
                                  data={code.body}
                                  editor={ ClassicEditor }
                                  config={codeEditorConfiguration}
                                  onInit={ editor => {
                                    editor.setData(code.body);
                                    console.log( 'Editor init() function (Code snippet Body)');
                                  }}
                                  onChange={( event, editor ) => this.changeCodeBody(code.languageId, editor)}
                                  onError={error => {
                                    alertify.error("Problem initializing rich-text editor.");
                                    console.log("code.body: ", code.body);
                                    console.log("Problem initializing rich-text editor (Code snippet body):", error);
                                  }}
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
