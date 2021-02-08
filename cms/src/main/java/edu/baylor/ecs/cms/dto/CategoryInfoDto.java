package edu.baylor.ecs.cms.dto;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

public class CategoryInfoDto {
    private static final Logger logger = LogManager.getLogger(CategoryInfoDto.class.getName());
    private Integer id;
    private String name;
    private String description;
    private List<CategoryInfoDto> categoryInfoDtos;

    public CategoryInfoDto() {
    }

    public Integer getId() {
        logger.info(Thread.currentThread().getId() + ":" + "getId" + "()");
        return id;
    }

    public void setId(Integer id) {
        logger.info(Thread.currentThread().getId() + ":" + "setId" + "(" + id + ")");
        this.id = id;
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

    public List<CategoryInfoDto> getCategoryInfoDtos() {
        logger.info(Thread.currentThread().getId() + ":" + "getCategoryInfoDtos" + "()");
        return categoryInfoDtos;
    }

    public void setCategoryInfoDtos(List<CategoryInfoDto> categoryInfoDtos) {
        logger.info(Thread.currentThread().getId() + ":" + "setCategoryInfoDtos" + "(" + categoryInfoDtos + ")");
        this.categoryInfoDtos = categoryInfoDtos;
    }
}
