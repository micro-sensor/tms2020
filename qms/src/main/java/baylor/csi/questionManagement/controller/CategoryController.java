package baylor.csi.questionManagement.controller;

import baylor.csi.questionManagement.Exception.ResourceNotFoundException;
import baylor.csi.questionManagement.model.Category;
import baylor.csi.questionManagement.model.Question;
import baylor.csi.questionManagement.repository.CategoryRepository;
import baylor.csi.questionManagement.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private QuestionRepository questionRepository;

    @CrossOrigin
    @GetMapping("")
    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("/{cateogryId}")
    public Category findCategoriesById(@PathVariable Long cateogryId) {
        return categoryRepository.findById(cateogryId).orElse(null);
    }

    @CrossOrigin
    @PostMapping("")
    public Category createCategory(@Valid @RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @CrossOrigin
    @PutMapping("/{cateogryId}")
    public Category updateCategory(@PathVariable Long cateogryId, @Valid @RequestBody Category categoryRequest) {
        return categoryRepository.findById(cateogryId)
                .map(category -> {
                    category.setName(categoryRequest.getName());
                    category.setDescription(categoryRequest.getDescription());
                    return categoryRepository.save(category);
                }).orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + cateogryId));
    }

    @CrossOrigin
    @DeleteMapping("/{cateogryId}")
    public ResponseEntity<?> deleteCateogry(@PathVariable Long cateogryId) {
        return categoryRepository.findById(cateogryId)
                .map(category -> {
                    category.getQuestions().clear();
                    List<Question> questions = questionRepository.findByCategoryId(cateogryId);
                    for (Question question:questions) {
                        question.getCategories().remove(category);
                        questionRepository.save(question);
                    }
                    categoryRepository.save(category);
                    categoryRepository.delete(category);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + cateogryId));
    }


}
