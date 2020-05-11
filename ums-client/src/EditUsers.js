import React, {Component} from 'react';
import {Row, Col, Tab, Nav, Form, Button} from 'react-bootstrap';
import UserListTab from "./UserListTab";
import UserPane from "./UserPane";

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
            searchVal: ''
        };
    }

    render() {
        const {names } = this.state;
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
                console.log("http.response: ", http);
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
            console.log("http.response: ", http);
            const resp = JSON.parse(http.response);
            this.setState({
                names: resp,
            });
        };
        http.send();

    }

    componentDidMount() {
        console.log("keycloak token:", this.props.keycloak);
    }
}

export default EditUsers;
