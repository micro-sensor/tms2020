package baylor.csi.questionManagement.controller;

import baylor.csi.questionManagement.model.ConfigurationGroup;
import baylor.csi.questionManagement.model.dto.QuestionSingleCodeDto;
import baylor.csi.questionManagement.repository.ConfigurationRepository;
import baylor.csi.questionManagement.service.QuestionService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {
    private static final Logger logger = LogManager.getLogger(TestController.class.getName());
    @Autowired
    private ConfigurationRepository configurationRepository;

    @Autowired
    private QuestionService questionService;

    @CrossOrigin
    @GetMapping("")
    public List<QuestionSingleCodeDto> createTest(@RequestParam("configId") Long configId) {
        logger.info(Thread.currentThread().getId() + ":" + "createTest" + "(" + configId + ")");
        List<QuestionSingleCodeDto> questions = new ArrayList<>();
        List<ConfigurationGroup> configurationGroups = configurationRepository.getAllGroupsById(configId);
        if (!configurationGroups.isEmpty()) {
            for (ConfigurationGroup group : configurationGroups) {
                questions.addAll(questionService.getQuestionSingleCodeDtosByConfigGroup(group));
            }
            return questions;
        }
        return null;
    }

}
