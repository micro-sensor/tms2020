package edu.baylor.ecs.cms.controller;

import edu.baylor.ecs.cms.dto.EmailDto;
import edu.baylor.ecs.cms.dto.ExamDto;
import edu.baylor.ecs.cms.service.EmsService;
import edu.baylor.ecs.cms.service.UmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exam")
public class ExamController {
    @Autowired
    private EmsService emsService;

    @Autowired
    private UmsService umsService;

    @CrossOrigin
    @PostMapping("/create")
    public ResponseEntity<Object> createExam(@RequestBody ExamDto object) {
        return emsService.createExam(object);
    }

    @CrossOrigin
    @GetMapping("/{email}")
    public ResponseEntity<EmailDto> isEmailValid(@PathVariable String email, @RequestHeader("Authorization") String authorication) {
        return umsService.isEmailValid(email, authorication);
    }


}
