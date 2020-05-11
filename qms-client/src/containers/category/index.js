//@flow

import React from "react";
import Grid from "@material-ui/core/Grid";
import { Paper, Divider, Typography, Button, Dialog } from "@material-ui/core";
import CategoryIcon from "@material-ui/icons/CategoryRounded";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CategoryList from "./components/CategoryList";
import CategoryDetail from "./components/CategoryDetail";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as api from "./api";
import DialogButton from "../../components/DialogButton";
import FileUpload from "../FileUpload";
import alertify from 'alertifyjs';

type Props = {
  showSnack: (string, boolean) => void,
  showConfirmDialog: (string, () => void) => void
};
type State = {
  selectedIndex: number,
  categoryList: Array<{
    id: number,
    name: string,
    description: string
  }>,
  loaded: boolean,
  err: boolean,
  open: boolean,
  newEmpty: {
    name: boolean,
    description: boolean
  },
  newCategory: {
    name: string,
    description: string
  }
};

class Category extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      loaded: false,
      err: false,
      open: false,
      newEmpty: { name: false, description: false },
      categoryList: [],
      newCategory: {
        name: "",
        description: ""
      }
    };
  }

  componentDidMount() {
    this.fetchAll();
  }

  fetchAll = () => {
    api
      .getAll()
      .then(m => {
        if (!m.data) {
          this.setState({
            loaded: true,
            err: true
          });
          alertify.error("Could not load categories.", false);
        } else {
          const list = m.data.sort(function(a, b) {
            return a.name < b.name ? -1 : 1;
          });
          this.setState({
            loaded: true,
            err: false,
            categoryList: m.data
          });
        }
      })
      .catch(e => {
        this.setState({
          loaded: true,
          err: true
        });
        alertify.error("Could not load categories.", false);
        console.log(e);
      });
  };

  handleListItemClick = (event, id) => {
    this.setState({
      selectedIndex: id
    });
  };

  handleChange = (attribute, create) => event => {
    if (create) {
      const newCat = Object.assign({}, this.state.newCategory);
      newCat[attribute] = event.target.value;
      const empty = Object.assign({}, this.state.newEmpty);
      empty[attribute] = event.target.value.length == 0;
      this.setState({
        newCategory: newCat,
        newEmpty: empty
      });
    } else {
      const newList = this.state.categoryList;
      const newCat = Object.assign({}, newList[this.state.selectedIndex]);
      newCat[attribute] = event.target.value;
      newList[this.state.selectedIndex] = newCat;
      this.setState({
        categoryList: newList
      });
    }
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  saveCategory = () => {
    const c = this.state.categoryList[this.state.selectedIndex];
    api
      .save(c, c.id)
      .then(c => {
        const newList = this.state.categoryList;
        newList[this.state.selectedIndex] = c.data;
        this.setState(
          {
            categoryList: newList
          },
          () => {
            alertify.success("Success. Category updated.");
          }
        );
      })
      .catch(e => {
        alertify.error("Error. Could not save category.");
      });
  };

  createCategory = () => {
    api
      .create(this.state.newCategory)
      .then(c => {
        this.setState(
          {
            open: false,
            newCategory: { name: "", description: "" }
          },
          () => {
            this.fetchAll();
            alertify.success("Success. Category created.");
          }
        );
      })
      .catch(e => {
        console.log(e);
        this.setState({
          newEmpty: {
            name: this.state.newCategory.name == 0,
            description: this.state.newCategory.description == 0
          }
        });

        alertify.error("Error. Could not create category.");
      });
  };

  exportAll = () => {
    api
        .exportAll()
        .then(msg => {
          var FileSaver = require('file-saver');
          var blob = new Blob([msg.data], {type: "text/xml"});
          FileSaver.saveAs(blob, "categories");
          alertify.success("Success. All questions exported.");
        })
        .catch(e => {
          alertify.error("Error. Could not export all questions.");
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
          alertify.error("Error. Could not delete all questions. Reason: " + e.response.data.message, false);
          console.log(e.response.data.message);
        });
  };

  callDeleteCategory = () => {
    const dtl = this.state.categoryList[this.state.selectedIndex];
    alertify.confirm('Delete Category', "Do you really want to delete " + dtl.name + "?",
      () => {
        api
          .deleteCategory(this.state.categoryList[this.state.selectedIndex].id)
          .then(c => {
            this.setState(
              {
                selectedIndex: -1
              },
              () => {
                this.fetchAll();
                alertify.success('Success. Category removed.');
              }
            );
          })
          .catch(e => {
            alertify.error('Error. Could not remove category.');
          });
      },
      function(){} // noop for cancel
    );
  };

  render() {
    if (!this.state.loaded || this.state.err || !this.state.categoryList) {
      return <div />;
    }

    const dtl = this.state.categoryList[this.state.selectedIndex];
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={5} lg={5}>
          <Paper>
            <CategoryList
              selectedIndex={this.state.selectedIndex}
              handleListItemClick={this.handleListItemClick}
              items={this.state.categoryList}
            />
          </Paper>
          <br />
          <Grid container direction="column">
            <div>
              <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.setState({
                      open: true
                    });
                  }}
              >
                Create New
              </Button>
              <Dialog
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {`Create new Category: ` + this.state.newCategory.name}
                </DialogTitle>
                <DialogContent>
                  <div style={{ minWidth: 552 }}>
                    <CategoryDetail
                        handleChangeBody={this.handleChange("description", true)}
                        handleChangeName={this.handleChange("name", true)}
                        handleSave={this.createCategory}
                        detail={this.state.newCategory}
                        create
                        nameError={this.state.newEmpty.name}
                        descError={this.state.newEmpty.description}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Grid container style={{ marginTop: 5}}>
              <DialogButton
                  title="IMPORT CATEGORIES"
                  buttonLabel="IMPORT CATEGORIES"
                  variant="contained"
                  history = {this.props.history}
                  dialogContent={(close, open) => {
                    return (
                        <FileUpload
                            postUrl={api.importCategories}
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
              <Button
                  style={{ marginLeft: 5}}
                  variant="contained"
                  color="primary"
                  onClick={() =>  this.exportAll()}
              >
                EXPORT
              </Button>
              <Button
                  style={{ marginLeft: 5}}
                  variant="contained"
                  color="secondary"
                  onClick={() =>  this.removeAll()}
              >
                Delete All
              </Button>

            </Grid>
          </Grid>
        </Grid>
        {this.state.categoryList.length > 0 && dtl && (
          <Grid item xs={12} sm={12} md={7} lg={7}>
            <Paper>
              <CategoryDetail
                handleChangeBody={this.handleChange("description")}
                handleChangeName={this.handleChange("name")}
                handleSave={this.saveCategory}
                handleDelete={this.callDeleteCategory}
                detail={dtl}
                nameError={dtl.name.length == 0}
                descError={dtl.description.length == 0}
              />
            </Paper>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default Category;
