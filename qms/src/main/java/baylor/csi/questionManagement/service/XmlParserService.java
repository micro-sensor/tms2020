package baylor.csi.questionManagement.service;

import baylor.csi.questionManagement.Exception.JPAException;
import baylor.csi.questionManagement.Exception.ParsingException;
import baylor.csi.questionManagement.enums.QuestionTypeEnum;
import baylor.csi.questionManagement.model.*;
import baylor.csi.questionManagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.HashSet;
import java.util.Set;

@Service
public class XmlParserService {

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

    public Set<Category> parseCategoryNodeList(NodeList categoryNodeList, Question question) {

        // It's assumed that categoryNodeList.getLength() > 0 check is done before calling this method
        Set<Category> categoryList = new HashSet<>();
        for (int i = 0; i < categoryNodeList.getLength(); i++) {
            Node categoryNode = categoryNodeList.item(i);
            if (categoryNode.getNodeType() == Node.ELEMENT_NODE) {
                Element categoryElement = (Element) categoryNode;
                Category category = null;
                // 1. check if "id" tag exists: if yes, retrieve corresponding category
                // If not, check if category with that "name" exists: if yes, retrieve corresponding category
                // if not, create new category
                if (categoryElement.getElementsByTagName("id").getLength() > 0) {
                    // if there are multiple "id" tags inside category, first one will be parsed
                    Long categoryId = Long.valueOf(categoryElement.getElementsByTagName("id").item(0).getTextContent());
                    category = categoryRepository.findById(categoryId).orElse(null);
                    // TODO: if not null, notify frontend that category with id in XML might be edited
                }
                if (category == null) {
                    if (categoryElement.getElementsByTagName("name").getLength() > 0) {
                        // if there are multiple "name" tags inside category, first one will be parsed
                        String categoryName = categoryElement.getElementsByTagName("name").item(0).getTextContent();
                        category = categoryRepository.findByName(categoryName);
                        // TODO: if not null, notify frontend that category with name in XML might be edited
                        if (category == null) {
                            category = new Category();
                            category.setName(categoryName);
                        }
                    } else {
                        throw new ParsingException("Category should have id or name");
                    }
                }
                // description:
                if (categoryElement.getElementsByTagName("description").getLength() > 0) {
                    // if there are multiple "description" tags inside category, first one will be parsed
                    category.setDescription(categoryElement.getElementsByTagName("description").item(0).getTextContent());
                }
                if (category.getDescription() == null) { // || category.getDescription().isEmpty()) {
                    throw new ParsingException("Category should have a description");
                }
                // persist categories: should I?
                if (category != null) {
                    try {
                        category = categoryRepository.save(category);
                        categoryRepository.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new JPAException("Category save in Question import failed. Reason: " + e.getMessage());
                    }
                }

                // Question:
                if (question != null) {
                    category.getQuestions().add(question);
                }
                categoryList.add(category);
            }
        }
        return categoryList;
    }

    private Set<Choice> parseChoiceNodeList(NodeList choiceNodeList, Question question) {
        // It's assumed that choiceNodeList.getLength() > 0 check is done before calling this method
        Set<Choice> choiceList = new HashSet<>();
        for (int i = 0; i < choiceNodeList.getLength(); i++) {
            Node choiceNode = choiceNodeList.item(i);
            if (choiceNode.getNodeType() == Node.ELEMENT_NODE) {
                Element choiceElement = (Element) choiceNode;
                Choice choice = null;
                if (choiceElement.getElementsByTagName("id").getLength() > 0) {
                    // if there are multiple "id" tags inside choice, first one will be parsed
                    Long choiceId = Long.valueOf(choiceElement.getElementsByTagName("id").item(0).getTextContent());
                    choice = choiceRepository.findById(choiceId).orElse(null);
                    // if choice already exists, then Question associated with it must be same. If not, create new Choice
                    if (choice != null) {
                        if (question != null) {
                            if (choice.getQuestion() != question) {
                                choice = new Choice();
                            }
                            /// TODO: else, notify frontend that choice with id in XML might be edited
                        } else {
                            throw new ParsingException("Choice must be associated with question");
                        }
                    }
                }
                if (choice == null) {
                    choice = new Choice();
                }
                // body:
                if (choiceElement.getElementsByTagName("body").getLength() > 0) {
                    // if there are multiple "body" tags inside choice, first one will be parsed
                    choice.setBody(choiceElement.getElementsByTagName("body").item(0).getTextContent());
                }
                if (choice.getBody() == null) {
                    throw new ParsingException("Choice should have a body");
                }
                // correct:
                if (choiceElement.getElementsByTagName("correct").getLength() > 0) {
                    // if there are multiple "correct" tags inside choice, first one will be parsed
                    choice.setCorrect(Boolean.parseBoolean(choiceElement.getElementsByTagName("correct").item(0).getTextContent()));
                }
                if (choice.getCorrect() == null) {
                    // by default, Answer choice will be wrong (false):
                    choice.setCorrect(false);
                }
                // Question:
                if (question != null) {
                    choice.setQuestion(question);
                }
                choiceList.add(choice);
            }
        }

        return choiceList;
    }

