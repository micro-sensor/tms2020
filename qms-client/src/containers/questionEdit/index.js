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
import Select from "@material-ui/core/Select";
import hljs from "highlight.js";
import Card from "@material-ui/core/Card";

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
  loadComplete: boolean,
  isAddOptionDisabled: boolean,
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
      loadComplete: false,
      isAddOptionDisabled: false,
    };
  }

  componentDidMount = () => {
    this.loadCategories();
    this.updateCodeSyntaxHighlighting();
  };

  componentDidUpdate() {
    this.updateCodeSyntaxHighlighting();
  }

  updateCodeSyntaxHighlighting = () => {
    document.querySelectorAll("pre code").forEach(block => {
      hljs.highlightBlock(block);
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
        this.updateQuestionType(null);
      });
    } else {
      this.props.resetQuestion();
      this.setState({
        loadComplete: true
      });
      this.updateQuestionType(null);
    }
  };

  change = (property, event) => {
    const newQuestion = Object.assign({}, this.props.question);
    newQuestion[property] = event.target ? event.target.value : event.getData();
    this.props.updateQuestion(newQuestion);
  };

  updateQuestionType = (event) => {
    let questionType = this.props.question.questionType;
    if( event != null) {
      questionType = event.target ? event.target.value : event.getData();
    }
    // console.log("updateQuestionType() => questionType: ", questionType);
    if(questionType === "TEXT") {
      this.setState( {
        isAddOptionDisabled: true,
      });
      let newQuestion = Object.assign({}, this.props.question);
      newQuestion.questionType = questionType;
      newQuestion.choices = [];
      this.props.updateQuestion(newQuestion);
    }
    else if(questionType === "SELECT_ONE"){
      this.setState( {
        isAddOptionDisabled: false,
      });
      let newQuestion = Object.assign({}, this.props.question);
      newQuestion.questionType = questionType;
      if( newQuestion.choices.some( o => o.correct===true)) {
        const c = newQuestion.choices.find( o => o.correct===true);
        const updatedChoices = this.setInArrayForCorrectness(c, newQuestion.choices, "uuid", "SELECT_ONE");
        newQuestion.choices = updatedChoices;
        this.props.updateQuestion(newQuestion);
        return;
      }
    }
    else {
      this.setState( {
        isAddOptionDisabled: false,
      });
    }
  }

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
    const newChoices = this.setInArrayForCorrectness(c, newQuestion.choices, "uuid", this.props.question.questionType);
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

  setInArrayForCorrectness = (obj: any, arr: Array<any>, idtype: string, questionType: string): Array<any> => {
    const newArray = [];
    if( questionType === "SELECT_ONE") {
      arr.forEach(o => {
        if (o[idtype] != obj[idtype]) {
          o.correct = false;
          newArray.push(o);
        } else {
          newArray.push(obj);
        }
      });
    }
    else {
      return this.setInArray(obj, arr, idtype);
    }
    return newArray;
  };

  checkAtLeastOneCorrectAnswer = () => {
    if( this.props.question.questionType === "TEXT") {
      return true;
    }
    const answerChoices = this.props.question.choices;
    if( answerChoices.length == 0)
    {
      alertify.error("Error. Current type of question must have answer choice.");
      return false;
    }
    return answerChoices.some( o => o.correct === true );
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
      body: "",
      showSyntaxCheck: false,
      syntaxCheckMessage: "",
    });
    newQuestion.codes = newCodes;
    this.props.updateQuestion(newQuestion);
  };

  checkCode = (id: number) => () => {
    const code = this.getCode(id);
    const codeBody = code.body;
    code.showSyntaxCheck = !code.showSyntaxCheck;
    const newQuestion = Object.assign({}, this.props.question);
    const newCodes = this.setInArray(code, newQuestion.codes, "languageId");
    newQuestion.codes = newCodes;
    this.props.updateQuestion(newQuestion);
    if(code.showSyntaxCheck) {
      api
          .checkSyntax(codeBody)
          .then(msg => {
            code.syntaxCheckMessage = msg.data;
            const newQuestion = Object.assign({}, this.props.question);
            const newCodes = this.setInArray(code, newQuestion.codes, "languageId");
            newQuestion.codes = newCodes;
            this.props.updateQuestion(newQuestion);
          })
          .catch(e => {
            alertify.error("Syntax check error", false);
            console.log(e);
          });
    }
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
    const checkConstraint = this.checkAtLeastOneCorrectAnswer();
    if( !checkConstraint) {
      alertify.error("Error. There must be at least one correct answer.");
      return;
    }
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

    const questionAnswerTypes = ["SELECT_ONE","SELECT_MANY", "TEXT"];
    let langListLowerCase = [];
    if (this.state.langList && this.state.langList.length > 0) {
      langListLowerCase = this.state.langList.map(l => {
        return { language: l.name.toLowerCase(), label: l.name };
      });
    }
    let classicEditorConfiguration = {
      toolbar: {
        items: [
          "heading", "|", "undo", "redo", "|",
          "selectAll", "bold", "italic", "underline", "strikethrough", "subscript", "superscript", "fontColor", "fontBackgroundColor", "blockQuote", "|",
          "code", "codeBlock", "|" ,
          "numberedList", "bulletedList", "|" ,
          "alignment", "indent", "outdent", "|" ,
          "specialCharacters","insertTable", "link", "imageUpload", "mediaEmbed",  "|" ,
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
        // languages: [{ language: 'plaintext', label: 'CodeBlock'}],
        languages: [{ language: 'plaintext', label: 'CodeBlock'}].concat(langListLowerCase),
      },
      // extraPlugins: [MyCustomUploadAdapterPlugin],
      // simpleUpload: {
      //   uploadUrl:  api.uploadImage,
      //   // headers: {
      //   //   Authorization: 'Bearer ',
      //   // },
      // },
      image: {
        upload: {
          types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff' ],
        }
      },
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
        languages: [{ language: 'plaintext', label: 'CodeBlock'}, { language: 'java', label: 'Java' },],
      },
    };
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
                    style={{ width: 135 }}
                    onChange={event => this.change("level", event)}
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
                <Select
                    label="Answer type"
                    style={{ width: 135 }}
                    value={question.questionType}
                    onChange={event => {
                      this.change("questionType", event);
                      this.updateQuestionType(event);
                    }}
                >
                  {questionAnswerTypes.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                  ))}
                </Select>
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
                    disabled={this.state.isAddOptionDisabled}
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
                                    const languageLowerCase = this.getLanguage(code.languageId).name.toLowerCase();
                                    editor.setData(`<pre><code class=\"language-${languageLowerCase}\">${code.body}</code></pre>`);
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
                                <Button
                                    color="primary"
                                    size="small"
                                    onClick={this.checkCode(code.languageId)}
                                >
                                  Syntax Check
                                </Button>
                                <IconButton
                                    aria-label="Delete"
                                    onClick={this.deleteCode(code.languageId)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Grid>
                            </Grid>
                            { code.showSyntaxCheck ?
                                (<Grid container spacing={3}>
                                  <link rel="stylesheet" href="https://unpkg.com/highlight.js@10.1.2/styles/default.css"/>
                                  <Grid item xs={12}>
                                    <Card style={{backgroundColor: '#f8f8f8'}} dangerouslySetInnerHTML={{__html: code.body}}/>
                                  </Grid>
                                  { code.syntaxCheckMessage && code.syntaxCheckMessage.length > 0 ?
                                      (
                                          <Grid item xs={12}>
                                            <Card style={{whiteSpace: 'pre-wrap'}}> {code.syntaxCheckMessage} </Card>
                                          </Grid>
                                      ) : null
                                  }
                                </Grid>) : null }
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
