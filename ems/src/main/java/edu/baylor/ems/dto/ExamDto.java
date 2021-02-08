package edu.baylor.ems.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class ExamDto {
    private Integer id;
    private String examinee;
    private Integer issuer;
    private Integer configurationId;
    private String configurationName;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "US/Central")
    private Date examDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "US/Central")
    private Date submissionDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date examDateFrom;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date examDateTo;

    public ExamDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getExaminee() {
        return examinee;
    }

    public void setExaminee(String examinee) {
        this.examinee = examinee;
    }

    public Integer getIssuer() {
        return issuer;
    }

    public void setIssuer(Integer issuer) {
        this.issuer = issuer;
    }

    public Integer getConfigurationId() {
        return configurationId;
    }

    public void setConfigurationId(Integer configurationId) {
        this.configurationId = configurationId;
    }

    public Date getExamDate() {
        return examDate;
    }

    public void setExamDate(Date examDate) {
        this.examDate = examDate;
    }

    public Date getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(Date submissionDate) {
        this.submissionDate = submissionDate;
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
}
