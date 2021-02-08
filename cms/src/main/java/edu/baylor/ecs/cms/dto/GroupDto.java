package edu.baylor.ecs.cms.dto;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class GroupDto {
    private static final Logger logger = LogManager.getLogger(GroupDto.class.getName());
    private String category;
    private String level;
    private String language;
    private String count;

    public GroupDto() {
    }

    public String getCategory() {
        logger.info(Thread.currentThread().getId() + ":" + "getCategory" + "()");
        return category;
    }

    public void setCategory(String category) {
        logger.info(Thread.currentThread().getId() + ":" + "setCategory" + "(" + category + ")");
        this.category = category;
    }

    public String getLevel() {
        logger.info(Thread.currentThread().getId() + ":" + "getLevel" + "()");
        return level;
    }

    public void setLevel(String level) {
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

    public String getCount() {
        logger.info(Thread.currentThread().getId() + ":" + "getCount" + "()");
        return count;
    }

    public void setCount(String count) {
        logger.info(Thread.currentThread().getId() + ":" + "setCount" + "(" + count + ")");
        this.count = count;
    }
}
