package edu.baylor.ems.service;

import edu.baylor.ems.dto.ChoiceEmsDto;
import edu.baylor.ems.dto.SelectedChoiceEmsDto;
import edu.baylor.ems.model.Choice;
import edu.baylor.ems.model.Exam;
import edu.baylor.ems.model.Question;
import edu.baylor.ems.repository.ChoiceRepository;
import edu.baylor.ems.repository.ExamRepository;
import edu.baylor.ems.repository.QuestionRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChoiceService {
    private static final Logger logger = LogManager.getLogger(ChoiceService.class.getName());
    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    public List<Choice> selectChoices(SelectedChoiceEmsDto selectedChoiceEmsDto) {
        logger.info("Service called for select choices wtih with choice data");
        // Find choices by question id
        List<Choice> choices = this.choiceRepository.findByQuestionId(selectedChoiceEmsDto.getQuestionId());
        logger.info("Service perform database query for finding choices with question id of choice");
        //Select choices and unselect choices
        for (Choice ch : choices) {
            for (ChoiceEmsDto chEms : selectedChoiceEmsDto.getChoiceEmsDtos()
            ) {
                if (ch.getId().equals(chEms.getId())) {
                    ch.setChosen(chEms.isChosen());
                    logger.info("Sevice set chosen flag on found choices");
                }
            }
        }

        choices = this.choiceRepository.saveAll(choices);
        logger.info("Service perform database persist operation with chosen choices");

        List<Question> questions = questionRepository.getAllByExam_Id(selectedChoiceEmsDto.getExamId());
        logger.info("Service perform database query for finding choices with exam id of choice");

        Integer correct = 0;
        logger.info("checking every choices for correct questions");
        logger.info("Setting text answer to the chosen questions");
        for (Question q : questions) {

            boolean isQuestionCorrect = true;
            for (Choice ch : q.getChoices()
            ) {
                if ((ch.isCorrect() && !ch.isChosen()) || (!ch.isCorrect() && ch.isChosen())) {
                    isQuestionCorrect = false;
                }
            }
            if (isQuestionCorrect) {
                correct = correct + 1;
            }
            if (q.getId().equals(selectedChoiceEmsDto.getQuestionId())) {
                if (selectedChoiceEmsDto.getTextAnswer() != null) {
                    q.setTextAnswer(selectedChoiceEmsDto.getTextAnswer());
                }
                q.setFlagged(selectedChoiceEmsDto.isFlagged());
            }
        }

        questionRepository.saveAll(questions);
        logger.info("Perform database persist operation with updated questions");

        Exam exam = examRepository.getOne(selectedChoiceEmsDto.getExamId());
        exam.setCorrect(correct);
        examRepository.saveAndFlush(exam);
        logger.info("Exam marked as a valid exam");

        logger.info("Returning the result");

        //save
        return choices;
    }
}