    public Set<Language> parseLanguageNodeList(NodeList languageNodeList) {
        // It's assumed that codeNodeList.getLength() > 0 check is done before calling this method
        Set<Language> languageList = new HashSet<>();
        for (int i = 0; i < languageNodeList.getLength(); i++) {
            Node languageNode = languageNodeList.item(i);
            if (languageNode.getNodeType() == Node.ELEMENT_NODE) {
                Element languageElement = (Element) languageNode;
                Language language = null;
                if (languageElement.getElementsByTagName("id").getLength() > 0) {
                    // if there are multiple "id" tags inside language, first one will be parsed
                    Long languageId = Long.valueOf(languageElement.getElementsByTagName("id").item(0).getTextContent());
                    language = languageRepository.findById(languageId).orElse(null);
                }
                if (language == null) {
                    if (languageElement.getElementsByTagName("name").getLength() > 0) {
                        // if there are multiple "name" tags inside category, first one will be parsed
                        String languageName = languageElement.getElementsByTagName("name").item(0).getTextContent();
                        language = languageRepository.findByName(languageName);
                        if (language == null) {
                            language = new Language();
                            language.setName(languageName);
                        }
                    } else {
                        throw new ParsingException("Language should have id or name");
                    }
                }
                languageList.add(language);
            }
        }
        return languageList;
    }


    private Set<Code> parseCodeNodeList(NodeList codeNodeList, Question question) {
        // It's assumed that codeNodeList.getLength() > 0 check is done before calling this method
        Set<Code> codeList = new HashSet<>();
        for (int i = 0; i < codeNodeList.getLength(); i++) {
            Node codeNode = codeNodeList.item(i);
            if (codeNode.getNodeType() == Node.ELEMENT_NODE) {
                Element codeElement = (Element) codeNode;
                Code code = null;
                if (codeElement.getElementsByTagName("id").getLength() > 0) {
                    // if there are multiple "id" tags inside code, first one will be parsed
                    Long codeId = Long.valueOf(codeElement.getElementsByTagName("id").item(0).getTextContent());
                    code = codeRepository.findById(codeId).orElse(null);
                    // if code already exists, then Question associated with it must be same. If not, create new Code
                    if (code != null) {
                        if (question != null) {
                            if (code.getQuestion() != question) {
                                code = new Code();
                            }
                            /// TODO: else, notify frontend that code with id in XML might be edited
                        } else {
                            throw new ParsingException("Code must be associated with question");
                        }
                    }
                }
                if (code == null) {
                    code = new Code();
                }
                // body:
                if (codeElement.getElementsByTagName("body").getLength() > 0) {
                    // if there are multiple "body" tags inside choice, first one will be parsed
                    code.setBody(codeElement.getElementsByTagName("body").item(0).getTextContent());
                }
                // language:
                if (codeElement.getElementsByTagName("language").getLength() > 0) {
                    // if there are multiple "language" tags inside code, first one will be parsed
                    Set<Language> languageSet = parseLanguageNodeList(codeElement.getElementsByTagName("language"));
                    if (languageSet.isEmpty()) {
                        throw new ParsingException("Couldn't parse a language inside code");
                    }
                    Language language = languageSet.iterator().next();
                    if (language != null) {
                        language = languageRepository.save(language);
                        languageRepository.flush();
                    }
                    code.setLanguage(language);
                }
                if (code.getBody() == null || code.getLanguage() == null) {
                    throw new ParsingException("Code must have body and language");
                }
                // Question:
                if (question != null) {
                    code.setQuestion(question);
                }
                codeList.add(code);
            }
        }

        return codeList;
    }

