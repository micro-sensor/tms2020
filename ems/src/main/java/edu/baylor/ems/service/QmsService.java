package edu.baylor.ems.service;

import edu.baylor.ems.dto.QuestionQmsDto;
import edu.baylor.ems.model.Configuration;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class QmsService {
    private static final Logger logger = LogManager.getLogger(QmsService.class.getName());
    private final RestTemplate restTemplate;
    @Autowired
    private QuestionService questionService;

    public QmsService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public List<QuestionQmsDto> getQuestions(Integer configurationId) {
        logger.info("QmsService called for getting questions with configuration id");
        ResponseEntity<List<QuestionQmsDto>> qqd = restTemplate.exchange("http://qms.test/qms/test?configId=" + configurationId, HttpMethod.GET, null, new ParameterizedTypeReference<List<QuestionQmsDto>>() {
        });
//        List<QuestionQmsDto> qqd = new ArrayList<>();
//        Arrays.stream(objects.getBody()).forEach(o -> {
//            qqd.add((QuestionQmsDto) o);
//        });
        logger.info("Returning the result");
        return qqd.getBody();

//        List<QuestionQmsDto> questionDtos = new ArrayList<>();
//        questionDtos.add(new QuestionQmsDto());
//        return questionDtos;
    }


    public String getConfigName(Long configId) {
        logger.info("Service called for ger configration name");
        ResponseEntity<Configuration> qqd = restTemplate.exchange("http://qms.test/qms/configuration/" + configId, HttpMethod.GET, null, new ParameterizedTypeReference<Configuration>() {
        });
        logger.info("returning configuration name");
        return qqd.getBody().getName();
    }


}
