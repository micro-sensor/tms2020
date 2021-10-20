package baylor.csi.questionManagement.controller;

import baylor.csi.questionManagement.Exception.JPAException;
import baylor.csi.questionManagement.Exception.ParsingException;
import baylor.csi.questionManagement.Exception.ResourceNotFoundException;
import baylor.csi.questionManagement.enums.QuestionTypeEnum;
import baylor.csi.questionManagement.model.*;
import baylor.csi.questionManagement.model.dto.QuestionDto;
import baylor.csi.questionManagement.model.dto.QuestionListDto;
import baylor.csi.questionManagement.repository.*;
import baylor.csi.questionManagement.service.JavaSyntaxCheckService;
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
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.validation.Valid;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/question")
public class QuestionController {
    private static final Logger logger = LogManager.getLogger(QuestionController.class.getName());
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ChoiceRepository choiceRepository;
    @Autowired
    private CodeRepository codeRepository;
    @Autowired
    private LanguageRepository languageRepository;
    @Autowired
    private XmlParserService xmlParserService;
    @Autowired
    private JavaSyntaxCheckService javaSyntaxCheckService;

    @CrossOrigin
    @GetMapping("/all")
    public List<Question> findAllQuestions() {
        logger.info("Request for find all questions");
        return questionRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("/{questionId}")
    public Question findQuestionById(@PathVariable Long questionId) {
        logger.info("Request for find question by Id");
        return questionRepository.findById(questionId).orElse(null);
    }

    @CrossOrigin
    @GetMapping("")
    public List<QuestionDto> findQuestionByCateogryIdAndName(@RequestParam Map<String, Object> customQuery) {
        logger.info("Request for find question by category Id and Name");

        String name = "";
        logger.info("Validiating the custom query");
        if (customQuery.containsKey("name")) {
            name = customQuery.get("name").toString().toLowerCase();
        }

        List<QuestionDto> dtos = new ArrayList<>();
        if (customQuery.containsKey("categoryId")) {
            Long categoryId = Long.parseLong(customQuery.get("categoryId").toString());
            dtos = questionRepository.findByCategoryIdAndName(categoryId, "%" + name + "%");
        } else {
            dtos = questionRepository.findQuestionDtoByName("%" + name + "%");
        }

        for (QuestionDto dto : dtos) {
            dto.setCategoriesNames(categoryRepository.getNamesByQuestionId(dto.getId()));
        }
        logger.info("Returning the result");
        return dtos;
    }

    @CrossOrigin
    @PostMapping("")
    public Question createQuestion(@Valid @RequestBody Map<String, Object> payload) {
        logger.info( "Request for create question");
        try {
            Question question = new Question();
            logger.info("creating new question");
            question.setBody((String) payload.get("body"));
            question.setLevel(Integer.parseInt(payload.get("level").toString()));
            question.setTitle((String) payload.get("title"));
            ArrayList<Object> categoryIds = (ArrayList<Object>) payload.get("categories");
            logger.info("Setting information for new question");
            for (Object id : categoryIds) {
                Category category = categoryRepository.findById(Long.parseLong(id.toString())).orElse(null);
                if (category != null) {
                    question.getCategories().add(category);
                }
            }
            ArrayList<Map<String, Object>> choices = (ArrayList<Map<String, Object>>) payload.get("choices");
            for (Map<String, Object> choice : choices) {
                createNewChoiceFromJSonForQuestion(question, choice);
            }
            ArrayList<Map<String, Object>> codes = (ArrayList<Map<String, Object>>) payload.get("codes");
            for (Map<String, Object> code : codes) {
                createNewCodeFromJsonForQuestion(question, code);

            }

            String questionType = (String) payload.get("type");
            logger.info("Setting question type");

            if (questionType.equals("SELECT_ONE")) {
                question.setQuestionType(QuestionTypeEnum.SELECT_ONE);
            } else if (questionType.equals("TEXT")) {
                question.setQuestionType(QuestionTypeEnum.TEXT);
            } else {
                question.setQuestionType(QuestionTypeEnum.SELECT_MANY);
            }

            logger.info("Returning the result");

            return questionRepository.save(question);

        } catch (Exception e) {
            e.printStackTrace();
            throw new JPAException("Question created failed because of " + e.getMessage());
        }

    }

    @CrossOrigin
    @PutMapping("/{questionId}")
    public Question updateQuestion(@PathVariable Long questionId, @Valid @RequestBody Map<String, Object> payload) {
        logger.info("Request for update question");
        try {
            Question question = questionRepository.findById(questionId).orElse(null);
            if (question == null) {
                throw new ResourceNotFoundException("Question not found with id " + questionId);
            }
            logger.info("Setting update information for existing question")
            question.setTitle(payload.get("title").toString());
            question.setBody(payload.get("body").toString());
            question.setLevel(Integer.parseInt(payload.get("level").toString()));
            Set<Choice> choicesInDB = question.getChoices();
            HashSet<Long> choicesInDBIds = new HashSet<>();
            for (Choice c : choicesInDB) {
                choicesInDBIds.add(c.getId());
            }
            ArrayList<Map<String, Object>> choices = (ArrayList<Map<String, Object>>) payload.get("choices");
            HashSet<Long> updatedChoicesId = new HashSet<>();
            for (Map<String, Object> choice : choices) {
                if (choice.containsKey("id")) {
                    updatedChoicesId.add(Long.parseLong(choice.get("id").toString()));
                }
            }

            Iterator<Choice> it = choicesInDB.iterator();
            ArrayList<Choice> deleteChoices = new ArrayList<>();
            while (it.hasNext()) {
                Choice c = it.next();
                if (updatedChoicesId.add(c.getId())) {
                    deleteChoices.add(c);
                    it.remove();
                }
            }
            for (Choice c : deleteChoices) {
                question.getChoices().remove(c);
                choiceRepository.delete(c);
            }

            for (Map<String, Object> choice : choices) {
                if (!choice.containsKey("id")) {
                    createNewChoiceFromJSonForQuestion(question, choice);
                } else if (choicesInDBIds.add(Long.parseLong(choice.get("id").toString()))) {
                    createNewChoiceFromJSonForQuestion(question, choice);
                } else {
                    updateChoiceFromJSonForQuestion(choicesInDB, choice);
                }
            }

            Set<Code> codesInDB = question.getCodes();
            HashSet<Long> codesInDBIds = new HashSet<>();
            for (Code c : codesInDB) {
                codesInDBIds.add(c.getId());
            }
            ArrayList<Map<String, Object>> codes = (ArrayList<Map<String, Object>>) payload.get("codes");


            HashSet<Long> updatedcodesId = new HashSet<>();
            for (Map<String, Object> code : codes) {
                if (code.containsKey("id")) {
                    updatedcodesId.add(Long.parseLong(code.get("id").toString()));
                }
            }
            Iterator<Code> iter = codesInDB.iterator();
            ArrayList<Code> deleteCodes = new ArrayList<>();
            while (iter.hasNext()) {
                Code c = iter.next();
                if (updatedcodesId.add(c.getId())) {
                    deleteCodes.add(c);
                    iter.remove();
                }
            }

            for (Code c : deleteCodes) {
                question.getCodes().remove(c);
                codeRepository.delete(c);
            }


            for (Map<String, Object> code : codes) {
                if (!code.containsKey("id")) {
                    createNewCodeFromJsonForQuestion(question, code);
                } else if (codesInDBIds.add(Long.parseLong(code.get("id").toString()))) {
                    createNewCodeFromJsonForQuestion(question, code);
                } else {
                    updateCodeFromJsonForQuestion(codesInDB, code);
                }

            }


            Set<Category> categoriesInDB = question.getCategories();
            HashSet<Long> categoriesIdsInDB = new HashSet<>();
            ArrayList<Object> categoryIds = (ArrayList<Object>) payload.get("categories");
            ArrayList<Long> categoryIdsLong = categoryIds.stream().map(c -> Long.parseLong(c.toString())).collect(Collectors.toCollection(ArrayList::new));

            Iterator<Category> catIter = categoriesInDB.iterator();
            ArrayList<Category> deleteCategories = new ArrayList<>();
            while (catIter.hasNext()) {
                Category c = catIter.next();
                if (!categoryIdsLong.contains(c.getId())) {
                    deleteCategories.add(c);
                    catIter.remove();
                }
            }
            for (Category c : deleteCategories) {
                question.getCategories().remove(c);
            }


            for (Category c : categoriesInDB) {
                categoriesIdsInDB.add(c.getId());
            }

            for (Long id : categoryIdsLong) {
                if (categoriesIdsInDB.add(id)) {
                    Category c = categoryRepository.findById(id).orElse(null);
                    if (c != null) {
                        question.getCategories().add(c);
                    }

                }
            }

            logger.info("Returning updated question");

            return questionRepository.save(question);

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new JPAException("Question updating failed because of " + e.getMessage());
        }

    }

    private void createNewCodeFromJsonForQuestion(Question question, Map<String, Object> code) {
        logger.info(Thread.currentThread().getId() + ":" + "createNewCodeFromJsonForQuestion" + "(" + question + "," + code + ")");
        Long languageId = Long.parseLong(code.get("languageId").toString());
        Language language = languageRepository.findById(languageId).orElse(null);
        if (language != null) {
            Code c = new Code();
            c.setBody(code.get("body").toString());
            c.setLanguage(language);
            c.setQuestion(question);
            question.getCodes().add(c);
        }
    }

    private void updateCodeFromJsonForQuestion(Set<Code> codesInDB, Map<String, Object> code) {
        logger.info(Thread.currentThread().getId() + ":" + "updateCodeFromJsonForQuestion" + "(" + codesInDB + "," + code + ")");
        for (Code c : codesInDB) {
            if (c.getId() == null) {
                continue;
            }
            if (c.getId().equals(Long.parseLong(code.get("id").toString()))) {
                Long languageId = Long.parseLong(code.get("languageId").toString());
                Language language = languageRepository.findById(languageId).orElse(null);
                if (language != null) {
                    c.setBody(code.get("body").toString());
                    c.setLanguage(language);
                }
            }
        }
    }

    private void createNewChoiceFromJSonForQuestion(Question question, Map<String, Object> choice) {
        logger.info(Thread.currentThread().getId() + ":" + "createNewChoiceFromJSonForQuestion" + "(" + question +
                "," + choice + ")");
        Choice c = new Choice();
        c.setBody(choice.get("body").toString());
        c.setCorrect(Boolean.parseBoolean(choice.get("correct").toString()));
        c.setQuestion(question);
        question.getChoices().add(c);
    }

    private void updateChoiceFromJSonForQuestion(Set<Choice> choicesInDB, Map<String, Object> choice) {
        logger.info(Thread.currentThread().getId() + ":" + "updateChoiceFromJsonForQuestion" + "(" + choicesInDB + "," + choice + ")");
        for (Choice c : choicesInDB) {
            if (c.getId() == null) {
                continue;
            }
            if (c.getId().equals(Long.parseLong(choice.get("id").toString()))) {
                c.setBody(choice.get("body").toString());
                c.setCorrect(Boolean.parseBoolean(choice.get("correct").toString()));
            }
        }
    }

    @CrossOrigin
    @DeleteMapping("/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        logger.info(Thread.currentThread().getId() + ":" + "deleteQuestion" + "(" + questionId + ")");
        return questionRepository.findById(questionId)
                .map(question -> {
                    questionRepository.delete(question);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Question not found with id " + questionId));
    }

    @CrossOrigin
    @DeleteMapping("")
    public ResponseEntity<?> deleteAllQuestions() {
        logger.info(Thread.currentThread().getId() + ":" + "deleteAllQuestions" + "()");
        questionRepository.deleteAll();
        return ResponseEntity.ok().build();
    }

    @CrossOrigin
    @GetMapping("/export")
    public String exportAllQuestions() throws IOException {
        logger.info(Thread.currentThread().getId() + ":" + "exportAllQuestions" + "()");

        List<Question> questionsList = questionRepository.findAll();
        QuestionListDto questions = new QuestionListDto(questionsList);

        System.out.println("Exporting all questions ");
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);


        if (questions != null)
            return xmlMapper.writeValueAsString(questions);

        return "Failed to export";
    }

    @CrossOrigin
    @PostMapping("/exportFiltered")
    public String exportFilteredQuestions(@RequestParam("questionIdList") List<Long> idList) throws IOException {
        logger.info(Thread.currentThread().getId() + ":" + "exportFilteredQuestions" + "(" + idList + ")");

        for (Long i : idList) {
            System.out.println(i);
        }

        List<Question> questionsList = questionRepository.findAllById(idList);
        QuestionListDto questions = new QuestionListDto(questionsList);

        System.out.println("Exporting filtered questions ");
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);

        if (questions != null)
            return xmlMapper.writeValueAsString(questions);

        return "Failed to export";
    }

    @CrossOrigin
    @GetMapping("/export/{questionId}")
    public String exportQuestionById(@PathVariable Long questionId) throws IOException {
        logger.info(Thread.currentThread().getId() + ":" + "exportQuestionById" + "(" + questionId + ")");
        Question question = questionRepository.findById(questionId).orElse(null);

        System.out.println("Exporting the question " + questionId);
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);

        if (question != null)
            return xmlMapper.writeValueAsString(question);

        return "Failed to export";
    }

