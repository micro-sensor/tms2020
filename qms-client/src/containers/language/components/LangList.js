//@flow

import React from "react";
import { Fragment } from "react";
import { Paper, Divider, Typography } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/ChatRounded";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const LangList = props => {
  return (
    <Fragment>
      <div style={{ padding: 16 }}>
        <Typography variant="h4">Languages</Typography>
      </div>
      <Divider />
      <List component="nav">
        {props.items.map((c, idx) => {
          return (
            <ListItem
              key={c.id}
              button
              selected={props.selectedIndex === idx}
              onClick={event => props.handleListItemClick(event, idx)}
            >
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary={c.name} />
            </ListItem>
          );
        })}
      </List>
    </Fragment>
  );
};

export default LangList;
