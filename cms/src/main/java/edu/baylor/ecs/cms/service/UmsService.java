package edu.baylor.ecs.cms.service;

import edu.baylor.ecs.cms.dto.EmailDto;
import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;

@Service
public class UmsService {
    private static final Logger logger = LogManager.getLogger(UmsService.class.getName());
    private final RestTemplate restTemplate;
    @Value("${ums.ip}")
    private String umsIp;
    @Value("${ums.id}")
    private String id;
    @Value("${ums.email}")
    private String email;

    public UmsService(RestTemplateBuilder restTemplateBuilder) {

        logger.info(Thread.currentThread().getId() + ":" + "UmsService" + "(" + restTemplateBuilder + ")");
        this.restTemplate = restTemplateBuilder.build();
    }

//    public ResponseEntity<Object> isEmailValid(String email){
//        StringBuilder stringBuilder = new StringBuilder();
//        stringBuilder.append(umsIp);
//        stringBuilder.append(email);
//        stringBuilder.append("?email=");
//        stringBuilder.append(email.replace("@", "%40"));
//        Object object = restTemplate.getForEntity(umsIp + email, Integer.class);
//
//        return new ResponseEntity.ok(object);
//    }

    public ResponseEntity<EmailDto> isEmailValid(String email, String auth) {
        logger.info("Service called to check the validity of email");

        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(umsIp);
        stringBuilder.append(email);
        stringBuilder.append("?email=");
        stringBuilder.append(email.replace("@", "%40"));
        logger.info("Preparing the request to check email validity");
//        Object object = restTemplate.getForEntity(umsIp + this.email + email, Integer.class);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", auth);
        HttpEntity<String> request = new HttpEntity<String>(headers);
        logger.info("Rest API called to find the email validity");
        ResponseEntity<String> re = restTemplate.exchange(umsIp + this.email + email, HttpMethod.GET, request, String.class);
        System.out.println(re.getBody());
        EmailDto emailDto = new EmailDto();
        emailDto.setEmail(re.getBody());
        logger.info("Returning success notification");
        return ResponseEntity.ok(emailDto);
//
//        restTemplate.exchange
//                (uri, HttpMethod.POST, new HttpEntity<T>(createHeaders(username, password)), Integer.class);
//        return ResponseEntity.ok(object);
    }

    public HttpHeaders createHeaders(String username, String password) {
        return new HttpHeaders() {{
            String auth = username + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(
                    auth.getBytes(StandardCharsets.US_ASCII));
            String authHeader = "Basic " + new String(encodedAuth);
            set("Authorization", authHeader);
        }};
    }


    public Boolean isExamineeIdValid(Integer id) {
//        StringBuilder stringBuilder = new StringBuilder();
//        stringBuilder.append(umsIp);
//        stringBuilder.append(id);
//        stringBuilder.append("?id=");
//        stringBuilder.append(id);
//        return restTemplate.getForEntity(umsIp + validContext, Integer.class);
        return Boolean.TRUE;
    }


    public Integer getCurrentLoggedInUser() {
        return 1;
    }

}
