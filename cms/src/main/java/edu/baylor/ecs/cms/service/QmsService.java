package edu.baylor.ecs.cms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


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

    public ResponseEntity<Object[]> getCategoryInfoDtos() {
        ResponseEntity<Object[]> response = restTemplate.getForEntity(qmsIp + categoryInfoContext, Object[].class);
        return ResponseEntity.ok(response.getBody());
    }

    public ResponseEntity<Object> createConfiguration(Object object) {
        Object obj = restTemplate.postForObject(qmsIp + configurationContext, object, Object.class);
        return ResponseEntity.ok(obj);
    }

    public ResponseEntity<Object> updateConfiguration(Long configurationId, Object object) {
        restTemplate.put(qmsIp + configurationContext + "/" + configurationId.toString(), object);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object[]> getConfigurations() {
        ResponseEntity<Object[]> response = restTemplate.getForEntity(qmsIp + configurationContext, Object[].class);
        return ResponseEntity.ok(Objects.requireNonNull(response.getBody()));
    }

    public ResponseEntity<Object> getConfiguration(Long configurationId) {
        ResponseEntity<Object> response = restTemplate.getForEntity(qmsIp + configurationContext + "/" + configurationId.toString(), Object.class);
        return ResponseEntity.ok(response.getBody());
    }

    public ResponseEntity<?> deleteConfiguration(Long configurationId) {
        String url = qmsIp + configurationContext + "/{configurationId}";
        Map<String, String> params = new HashMap<>();
        params.put("configurationId", configurationId.toString());
        restTemplate.delete(url, params);
        return ResponseEntity.ok().build();
    }
}
