package edu.baylor.ems.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.baylor.ems.model.Question;

import java.util.Date;
import java.util.List;

public class ExamReviewDto {
    private Integer id;
    private Integer correct;
    private Integer sum;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "US/Central")
    private Date examDate;
    private String configurationName;
    private List<Question> questions;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date examDateFrom;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date examDateTo;
    private String examinee;

    public ExamReviewDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCorrect() {
        return correct;
    }

    public void setCorrect(Integer correct) {
        this.correct = correct;
    }

    public Integer getSum() {
        return sum;
    }

    public void setSum(Integer sum) {
        this.sum = sum;
    }

    public Date getExamDate() {
        return examDate;
    }

    public void setExamDate(Date examDate) {
        this.examDate = examDate;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getConfigurationName() {
        return configurationName;
    }

    public void setConfigurationName(String configurationName) {
        this.configurationName = configurationName;
    }

    public Date getExamDateFrom() {
        return examDateFrom;
    }

    public void setExamDateFrom(Date examDateFrom) {
        this.examDateFrom = examDateFrom;
    }

    public Date getExamDateTo() {
        return examDateTo;
    }

    public void setExamDateTo(Date examDateTo) {
        this.examDateTo = examDateTo;
    }

    public String getExaminee() {
        return examinee;
    }

    public void setExaminee(String examinee) {
        this.examinee = examinee;
    }
}
