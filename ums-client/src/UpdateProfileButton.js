import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import alertify from 'alertifyjs';

/**
 * This button will send updated user profile details to the backend
 * so that they will be saved.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
class UpdateProfileButton extends Component {

    constructor(props) {
        super(props);
        this.state = { response: null };
    }

    /**
     * On a click, make a PUT request to the backend to persist the user details
     * to keycloak.
     *
     * @author J.R. Diehl
     * @version 0.1
     */
    handleClick = () => {
        fetch('https://tcs.ecs.baylor.edu/ums/userinfo/updateUser', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.props.keycloak.token,
            },
            body: JSON.stringify(this.props.profileData),
        }).then(response => {
            if (response.status === 200 || response.status === 204) {
                alertify.success('Profile updated!');
                return response.json();
            }
            else {
                alertify.error('Failed to update profile!');
                return { status: response.status, message: response.statusText }
            }
        }).then(json => this.setState((state, props) => ({
            response: JSON.stringify(json, null, 2)
        }))).catch(err => {
            console.log(err);
            this.setState((state, props) => ({ response: err.toString() }))
        });

        // fetch('https://tcs.ecs.baylor.edu/ums/userinfo/addUserRoles/' + this.props.profileData.username, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + this.props.keycloak.token,
        //     },
        //     body: JSON.stringify(this.props.roles),
        // }).then(response => {
        //     if (response.status === 200) {
        //         return response.json();
        //     } else {
        //         return { status: response.status, message: response.statusText }
        //     }
        // }).then(json => this.setState((state, props) => ({
        //     response: JSON.stringify(json, null, 2)
        // }))).catch(err => {
        //     this.setState((state, props) => ({ response: err.toString() }))
        // });

    };

    render() {
        return (
            <div className="UpdateProfileButton">
                <Button variant='primary' onClick={this.handleClick}>Update Profile</Button>
            </div>
        );
    }
}

export default UpdateProfileButton;
