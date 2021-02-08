package edu.baylor.ecs.cms.dto;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class QuestionCountsDto {
    private static final Logger logger = LogManager.getLogger(QuestionCountsDto.class.getName());
    private Integer id;
    private Integer level;
    private String language;
    private Integer count;

    public QuestionCountsDto() {
    }

    public Integer getId() {
        logger.info(Thread.currentThread().getId() + ":" + "getId" + "()");
        return id;
    }

    public void setId(Integer id) {
        logger.info(Thread.currentThread().getId() + ":" + "setId" + "(" + id + ")");
        this.id = id;
    }

    public Integer getLevel() {
        logger.info(Thread.currentThread().getId() + ":" + "getLevel" + "()");
        return level;
    }

    public void setLevel(Integer level) {
        logger.info(Thread.currentThread().getId() + ":" + "setLevel" + "(" + level + ")");
        this.level = level;
    }

    public String getLanguage() {
        logger.info(Thread.currentThread().getId() + ":" + "getLanguage" + "()");
        return language;
    }

    public void setLanguage(String language) {
        logger.info(Thread.currentThread().getId() + ":" + "setLanguage" + "(" + language + ")");
        this.language = language;
    }

    public Integer getCount() {
        logger.info(Thread.currentThread().getId() + ":" + "getCount" + "()");
        return count;
    }

    public void setCount(Integer count) {
        logger.info(Thread.currentThread().getId() + ":" + "setCount" + "(" + count + ")");
        this.count = count;
    }

}