    @CrossOrigin
    @PostMapping(value = "/import")
//    public ResponseEntity<?> uploadQuestions(@RequestParam("file") MultipartFile file) throws IOException {
    public ResponseEntity<?> uploadQuestions(@RequestParam("file") MultipartFile file) throws IOException, ParserConfigurationException, SAXException {
        logger.info(Thread.currentThread().getId() + ":" + "uploadQuestions" + "(" + file + ")");

        if (file.isEmpty()) {
            throw new ResourceNotFoundException("File upload fail when importing question(s)");
        }

        Set<Question> questionList = null;

        byte[] bytes = file.getBytes();
        InputStream myInputStream = new ByteArrayInputStream(bytes);
        // create new DocumentBuilderFactory
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        // use the factory to create a documentbuilder
        DocumentBuilder builder = factory.newDocumentBuilder();
        // create a new document from input stream
        Document doc = builder.parse(myInputStream);
        doc.getDocumentElement().normalize();
        // get NodeList with "question" tag
        NodeList questionNodeList = doc.getElementsByTagName("question");
        if (questionNodeList.getLength() == 0) {
            throw new ParsingException("XML document doesn't contain tags with name question");
        }
        questionList = xmlParserService.parseQuestionNodeList(questionNodeList);

        if (questionList != null) {
            try {
                questionRepository.saveAll(questionList);
            } catch (Exception e) {
                e.printStackTrace();
                throw new JPAException("Question import failed. Reason: " + e.getMessage());
            }
        }

        return ResponseEntity.ok().build();
    }

    @CrossOrigin
    @PostMapping("/checkSyntax")
    public String checkCodeSnippet(@Valid @RequestBody Map<String, Object> payload) throws ParserConfigurationException, IOException, SAXException {
        logger.info(Thread.currentThread().getId() + ":" + "chechCodeSnippet" + "(" + payload + ")");

        String codeBody = (String) payload.get("codeBody");

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        InputSource is = new InputSource(new StringReader(codeBody));
        Document doc = builder.parse(is);
        doc.getDocumentElement().normalize();
        // get NodeList with "code" tag
        NodeList codeNodeList = doc.getElementsByTagName("code");
        if (codeNodeList.getLength() > 1) {
            throw new ParsingException("Code snippet body should contain only one code block");
        } else if (codeNodeList.getLength() == 1) {
            codeBody = codeNodeList.item(0).getTextContent();
        }

        System.out.println("Code body: " + codeBody);
//        return codeBody;
        return javaSyntaxCheckService.check(codeBody);
    }


}
