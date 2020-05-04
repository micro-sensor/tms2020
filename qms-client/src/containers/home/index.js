//@flow

import React from "react";
import {
  Card,
  CardActions,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid
} from "@material-ui/core";
import categoryimg from "../../resources/category.png";

import langimg from "../../resources/languages.jpeg";
import questionimg from "../../resources/question.jpg";
import HomeTile from "./HomeTile";

const categoryDescription =
  "Categories allow you distinguish between different types of questions. A single question can belong to multiple categories. Based on categories, the questions in test are selected.";

const langDescription =
  "Each question might contain a code snippet. Defineprogramming languages for each code snippet, to adjustthe same question for multiple languages.";

const questionDesc =
  "Search, filter and edit your library of questions. Define difficulty level, categories and code snippets for each question.";

class Home extends React.Component {
  render() {
    return (
      <div>
        <Grid container justify="center" spacing={4}>
          <Grid item xs={12} lg={10}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={4}>
                <HomeTile
                  onClick={() => this.props.history.push("/category")}
                  title="Categories"
                  description={categoryDescription}
                  image={categoryimg}
                  buttonLabel="edit"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <HomeTile
                  onClick={() => this.props.history.push("/language")}
                  title="Languages"
                  description={langDescription}
                  image={langimg}
                  buttonLabel="edit"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <HomeTile
                  onClick={() => this.props.history.push("/question")}
                  title="Questions"
                  description={questionDesc}
                  image={questionimg}
                  buttonLabel="edit"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Home;
