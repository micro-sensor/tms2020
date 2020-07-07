package edu.baylor.ecs.seer.usermanagement.dto;

import edu.baylor.ecs.seer.usermanagement.entity.Credential;

import java.util.List;
import java.util.Map;

/**
 * This provides a basic DTO for keycloak users. It is used for
 * data transfer with the UMS frontend.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
public class UserDto {

    public String username;

    public String email;

    public String lastName;

    public String firstName;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", lastName='" + lastName + '\'' +
                ", firstName='" + firstName + '\'' +
                '}';
    }
}
