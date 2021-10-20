package edu.baylor.ecs.cms.controller;

import edu.baylor.ecs.cms.service.QmsService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("categoryInfo")
public class CategoryInfoController {
    private static final Logger logger = LogManager.getLogger(CategoryInfoController.class.getName());
    @Autowired
    private QmsService qmsService;

    @CrossOrigin
    @RequestMapping("")
    public ResponseEntity<Object[]> getCategoryInfo() {
        logger.info("HTTP request comes for getting category information");
        return qmsService.getCategoryInfoDtos();
    }
}
