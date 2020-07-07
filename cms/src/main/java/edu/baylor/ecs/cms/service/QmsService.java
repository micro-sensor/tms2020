package edu.baylor.ecs.cms.service;

import edu.baylor.ecs.cms.exception.JPAException;
import edu.baylor.ecs.cms.exception.ResourceNotFoundException;
import org.apache.http.client.methods.HttpDelete;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;


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

    public ResponseEntity<Object> updateConfiguration(Long configurationId, Object object) {
        restTemplate.put(qmsIp + configurationContext+ "/"+configurationId.toString(), object);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object[]> getConfigurations() {
        return restTemplate.getForEntity(qmsIp + configurationContext, Object[].class);
    }

    public ResponseEntity<Object> getConfiguration(Long configurationId) {
        return restTemplate.getForEntity(qmsIp + configurationContext + "/"+configurationId.toString(), Object.class);
    }

    public ResponseEntity<?> deleteConfiguration(Long configurationId) {
        String url = qmsIp + configurationContext + "/{configurationId}";
        Map<String, String> params = new HashMap<>();
        params.put("configurationId", configurationId.toString());
        restTemplate.delete(url, params);
        return ResponseEntity.ok().build();
    }
}
