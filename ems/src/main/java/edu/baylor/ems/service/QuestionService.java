package edu.baylor.ems.service;

import edu.baylor.ems.dto.ChoiceEmsDto;
import edu.baylor.ems.dto.ChoiceQmsDto;
import edu.baylor.ems.dto.QuestionEmsDto;
import edu.baylor.ems.dto.QuestionQmsDto;
import edu.baylor.ems.enums.QuestionTypeEnum;
import edu.baylor.ems.model.Choice;
import edu.baylor.ems.model.Exam;
import edu.baylor.ems.model.Question;
import edu.baylor.ems.repository.ChoiceRepository;
import edu.baylor.ems.repository.QuestionRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class QuestionService {
    private static final Logger logger = LogManager.getLogger(QuestionService.class.getName());
    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ChoiceRepository choiceRepository;


    public List<Question> getAllByExam(Integer examId) {
        logger.info("Performing database query to find all exam");
        return this.questionRepository.getAllByExam_Id(examId);
    }

    public List<QuestionEmsDto> saveAllQuestionQmsDtos(List<QuestionQmsDto> questionQmsDtos, Exam exam) {
        logger.info("Service called for saving all questions");

        //QuestionQmsDto -> Question
        this.questionsFromQmsToModel(questionQmsDtos, exam);

        // Save Questions
        logger.info("Performing database query to find all questions with exam id");
        List<Question> questions = this.questionRepository.getAllByExam_Id(exam.getId());
        logger.info("Updating question choices");
        for (Question q : questions
        ) {
            q.setChoices(choiceRepository.findByQuestionId(q.getId()));
        }

        // Questions -> QuestionEmsDto
        List<QuestionEmsDto> questionEmsDtos = this.questionsFromModelToEms(questions);
        logger.info("Returning question set");
        return questionEmsDtos;
    }

    public List<QuestionEmsDto> getAllByExamPruned(Exam exam) {
        logger.info("Service called for exam pruning");
        List<Question> questions = this.questionRepository.getAllByExam_Id(exam.getId());
        logger.info("Returning the prunning result");
        return questionsFromModelToEms(questions);
    }


    public List<QuestionEmsDto> questionsFromModelToEms(List<Question> questions) {
        List<QuestionEmsDto> questionEmsDtos = new ArrayList<>();
        for (Question q : questions) {
            QuestionEmsDto questionEmsDto = new QuestionEmsDto();
            questionEmsDto.setId(q.getId());
            questionEmsDto.setBody(q.getBody());
            questionEmsDto.setCode(q.getCode());
            questionEmsDto.setFlagged(q.isFlagged());
            questionEmsDto.setQuestionType(q.getQuestionType().toString());
            List<ChoiceEmsDto> choiceEmsDtos = choicesFromModelToEms(q.getChoices());
            questionEmsDto.setChoices(choiceEmsDtos);
            questionEmsDtos.add(questionEmsDto);
        }
        return questionEmsDtos;
    }

    private List<ChoiceEmsDto> choicesFromModelToEms(List<Choice> choices) {
        //Erase correct
        List<ChoiceEmsDto> choiceEmsDtos = new ArrayList<>();
        for (Choice ch : choices) {
            ChoiceEmsDto choiceEmsDto = new ChoiceEmsDto(ch);
            choiceEmsDtos.add(choiceEmsDto);
        }
        return choiceEmsDtos;
    }

    public List<Question> questionsFromQmsToModel(List<QuestionQmsDto> questionQmsDtos, Exam exam) {
        List<Question> questions = new ArrayList<>();
        for (QuestionQmsDto q : questionQmsDtos
        ) {
            Question question = new Question();
            question.setBody(q.getBody());
            question.setCode(q.getCode() != null ? q.getCode().getBody() : "");
            question.setExam(exam);
            question.setQuestionType(QuestionTypeEnum.valueOf(q.getQuestionType()));
            question = this.questionRepository.save(question);
            Set<Choice> choices = choicesFromQmsToModel(q.getChoices(), question);
            //choiceRepository.saveAll(choices);
            for (Choice c : choices) {
                c.setId(null);
                choiceRepository.save(c);
            }
            //question.setChoices(choices);
            //questions.add(question);
        }
        return questions;
    }

    private Set<Choice> choicesFromQmsToModel(List<ChoiceQmsDto> choiceQmsDtos, Question question) {
        Set<Choice> choices = new HashSet<>();
        for (ChoiceQmsDto ch : choiceQmsDtos
        ) {
            Choice choice = new Choice();
            choice.setId(ch.getId());
            choice.setCorrect(ch.isCorrect());
            choice.setBody(ch.getBody());
            choice.setQuestion(question);
            choices.add(choice);
        }
        return choices;
    }


}
