package edu.baylor.ecs.cms.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;


@Service
public class QmsService {
    private static final Logger logger = LogManager.getLogger(QmsService.class.getName());
    private final RestTemplate restTemplate;
    @Value("${qms.ip}")
    private String qmsIp;
    @Value("${qms.categoryinfo}")
    private String categoryInfoContext;
    @Value("${qms.configuration}")
    private String configurationContext;

    public QmsService(RestTemplateBuilder restTemplateBuilder) {
        logger.info(Thread.currentThread().getId() + ":" + "QmsService" + "(" + restTemplateBuilder + ")");

        this.restTemplate = restTemplateBuilder.build();
    }

    public ResponseEntity<Object[]> getCategoryInfoDtos() {
        logger.info(Thread.currentThread().getId() + ":" + "GetCategoryInfoDtos" + "()");
        String categoryInfoPath = qmsIp + categoryInfoContext;
        return restTemplate.getForEntity(categoryInfoPath, Object[].class);
    }

    public ResponseEntity<Object> createConfiguration(Object object) {
        logger.info(Thread.currentThread().getId() + ":" + "createConfiguration" + "(" + object + ")");
        Object obj = restTemplate.postForObject(qmsIp + configurationContext, object, Object.class);
        return ResponseEntity.ok(obj);
    }

    public ResponseEntity<Object> updateConfiguration(Long configurationId, Object object) {
        logger.info(Thread.currentThread().getId() + ":" + "updateConfiguration" + "(" + configurationId + "," + object +
                ")");
        restTemplate.put(qmsIp + configurationContext + "/" + configurationId.toString(), object);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object[]> getConfigurations() {
        logger.info(Thread.currentThread().getId() + ":" + "getConfigurations" + "()");
        return restTemplate.getForEntity(qmsIp + configurationContext, Object[].class);
    }

    public ResponseEntity<Object> getConfiguration(Long configurationId) {
        logger.info(Thread.currentThread().getId() + ":" + "getConfiguration" + "()");
        return restTemplate.getForEntity(qmsIp + configurationContext + "/" + configurationId.toString(), Object.class);
    }

    public ResponseEntity<?> deleteConfiguration(Long configurationId) {
        logger.info(Thread.currentThread().getId() + ":" + "deleteConfiguration" + "(" + configurationId + ")");
        String url = qmsIp + configurationContext + "/{configurationId}";
        Map<String, String> params = new HashMap<>();
        params.put("configurationId", configurationId.toString());
        restTemplate.delete(url, params);
        return ResponseEntity.ok().build();
    }
}