    private Question parseQuestion(Question question, Element questionElement, boolean isEdit) {
        // title:
        if (questionElement.getElementsByTagName("title").getLength() > 0) {
            // if there are multiple "title" tags inside question, first one will be parsed
            question.setTitle(questionElement.getElementsByTagName("title").item(0).getTextContent());
        }
        // body:
        if (questionElement.getElementsByTagName("body").getLength() > 0) {
            // if there are multiple "body" tags inside question, first one will be parsed
            question.setBody(questionElement.getElementsByTagName("body").item(0).getTextContent());
        }
        // level:
        if (questionElement.getElementsByTagName("level").getLength() > 0) {
            // if there are multiple "level" tags inside question, first one will be parsed
            question.setLevel(Integer.valueOf(questionElement.getElementsByTagName("level").item(0).getTextContent()));
        }
        if (question.getTitle() == null || question.getLevel() == null || question.getBody() == null) {
            throw new ParsingException("New question must have title, body and level");
        }
        // categories:
        // TODO: what if no Category was chosen? (question.getCategories().size() == 0)
        Set<Category> categoryList = null;
        NodeList categoryNodeList = questionElement.getElementsByTagName("category");
        if (categoryNodeList.getLength() > 0) {
            categoryList = parseCategoryNodeList(categoryNodeList, question);
            question.setCategories(categoryList);
        }
        //type:
        if (questionElement.getElementsByTagName("type").getLength() > 0) {
            String typeFromFile = questionElement.getElementsByTagName("type").item(0).getTextContent();
            question.setQuestionType(QuestionTypeEnum.valueOfLabel(typeFromFile));
        } else {
            question.setQuestionType(QuestionTypeEnum.SELECT_MANY);
        }
        // choices:
        Set<Choice> choiceList = null;
        NodeList choiceNodeList = questionElement.getElementsByTagName("choice");
        if (choiceNodeList.getLength() > 0) {
            choiceList = parseChoiceNodeList(choiceNodeList, question);
            // check that there is at least one correct answer choice:
            int numOfCorrectChoices = 0;
            for (Choice ch : choiceList) {
                if (ch.getCorrect()) {
                    numOfCorrectChoices++;
                }
            }
            if (numOfCorrectChoices == 0) {
                throw new ParsingException("There must be at least one correct choice for Question with title '" + question.getTitle() + "'");
            } else if (numOfCorrectChoices > 1) {
                if (question.getQuestionType() == QuestionTypeEnum.SELECT_ONE) {
                    throw new ParsingException("Question with type SELECT_ONE can't have more than one correct answer choice for Question with title '" + question.getTitle() + "'");
                }
            }
            question.setChoices(choiceList);
        } else if (choiceNodeList.getLength() == 0) {
            if (question.getQuestionType() != QuestionTypeEnum.TEXT) {
                throw new ParsingException("Questions that are not type of TextInput should have at least one answer choice. Question with title '" + question.getTitle() + "'");
            }
        }
        // TODO: what if no Answer Choice was added? (question.getChoices().size() == 0)
        // codes:
        Set<Code> codeList = null;
        NodeList codeNodeList = questionElement.getElementsByTagName("code");
        if (codeNodeList.getLength() > 0) {
            codeList = parseCodeNodeList(codeNodeList, question);
            question.setCodes(codeList);
        }

        return question;
    }

    public Set<Question> parseQuestionNodeList(NodeList questionNodeList) {

        Set<Question> questionList = new HashSet<>();
        for (int i = 0; i < questionNodeList.getLength(); i++) {
            Node node = questionNodeList.item(i);
            System.out.println();    //Just a separator
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                //Print each employee's detail
                Element questionElement = (Element) node;
                // Check if id tag exists:
                // if yes, edit existing Question
                Question question = null;
                if (questionElement.getElementsByTagName("id").getLength() > 0) {
                    // if there are multiple "id" tags inside question, first one will be parsed
                    Long questionID = Long.valueOf(questionElement.getElementsByTagName("id").item(0).getTextContent());
                    question = questionRepository.findById(questionID).orElse(null);
                    if (question != null) {
                        try {
                            question = parseQuestion(question, questionElement, true);
                            // TODO: notify frontend that question with id in XML might be edited
                        } catch (NumberFormatException e) {
                            throw new ParsingException("Error parsing numeric input. Reason : " + e.getMessage());
                        }

                    }
                }
                // if not, create new one.
                if (question == null) {
                    question = new Question();
                    question = parseQuestion(question, questionElement, false);
                }
                questionList.add(question);
            }
        }
        return questionList;
    }

}
