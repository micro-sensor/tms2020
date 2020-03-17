//@flow
import React from "react";
import { Fragment } from "react";
import {
  Paper,
  Divider,
  Typography,
  withStyles,
  TextField,
  Button
} from "@material-ui/core";
import CategoryIcon from "@material-ui/icons/CategoryRounded";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 300
  },
  textFieldMultiline: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "calc(100% - 32px)"
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  buttons: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    padding: "8px 8px"
  },
  buttonC: {
    margin: "4px 8px"
  }
});

const CategoryDetail = props => {
  const {
    handleChangeBody,
    handleChangeName,
    classes,
    handleSave,
    handleDelete,
    create,
    nameError,
    descError
  } = props;
  const { id, name, description } = props.detail;
  return (
    <Fragment>
      {!create && (
        <div style={{ padding: 16 }}>
          <Typography variant="h4">{name}</Typography>
        </div>
      )}
      <Divider />
      <TextField
        style={{ marginLeft: 16 }}
        id="standard-name"
        label="Name"
        className={classes.textField}
        value={name}
        onChange={handleChangeName}
        margin="normal"
        error={nameError}
      />
      <br />
      <TextField
        style={{ marginLeft: 16 }}
        id="standard-multiline-flexible"
        label="Description"
        multiline
        rowsMax="10"
        rows="4"
        value={description}
        onChange={handleChangeBody}
        className={classes.textFieldMultiline}
        margin="normal"
        variant="outlined"
        error={descError}
      />
      <div className={classes.buttons}>
        {!create && (
          <Button
            color="secondary"
            className={classes.buttonC}
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}

        <Button
          color="primary"
          className={classes.buttonC}
          variant="contained"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(CategoryDetail);
