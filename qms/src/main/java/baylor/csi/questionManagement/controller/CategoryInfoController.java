package baylor.csi.questionManagement.controller;

import baylor.csi.questionManagement.Exception.ResourceNotFoundException;
import baylor.csi.questionManagement.model.Category;
import baylor.csi.questionManagement.model.dto.CategoryInfoDto;
import baylor.csi.questionManagement.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/categoryinfo")
public class CategoryInfoController {
    @Autowired
    private CategoryRepository categoryRepository;

    @CrossOrigin
    @GetMapping("")
    public List<CategoryInfoDto> findAllCategoryInfos() {
        List<CategoryInfoDto> categoryInfoDtos = new ArrayList<>();
        List<Category> categories = categoryRepository.findAll();
        for(Category category: categories) {
            CategoryInfoDto categoryInfoDto = new CategoryInfoDto(category.getId(),category.getName(),category.getDescription(),categoryRepository.getQuestionCountDtoById(category.getId()));
            categoryInfoDtos.add(categoryInfoDto);
        }

        return categoryInfoDtos;
    }


}
