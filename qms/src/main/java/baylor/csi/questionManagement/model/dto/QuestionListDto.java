package baylor.csi.questionManagement.model.dto;

import baylor.csi.questionManagement.model.Question;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import java.util.List;

@JacksonXmlRootElement(localName = "questions")
public class QuestionListDto {

    private List<Question> questions;

    public QuestionListDto() {
    }

    public QuestionListDto(List<Question> questions) {
        this.questions = questions;
    }

    @JacksonXmlProperty(localName = "question")
    @JacksonXmlElementWrapper(useWrapping = false)
    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

}
