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
        let users = this.state.names.map((item, id) =>
            <UserListTab key={id} user={item}/>
        );
        let userPanes = this.state.names.map((item, id) =>
            <UserPane key={item} keycloak={this.props.keycloak} user={item}/>
        );
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
                                <Button variant='primary' type='submit' onClick={e => {this.handleClick(e)}}>Show All</Button>
                            </Form.Group>
                        </Form>
                        <br/>
                        <Nav variant='pills' className='flex-column'>
                            {users}
                        </Nav>
                    </Col>
                    <Col xl='auto'>
                        <Tab.Content>
                            {userPanes}
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
        const http = new XMLHttpRequest();
        http.open('GET', 'http://tcs.ecs.baylor.edu/ums/userinfo/usernamesLike?username=' + value);
        http.setRequestHeader("Authorization", "Bearer " + this.props.keycloak.token);
        http.onload = (event) => {
            const resp = JSON.parse(http.response);
            this.setState({
                names: resp,
            });
        };
        http.send();
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleClick(event) {
        event.preventDefault();
        this.setState({
            searchVal: ''
        });
        this.handleChange(event);
    }
}

export default EditUsers;
