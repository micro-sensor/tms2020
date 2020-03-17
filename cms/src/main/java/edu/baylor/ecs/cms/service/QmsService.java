package edu.baylor.ecs.cms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class QmsService {

    @Value("${qms.ip}")
    private String qmsIp;

    @Value("${qms.categoryinfo}")
    private String categoryInfoContext;

    @Value("${qms.configuration}")
    private String configurationContext;

    private final RestTemplate restTemplate;

    public QmsService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public ResponseEntity<Object[]> getCategoryInfoDtos(){
        String categoryInfoPath = qmsIp + categoryInfoContext;
        return restTemplate.getForEntity(categoryInfoPath, Object[].class);
    }

    public ResponseEntity<Object> createConfiguration(Object object) {
        Object obj = restTemplate.postForObject(qmsIp + configurationContext, object, Object.class);
        return ResponseEntity.ok(obj);
    }

    public ResponseEntity<Object[]> getConfigurations() {
        return restTemplate.getForEntity(qmsIp + configurationContext, Object[].class);
    }
}
