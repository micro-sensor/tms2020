package edu.baylor.ecs.seer.usermanagement.entity;

/**
 * This is an extremely barebones DTO for keycloak
 * roles. It only wraps the name of the role, and is used
 * to communicate with the UMS frontend.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
public class Role {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
