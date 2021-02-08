package baylor.csi.questionManagement.model.dto;

import baylor.csi.questionManagement.model.Choice;
import baylor.csi.questionManagement.model.Code;

import java.util.ArrayList;
import java.util.List;

public class QuestionSingleCodeDto {
    private String title;
    private Integer level;
    private String body;
    private Code code;
    private List<Choice> choices = new ArrayList<>();
    private String questionType;

    public QuestionSingleCodeDto(String title, Integer level, String body, Code code, List<Choice> choices, String questionType) {
        this.title = title;
        this.level = level;
        this.body = body;
        this.code = code;
        this.choices = choices;
        this.questionType = questionType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Code getCode() {
        return code;
    }

    public void setCode(Code code) {
        this.code = code;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }
}
