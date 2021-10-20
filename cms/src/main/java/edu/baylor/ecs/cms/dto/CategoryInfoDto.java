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
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<CategoryInfoDto> getCategoryInfoDtos() {
        return categoryInfoDtos;
    }

    public void setCategoryInfoDtos(List<CategoryInfoDto> categoryInfoDtos) {
        this.categoryInfoDtos = categoryInfoDtos;
    }
}
