package edu.baylor.ecs.cms.controller;

import edu.baylor.ecs.cms.dto.EmailDto;
import edu.baylor.ecs.cms.dto.ExamDto;
import edu.baylor.ecs.cms.service.EmsService;
import edu.baylor.ecs.cms.service.UmsService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exam")
public class ExamController {
    private static final Logger logger = LogManager.getLogger(ExamController.class.getName());
    @Autowired
    private EmsService emsService;

    @Autowired
    private UmsService umsService;

    @CrossOrigin
    @PostMapping("/create")
    public ResponseEntity<Object> createExam(@RequestBody ExamDto object) {

        logger.info("HTTP request comes for creating a new exam");

        return emsService.createExam(object);
    }

    @CrossOrigin
    @GetMapping("/{email}")
    public ResponseEntity<EmailDto> isEmailValid(@PathVariable String email, @RequestHeader("Authorization") String authorication) {
        logger.info("HTTP request for cheking the validity of email");

        return umsService.isEmailValid(email, authorication);
    }


}
