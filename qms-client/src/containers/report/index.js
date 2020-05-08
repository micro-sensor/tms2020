//@flow

import React from "react";
import Grid from "@material-ui/core/Grid";
import { Paper, Divider, Typography, Button, Dialog } from "@material-ui/core";
import CategoryIcon from "@material-ui/icons/CategoryRounded";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as api from "./api";
import alertify from 'alertifyjs';

type Props = {
  showSnack: (string, boolean) => void,
  showConfirmDialog: (string, () => void) => void
};

type State = {
  loaded: boolean,
  err: boolean,
  data: Array<{
    name: string,
    total: number,
    counts: Array<{
      language: string,
      total: number,
      byLevel: Array<number>
    }>
  }>
};

class Report extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      err: false,
      data: []
    };
  }

  componentDidMount() {
    this.fetchAll();
  }

  fetchAll = () => {
    api
      .getAll()
      .then(m => {
        var result = [];
        m.data.forEach(c => {
          const cat = {};
          cat.name = c.name;
          cat.counts = [];
          let total = 0;
          c.questionCountDtos.forEach(dto => {
            total += dto.count;
            // find the language
            let lang = undefined;
            for (let index = 0; index < cat.counts.length; index++) {
              const element = cat.counts[index];
              if (element.language == dto.language) {
                lang = element;
                break;
              }
            }
            if (lang == undefined) {
              lang = {
                language: dto.language,
                total: 0,
                byLevel: [0, 0, 0, 0, 0]
              };
              cat.counts.push(lang);
            }
            lang.total += dto.count;
            lang.byLevel[dto.level - 1] = dto.count;
          });
          cat.total = total;
          result.push(cat);
        });
        this.setState({
          err: false,
          loaded: true,
          data: result
        });
      })
      .catch(e => {
        this.setState({
          loaded: true,
          err: true
        });
        alertify.error("Could not load question statistics.");
        console.log(e);
      });
  };

  render() {
    if (!this.state.loaded || this.state.err) {
      return <div />;
    }

    return (
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <Typography variant="h4" style={{ marginLeft: 2 }}>
            Question count report
          </Typography>
        </Grid>
        {this.state.data.map(cat => {
          return (
            <Grid item xs={12} key={cat.name}>
              <Paper style={{ padding: 32 }}>
                <Grid container justify="space-between">
                  <Typography variant="h6">{cat.name}</Typography>
                  {/* <Typography
                    variant="subtitle2"
                    style={{ position: "relative", top: 8 }}
                  >
                    {"total: " + cat.total}
                  </Typography> */}
                </Grid>
                <Divider />

                <table style={{ width: "100%" }}>
                  <thead>
                    <tr style={{ textAlign: "left", height: 32 }}>
                      <th>Language</th>
                      <th>Total</th>
                      <th>L1</th>
                      <th>L2</th>
                      <th>L3</th>
                      <th>L4</th>
                      <th>L5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.counts.map(lang => (
                      <tr key={lang.language} style={{ height: 32 }}>
                        <td>
                          {lang.language == "" ? (
                            <span style={{ fontStyle: "italic" }}>
                              no code snippet
                            </span>
                          ) : (
                            lang.language
                          )}
                        </td>
                        <td>{lang.total}</td>
                        {lang.byLevel.map((level, index) => (
                          <td key={index}>{level}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default Report;
