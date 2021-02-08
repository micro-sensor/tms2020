package baylor.csi.questionManagement.service;

import baylor.csi.questionManagement.Exception.JPAException;
import baylor.csi.questionManagement.model.*;
import baylor.csi.questionManagement.model.dto.QuestionSingleCodeDto;
import baylor.csi.questionManagement.repository.ChoiceRepository;
import baylor.csi.questionManagement.repository.CodeRepository;
import baylor.csi.questionManagement.repository.LanguageRepository;
import baylor.csi.questionManagement.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private CodeRepository codeRepository;

    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private LanguageRepository languageRepository;

    private static Integer[] getRandomNumList(int nums, int start, int end) {
        List<Integer> list = new ArrayList<>();

        Random r = new Random();

        while (list.size() != nums) {
            int num = r.nextInt(end - start) + start;
            if (!list.contains(num)) {
                list.add(num);
            }
        }

        return list.stream().toArray(Integer[]::new);
    }

    public List<QuestionSingleCodeDto> getQuestionSingleCodeDtosByConfigGroup(ConfigurationGroup group) {
        Integer[] indexs = new Integer[group.getCount()];
        List<QuestionSingleCodeDto> questionSingleCodeDtos = new ArrayList<>();
        List<Question> tempQuestions;
        Language language;
        if (group.getLanguageId() != null) {
            tempQuestions = questionRepository.findByCategoryIdAndLevelAndLanguage(group.getCategory(), group.getLevel(), group.getLanguageId());
            language = languageRepository.findById(group.getLanguageId()).orElse(null);
        } else {
            tempQuestions = questionRepository.findByCategoryIdAndLevel(group.getCategory(), group.getLevel());
            language = null;
        }
        if (tempQuestions.size() < group.getCount()) {
            throw new JPAException("Questions for " + group.getCategory() + " " + group.getLevel() + " " + group.getLanguageId() + " are not enough, please check the configuration ");
        } else if (tempQuestions.size() == group.getCount()) {
            for (int i = 0; i < group.getCount(); i++) {
                indexs[i] = i;
            }
        } else {
            indexs = getRandomNumList(group.getCount(), 0, tempQuestions.size());
        }


        for (int i = 0; i < indexs.length; i++) {
            Question tmpQuestion = tempQuestions.get(indexs[i]);
            Code code = null;
            if (language != null) {
                code = codeRepository.findByQuestionAndAndLanguage(tmpQuestion, language);
            }
            List<Choice> choices = choiceRepository.findByQuestion(tmpQuestion);
            questionSingleCodeDtos.add(new QuestionSingleCodeDto(tmpQuestion.getTitle(), tmpQuestion.getLevel(), tmpQuestion.getBody(), code, choices, tmpQuestion.getQuestionType().toString()));
        }
        return questionSingleCodeDtos;


    }


}
