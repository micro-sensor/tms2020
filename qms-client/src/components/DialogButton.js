/**
 * @flow
 *
 * Button that pops a dialog on click. Contents of dialog in props.children.
 */
import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

export type Props = {
    buttonLabel?: string,
    buttonClasses?: string,
    title?: string,
    subtitle?: string,
    icon?: React$Element<*>,
    provideControl?: boolean,
    variant?: string,
    maxWidth?: string,
    dialogContent?: (Function, Function) => any,
    dialogActions?: (Function, Function) => any,
    onclose?: any
};

type State = {
    open: boolean
};

class DialogButton extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleRequestClose = () => {
        const onclose = this.props.onclose;
        if (onclose) {
            onclose();
        }
        this.setState({ open: false });
        window.location.reload();
    };

    render() {
        const {
            title,
            subtitle,
            buttonLabel,
            buttonClasses,
            icon,
            dialogContent,
            dialogActions,
            maxWidth,
            ...other
        } = this.props;
        const { open } = this.state;
        return (
            <div>
                {icon ? (
                    <IconButton onClick={this.handleClickOpen} {...other}>
                        {icon}
                    </IconButton>
                ) : (
                    <Button
                        className={buttonClasses}
                        onClick={this.handleClickOpen}
                        color="primary"
                        {...other}
                    >
                        {buttonLabel || "Open dialog"}
                    </Button>
                )}
                <Dialog
                    open={open}
                    onClose={this.handleRequestClose}
                    fullWidth={true}
                    maxWidth={maxWidth}
                >
                    <DialogTitle>{title || "Dialog"}</DialogTitle>
                    {dialogContent && (
                        <DialogContent>
                            {subtitle && <DialogContentText>{subtitle}</DialogContentText>}
                            {dialogContent(this.handleRequestClose, this.handleClickOpen)}
                        </DialogContent>
                    )}
                    {dialogActions && (
                        <DialogActions>
                            {dialogActions(this.handleRequestClose, this.handleClickOpen)}
                        </DialogActions>
                    )}
                    <DialogActions>
                        <Button onClick={this.handleRequestClose}
                                color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default DialogButton;
