// @flow
import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CloudUpload from "@material-ui/icons/CloudUpload";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ChatIcon from "@material-ui/icons/ChatRounded";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";

type Props = {
    classes: Object,
    sending: boolean,
    text?: string,
    uploaded: boolean,
    file: Object,
};

const styles = theme => ({
    dropzone: { cursor: "pointer", height: "100%" },
    icon: { width: 48, height: 48 }
});

const DropZoneContent = (props: Props) => {
    return (
        <Grid
            container
            spacing={2}
            direction="column"
            justify="center"
            alignItems="center"
            className={props.classes.dropzone}
        >
            <Grid item>
                {props.sending ? (
                    <CircularProgress />
                ) : (
                    <CloudUpload color="error" className={props.classes.icon} />
                )}
            </Grid>
            <Grid item>
                <Typography variant="caption" align="center">
                    {props.sending
                        ? "Uploading..."
                        : props.text ? props.text : "Drop or click to upload"}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="h6" align="center">
                    {props.uploaded
                        ? props.file.name
                        : null}
                </Typography>
                {/*{props.files ?*/}
                {/*    props.files.map((file) => {*/}
                {/*    return (*/}
                {/*        <Typography variant="button" align="center">*/}
                {/*        {props.uploaded*/}
                {/*            ? props.file.name*/}
                {/*            : null}*/}
                {/*        </Typography>*/}
                {/*    );})*/}
                {/*    : null*/}
                {/*}*/}
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(DropZoneContent);
