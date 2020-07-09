package edu.baylor.ecs.seer.usermanagement.entity;

/**
 * This provides a basic DTO for keycloak users. It is used for
 * data transfer with the UMS frontend.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
public class Credential {

    private String type = "password";

    private String value;

    private boolean temporary;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean isTemporary() {
        return temporary;
    }

    public void setTemporary(boolean temporary) {
        this.temporary = temporary;
    }

    public Credential(String value, boolean temporary) {
        this.value = value;
        this.temporary = temporary;
    }
}
