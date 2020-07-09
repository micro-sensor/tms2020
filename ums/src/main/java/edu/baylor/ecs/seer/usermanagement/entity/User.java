package edu.baylor.ecs.seer.usermanagement.entity;

import java.util.List;
import java.util.Map;

/**
 * This provides a basic DTO for keycloak users. It is used for
 * data transfer with the UMS frontend.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
public class User {

    private String id;

    private String username;

    private String email;

    private String lastName;

    private String firstName;

    private boolean enabled;

    private List<Credential> credentials;

    private Map<String, List<String>> attributes;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public boolean isEnabled() { return enabled; }

    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public Map<String, List<String>> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String, List<String>> attributes) {
        this.attributes = attributes;
    }

    public List<Credential> getCredentials() { return credentials; }

    public void setCredentials(List<Credential> credentials) { this.credentials = credentials; }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", lastName='" + lastName + '\'' +
                ", firstName='" + firstName + '\'' +
                '}';
    }
}
