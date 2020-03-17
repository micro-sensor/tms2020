package edu.baylor.ems.dto;

import javax.validation.constraints.NotNull;
import java.util.List;

public class QuestionEmsDto {

    private Integer id;

    private String body;

    private List<ChoiceEmsDto> choices;

    private String code;

    private boolean flagged;

    public QuestionEmsDto(){}

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

    public List<ChoiceEmsDto> getChoices() {
        return choices;
    }

    public void setChoices(List<ChoiceEmsDto> choices) {
        this.choices = choices;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isFlagged() {
        return flagged;
    }

    public void setFlagged(boolean flagged) {
        this.flagged = flagged;
    }
}
