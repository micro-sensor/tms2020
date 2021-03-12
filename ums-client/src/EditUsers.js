import React, {Component} from 'react';
import {Row, Col, Tab, Nav, Form, Button} from 'react-bootstrap';
import UserListTab from "./UserListTab";
import UserPane from "./UserPane";
import * as api from "./api";
import DialogButton from "./components/DialogButton";
import FileUpload from "./containers/FileUpload";
import alertify from 'alertifyjs';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

/**
 * This is the edit users page, which allows admins and above
 * to make changes to the profile information of other users.
 * Any personal data that could be changed in the profile view for a
 * user can be changed, except that an admin cannot set a new password
 * for any user in this view. Additionally, users can be promoted to
 * admin level here (they cannot be demoted from this view though).
 *
 * @author J.R. Diehl
 * @version 0.1
 */
class EditUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            names: [],
            searchVal: '',
            importResponse: '',
        };
    }

    render() {
        const {names, importResponse } = this.state;
        return (
            <Tab.Container defaultActiveKey={this.state.names[0]}>
                <Row>
                    <Col xl='auto'>
                        <br/>
                        <Form onSubmit={e => this.handleSubmit(e)}>
                            <Form.Group inline onChange={(event) => {this.handleChange(event)}}>
                                <Form.Control size='lg' type='text' placeholder='enter a username to search' name='searchVal' value={this.state.searchVal} />
                            </Form.Group>
                            <Form.Group inline>
                                <Button variant='primary' type="submit" onClick={e => {this.handleSearch(e)}}>Search</Button>
                                <Button variant='primary' type="submit" style={{marginLeft: "5px"}} type='submit' onClick={e => {this.handleAll(e)}}>Show All</Button>
                                <DialogButton
                                    style={{
                                        marginTop: "5px"
                                    }}
                                    title="IMPORT USERS"
                                    buttonLabel="IMPORT USERS"
                                    variant="contained"
                                    dialogContent={(close, open) => {
                                        return (
                                            <Grid container>
                                                <Grid item xs>
                                                    <FileUpload
                                                        postUrl={api.importUsers}
                                                        keycloak={this.props.keycloak}
                                                        accept={[".csv,application/vnd.ms-excel,.xlt,application/vnd.ms-excel,.xla,application/vnd.ms-excel,.xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xltx,application/vnd.openxmlformats-officedocument.spreadsheetml.template,.xlsm,application/vnd.ms-excel.sheet.macroEnabled.12,.xltm,application/vnd.ms-excel.template.macroEnabled.12,.xlam,application/vnd.ms-excel.addin.macroEnabled.12,.xlsb,application/vnd.ms-excel.sheet.binary.macroEnabled.12"]}
                                                        // multiple={true}
                                                        maxSize={10000000}
                                                        showMessage={(message) => alertify.error(message)}
                                                        rejectMessage="File rejected. Files must be smaller than 10 GB"
                                                        onSuccess={() => {
                                                            alertify.success("File successfully processed.");
                                                        }}
                                                        updateResponse={(response)=> {this.setState({
                                                            importResponse: response,
                                                        });}}
                                                    />
                                                </Grid>
                                                <Grid item xs>
                                                    <Typography variant="subtitle2" align="center">Import Response</Typography>
                                                    <Typography variant="body1">{importResponse}</Typography>
                                                </Grid>
                                            </Grid>
                                        );
                                    }}
                                />
                            </Form.Group>
                        </Form>
                        <br/>
                        <Nav variant='pills' className='flex-column'>
                            {
                                names.length > 0
                                    ? names.map((item, id) => {
                                        return ( <UserListTab key={id} user={item}/>);
                                    })
                                    : null
                            }
                        </Nav>
                    </Col>
                    <Col xl='auto'>
                        <Tab.Content>
                            {
                                names.length > 0
                                    ? names.map((item, id) => {
                                        return ( <UserPane key={item} keycloak={this.props.keycloak} user={item}/>);
                                    })
                                    : null
                            }
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleSearch(event) {
        event.preventDefault();
        const value = this.state.searchVal;
        const http = new XMLHttpRequest();
        if( value.length > 0) {
            http.open('GET', 'https://tcs.ecs.baylor.edu/ums/userinfo/usernamesLike?username=' + value);
            http.setRequestHeader("Authorization", "Bearer " + this.props.keycloak.token);
            http.onload = (event) => {
                if (http.response == null || http.response == "") {
                    console.log("http response is null or empty");
                    return;
                }
                const resp = JSON.parse(http.response);
                this.setState({
                    names: resp,
                });
            };
            http.send();
        }
        else {
            this.handleAll(event);
        }
    }

    handleAll(event) {
        event.preventDefault();
        const http = new XMLHttpRequest();
        http.open('GET', 'https://tcs.ecs.baylor.edu/ums/userinfo/usernames');
        http.setRequestHeader("Authorization", "Bearer " + this.props.keycloak.token);
        http.onload = (event) => {
            if (http.response == null || http.response == "") {
                console.log("http response is null or empty");
                return;
            }
            // console.log("http.response: ", http);
            const resp = JSON.parse(http.response);
            this.setState({
                names: resp,
            });
        };
        http.send();
    }
}

export default EditUsers;
