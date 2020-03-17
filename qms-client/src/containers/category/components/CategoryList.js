//@flow

import React from "react";
import { Fragment } from "react";
import { Paper, Divider, Typography } from "@material-ui/core";
import CategoryIcon from "@material-ui/icons/CategoryRounded";
import CloseIcon from "@material-ui/icons/RemoveRounded";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const CategoryList = props => {
  return (
    <Fragment>
      {!props.noTitle && (
        <Fragment>
          <div style={{ padding: 16 }}>
            <Typography variant="h4">Categories</Typography>
          </div>
          <Divider />
        </Fragment>
      )}

      <List component="nav">
        {props.noSelection && (
          <ListItem
            button
            selected={props.selectedIndex === -1}
            onClick={event => props.handleListItemClick(event, -1)}
          >
            <ListItemIcon>
              <CloseIcon />
            </ListItemIcon>
            <ListItemText primary={"No category selected."} />
          </ListItem>
        )}
        {props.items.map((c, idx) => {
          return (
            <ListItem
              key={c.id}
              button
              selected={props.selectedIndex === idx}
              onClick={event => props.handleListItemClick(event, idx)}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary={c.name} />
            </ListItem>
          );
        })}
      </List>
    </Fragment>
  );
};

export default CategoryList;
