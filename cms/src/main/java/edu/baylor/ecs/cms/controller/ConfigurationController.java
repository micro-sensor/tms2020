package edu.baylor.ecs.cms.controller;

import edu.baylor.ecs.cms.dto.ConfigurationDto;
import edu.baylor.ecs.cms.service.QmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("configuration")
public class ConfigurationController {

    @Autowired
    private QmsService qmsService;

    @CrossOrigin
    @PostMapping("")
    public ResponseEntity<Object> createConfiguration(@RequestBody ConfigurationDto object) {
        return qmsService.createConfiguration(object);
    }

    @CrossOrigin
    @GetMapping("")
    public ResponseEntity<Object[]> getConfigurations() {
        return qmsService.getConfigurations();
    }

    //ToDo: update, delete


}
