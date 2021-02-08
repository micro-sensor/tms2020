package edu.baylor.ems.dto;

import edu.baylor.ems.model.Choice;

public class ChoiceEmsDto {
    private Integer id;
    private String body;
    private boolean chosen;

    public ChoiceEmsDto() {
    }

    public ChoiceEmsDto(Choice choice) {
        this.id = choice.getId();
        this.body = choice.getBody();
        this.chosen = choice.isChosen();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public boolean isChosen() {
        return chosen;
    }

    public void setChosen(boolean chosen) {
        this.chosen = chosen;
    }
}
