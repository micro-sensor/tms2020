package baylor.csi.questionManagement.controller;

import baylor.csi.questionManagement.model.Category;
import baylor.csi.questionManagement.model.dto.CategoryInfoDto;
import baylor.csi.questionManagement.repository.CategoryRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/categoryinfo")
public class CategoryInfoController {
    private static final Logger logger = LogManager.getLogger(CategoryInfoController.class.getName());
    @Autowired
    private CategoryRepository categoryRepository;

    @CrossOrigin
    @GetMapping("")
    public List<CategoryInfoDto> findAllCategoryInfos() {

        logger.info("Request comes for finding all category informations");
        List<CategoryInfoDto> categoryInfoDtos = new ArrayList<>();
        logger.info("Repository method called to find all categories");
        logger.info("Repository performs database query");
        List<Category> categories = categoryRepository.findAll();
        for (Category category : categories) {
            CategoryInfoDto categoryInfoDto = new CategoryInfoDto(category.getId(), category.getName(), category.getDescription(), categoryRepository.getQuestionCountDtoById(category.getId()));
            categoryInfoDtos.add(categoryInfoDto);
        }
        logger.info("Returning the result");

        return categoryInfoDtos;
    }


}
