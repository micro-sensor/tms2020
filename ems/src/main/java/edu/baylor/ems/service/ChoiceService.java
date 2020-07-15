package edu.baylor.ems.service;

import edu.baylor.ems.dto.ChoiceEmsDto;
import edu.baylor.ems.dto.ExamSubmissionDto;
import edu.baylor.ems.dto.SelectedChoiceEmsDto;
import edu.baylor.ems.model.Choice;
import edu.baylor.ems.model.Exam;
import edu.baylor.ems.model.Question;
import edu.baylor.ems.repository.ChoiceRepository;
import edu.baylor.ems.repository.ExamRepository;
import edu.baylor.ems.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChoiceService {
    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private QuestionRepository questionRepository;


    @Autowired
    private ExamRepository examRepository;

    public List<Choice> selectChoices(SelectedChoiceEmsDto selectedChoiceEmsDto) {
        // Find choices by question id
        List<Choice> choices = this.choiceRepository.findByQuestionId(selectedChoiceEmsDto.getQuestionId());
        //Select choices and unselect choices
        for (Choice ch: choices) {
            for (ChoiceEmsDto chEms: selectedChoiceEmsDto.getChoiceEmsDtos()
                 ) {
                if (ch.getId().equals(chEms.getId())){
                    ch.setChosen(chEms.isChosen());
                }
            }
        }

        choices = this.choiceRepository.saveAll(choices);

        List<Question> questions = questionRepository.getAllByExam_Id(selectedChoiceEmsDto.getExamId());

        Integer correct = 0;

        for (Question q: questions) {

            boolean isQuestionCorrect = true;
            for (Choice ch: q.getChoices()
                 ) {
                if ( (ch.isCorrect() && !ch.isChosen()) || (!ch.isCorrect() && ch.isChosen()) ){
                    isQuestionCorrect = false;
                }
            }
            if (isQuestionCorrect){
                correct = correct + 1;
            }
            if (q.getId().equals(selectedChoiceEmsDto.getQuestionId())) {
                if (selectedChoiceEmsDto.getTextAnswer()!=null){
                    q.setTextAnswer(selectedChoiceEmsDto.getTextAnswer());
                }
                q.setFlagged(selectedChoiceEmsDto.isFlagged());
            }
        }

        questionRepository.saveAll(questions);

        Exam exam = examRepository.getOne(selectedChoiceEmsDto.getExamId());
        exam.setCorrect(correct);
        examRepository.saveAndFlush(exam);

        //save
        return choices;
    }
}
