package baylor.csi.questionManagement.controller;

import baylor.csi.questionManagement.Exception.JPAException;
import baylor.csi.questionManagement.Exception.ParsingException;
import baylor.csi.questionManagement.Exception.ResourceNotFoundException;
import baylor.csi.questionManagement.model.Category;
import baylor.csi.questionManagement.model.Question;
import baylor.csi.questionManagement.model.dto.CategoryListDto;
import baylor.csi.questionManagement.repository.CategoryRepository;
import baylor.csi.questionManagement.repository.QuestionRepository;
import baylor.csi.questionManagement.service.XmlParserService;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.validation.Valid;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/category")
public class CategoryController {

    private static final Logger logger = LogManager.getLogger(CategoryInfoController.class.getName());
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private XmlParserService xmlParserService;

    @CrossOrigin
    @GetMapping("")
    public List<Category> findAllCategories() {

        logger.info("Request comes for finding all categories");
        logger.info("Repository called for database query");
        logger.info("Returning the result");
        return categoryRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("/{categoryId}")
    public Category findCategoriesById(@PathVariable Long categoryId) {
        logger.info("Request comes for finding specific category with id");
        logger.info("Repository called for database query");
        logger.info("Returning the result");
        return categoryRepository.findById(categoryId).orElse(null);
    }

    @CrossOrigin
    @PostMapping("")
    public Category createCategory(@Valid @RequestBody Category category) {
        logger.info("Request comes for creating category");
        logger.info("Repository called for creating new category");
        logger.info("Returning the new category");
        return categoryRepository.save(category);
    }

    @CrossOrigin
    @PutMapping("/{categoryId}")
    public Category updateCategory(@PathVariable Long categoryId, @Valid @RequestBody Category categoryRequest) {
        logger.info("Request comes for updating new category");
        logger.info("Repository called for updating existing category");
        logger.info("Returning the updated category");
        return categoryRepository.findById(categoryId)
                .map(category -> {
                    category.setName(categoryRequest.getName());
                    category.setDescription(categoryRequest.getDescription());
                    return categoryRepository.save(category);
                }).orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + categoryId));
    }

    @CrossOrigin
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<?> deleteCateogry(@PathVariable Long categoryId) {
        logger.info("Request comes for deleting new category");
        logger.info("Repository called for deleting existing category");
        logger.info("Returning the success/error notification");
        return categoryRepository.findById(categoryId)
                .map(category -> {
                    category.getQuestions().clear();
                    List<Question> questions = questionRepository.findByCategoryId(categoryId);
                    for (Question question : questions) {
                        question.getCategories().remove(category);
                        questionRepository.save(question);
                    }
                    categoryRepository.save(category);
                    categoryRepository.delete(category);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + categoryId));
    }

    @CrossOrigin
    @DeleteMapping("")
    public ResponseEntity<?> deleteAllCategories() {
        logger.info("Request comes for deleting all categories");
        try {
            logger.info("Repository method called to delete all categories");
            categoryRepository.deleteAll();
            logger.info("Returning the success notification");
        } catch (Exception e) {
            throw new JPAException("Deletion of some categories violate database constraints");
        }
        return ResponseEntity.ok().build();
    }

    @CrossOrigin
    @GetMapping("/export")
    public String exportAllCategories() throws IOException {
        logger.info("Request come for exporting all categories");
        logger.info("Repository called for finding all categories");
        List<Category> categoryList = categoryRepository.findAll();
        logger.info("Creating database object");
        CategoryListDto categoryListDto = new CategoryListDto(categoryList);

        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);
        logger.info("Returning export result");
        if (categoryListDto != null)
            return xmlMapper.writeValueAsString(categoryListDto);

        return "Failed to export";
    }

    @CrossOrigin
    @PostMapping(value = "/import")
    public ResponseEntity<?> uploadCategories(@RequestParam("file") MultipartFile file) throws IOException, ParserConfigurationException, SAXException {

        logger.info("Request comes for import upload categories from XML file");
        if (file.isEmpty()) {
            throw new ResourceNotFoundException("File upload fail when importing category(s)");
        }
        logger.info("Configuring update procedure");

        Set<Category> categoryList = null;

        byte[] bytes = file.getBytes();
        InputStream myInputStream = new ByteArrayInputStream(bytes);
        // create a new DocumentBuilderFactory
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        // use the factory to create a document builder
        DocumentBuilder builder = factory.newDocumentBuilder();
        // create a new document from input stream
        Document doc = builder.parse(myInputStream);
        doc.getDocumentElement().normalize();
        // get NodeList with "category" tag
        NodeList categoryNodeList = doc.getElementsByTagName("category");
        if (categoryNodeList.getLength() == 0) {
            throw new ParsingException("XML document doesn't contain tags with name category");
        }
        logger.info("Parsing XML file");
        categoryList = xmlParserService.parseCategoryNodeList(categoryNodeList, null);

        if (categoryList != null) {
            try {
                logger.info("Repository called for persisting all category");
                logger.info("Repository perform db query to persist category list");
                categoryRepository.saveAll(categoryList);
            } catch (Exception e) {
                e.printStackTrace();
                throw new JPAException("Category import failed. Reason: " + e.getMessage());
            }
        }
        logger.info("Returning success notification");

        return ResponseEntity.ok().build();
    }


}
