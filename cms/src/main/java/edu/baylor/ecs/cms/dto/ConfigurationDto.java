package edu.baylor.ecs.cms.dto;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

public class ConfigurationDto {
    private static final Logger logger = LogManager.getLogger(ConfigurationDto.class.getName());
    private String name;
    private String description;
    private List<GroupDto> groups;

    public ConfigurationDto() {
    }

    public String getName() {
        logger.info(Thread.currentThread().getId() + ":" + "getName" + "()");
        return name;
    }

    public void setName(String name) {

        logger.info(Thread.currentThread().getId() + ":" + "setName" + "(" + name + ")");
        this.name = name;
    }

    public String getDescription() {
        logger.info(Thread.currentThread().getId() + ":" + "getDescription" + "()");
        return description;
    }

    public void setDescription(String description) {
        logger.info(Thread.currentThread().getId() + ":" + "setDescription" + "(" + description + ")");
        this.description = description;
    }

    public List<GroupDto> getGroups() {

        logger.info(Thread.currentThread().getId() + ":" + "getGroups" + "()");
        return groups;
    }

    public void setGroups(List<GroupDto> groups) {
        logger.info(Thread.currentThread().getId() + ":" + "setGroups" + "(" + groups + ")");
        this.groups = groups;
    }
}
