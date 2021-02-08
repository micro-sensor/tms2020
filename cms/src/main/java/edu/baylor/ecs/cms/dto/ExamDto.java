package edu.baylor.ecs.cms.dto;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class ExamDto {
    private static final Logger logger = LogManager.getLogger(ExamDto.class.getName());
    private Integer id;
    private String examinee;
    private String issuer;
    private String configurationId;
    private String examDate;

    public ExamDto() {
    }

    public Integer getId() {
        logger.info(Thread.currentThread().getId() + ":" + "getId" + "()");
        return id;
    }

    public void setId(Integer id) {
        logger.info(Thread.currentThread().getId() + ":" + "setId" + "(" + id + ")");
        this.id = id;
    }

    public String getExaminee() {
        logger.info(Thread.currentThread().getId() + ":" + "getExaminee" + "()");
        return examinee;
    }

    public void setExaminee(String examinee) {
        logger.info(Thread.currentThread().getId() + ":" + "setExaminee" + "(" + examinee + ")");
        this.examinee = examinee;
    }

    public String getIssuer() {
        logger.info(Thread.currentThread().getId() + ":" + "getIssuer" + "()");
        return issuer;
    }

    public void setIssuer(String issuer) {
        logger.info(Thread.currentThread().getId() + ":" + "setIssuer" + "(" + issuer + ")");
        this.issuer = issuer;
    }

    public String getConfigurationId() {
        logger.info(Thread.currentThread().getId() + ":" + "getConfigurationId" + "()");
        return configurationId;
    }

    public void setConfigurationId(String configurationId) {
        logger.info(Thread.currentThread().getId() + ":" + "setConfigurationId" + "(" + configurationId + ")");
        this.configurationId = configurationId;
    }

    public String getExamDate() {
        logger.info(Thread.currentThread().getId() + ":" + "getExamDate" + "()");
        return examDate;
    }

    public void setExamDate(String examDate) {
        logger.info(Thread.currentThread().getId() + ":" + "setExamDate" + "(" + examDate + ")");
        this.examDate = examDate;
    }
}
