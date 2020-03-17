package edu.baylor.ecs.cms.controller;

import edu.baylor.ecs.cms.service.QmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("categoryInfo")
public class CategoryInfoController {

    @Autowired
    private QmsService qmsService;

    @CrossOrigin
    @RequestMapping("")
    public ResponseEntity<Object[]> getCategoryInfo() {
        return qmsService.getCategoryInfoDtos();
    }
}
