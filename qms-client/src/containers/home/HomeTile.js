//@flow

import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Button,
  CardActions,
  CardContent
} from "@material-ui/core";

type Props = {
  onClick: () => void,
  image: any,
  title: string,
  description: string,
  buttonLabel: string
};

const HomeTile = (props: Props) => {
  return (
    <Card>
      <CardActionArea onClick={props.onClick}>
        <CardMedia
          image={props.image}
          title={process.title}
          style={{ height: 160 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {props.title}
          </Typography>
          <Typography component="p">{props.description}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={props.onClick}
          className="actionButton"
        >
          {props.buttonLabel}
        </Button>
      </CardActions>
    </Card>
  );
};

export default HomeTile;
