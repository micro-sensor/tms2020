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

        this.restTemplate = restTemplateBuilder.build();
    }

    public ResponseEntity<Object[]> getCategoryInfoDtos() {
        logger.info("Service called for get category information");
        String categoryInfoPath = qmsIp + categoryInfoContext;
        logger.info("Rest API called to obtain iformaiton");
        logger.info("Returning the result");
        ResponseEntity<Object[]> response = restTemplate.getForEntity(qmsIp + categoryInfoContext, Object[].class);
        return ResponseEntity.ok(response.getBody());
    }

    public ResponseEntity<Object> createConfiguration(Object object) {
        logger.info("Service called for creating new configuration");
        Object obj = restTemplate.postForObject(qmsIp + configurationContext, object, Object.class);
        logger.info("Rest API called to create new configuration");
        logger.info("Returning success notificaiton");
        return ResponseEntity.ok(obj);
    }

    public ResponseEntity<Object> updateConfiguration(Long configurationId, Object object) {
        logger.info("Service called for updating existing configuration");
        logger.info("Rest API called for updating existing configuration");
        restTemplate.put(qmsIp + configurationContext + "/" + configurationId.toString(), object);
        logger.info("Returning success notification");
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object[]> getConfigurations() {
        logger.info("Service called for getting all existing configurations");
        logger.info("Rest API called for finding all existing configurations");
        logger.info("Returning the result");
        ResponseEntity<Object[]> response = restTemplate.getForEntity(qmsIp + configurationContext, Object[].class);
        return ResponseEntity.ok(Objects.requireNonNull(response.getBody()));
    }

    public ResponseEntity<Object> getConfiguration(Long configurationId) {
        logger.info("Service called for getting specific configuration");
        logger.info("Rest API called for finding specific configuration");
        logger.info("Returning the result");
        ResponseEntity<Object> response = restTemplate.getForEntity(qmsIp + configurationContext + "/" + configurationId.toString(), Object.class);
        return ResponseEntity.ok(response.getBody());
    }

    public ResponseEntity<?> deleteConfiguration(Long configurationId) {
        logger.info("Service called for deleting existing configuration");
        String url = qmsIp + configurationContext + "/{configurationId}";
        logger.info("URL generated");
        Map<String, String> params = new HashMap<>();
        params.put("configurationId", configurationId.toString());
        logger.info("Rest API called for delete existing configuration");
        restTemplate.delete(url, params);
        logger.info("Returning success notification");
        return ResponseEntity.ok().build();
    }
}
