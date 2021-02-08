package edu.baylor.ems.dto;

import java.util.List;

public class QuestionReviewDto {
    private Integer id;

    private String body;

    private List<ChoiceReviewDto> choices;

    private String code;

    public QuestionReviewDto() {
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

    public List<ChoiceReviewDto> getChoices() {
        return choices;
    }

    public void setChoices(List<ChoiceReviewDto> choices) {
        this.choices = choices;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
