package edu.baylor.ecs.cms.controller;

import edu.baylor.ecs.cms.service.QmsService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("configuration")
public class ConfigurationController {
    private static final Logger logger = LogManager.getLogger(ConfigurationController.class.getName());
    @Autowired
    private QmsService qmsService;

    @CrossOrigin
    @PostMapping("")
    public ResponseEntity<Object> createConfiguration(@RequestBody Object object) {
        logger.info("HTTP request comes for creating new configuration");
        return qmsService.createConfiguration(object);
    }

    @CrossOrigin
    @PutMapping("/{configurationId}")
    public ResponseEntity<?> updateConfiguration(@PathVariable Long configurationId, @RequestBody Object object) {
        logger.info("HTTP request comes for updating exisisting configuration ");
        return qmsService.updateConfiguration(configurationId, object);
    }

    @CrossOrigin
    @GetMapping("")
    public ResponseEntity<Object[]> getConfigurations() {
        logger.info("HTTP request comes for getting all configurations");
        return qmsService.getConfigurations();
    }

    @CrossOrigin
    @GetMapping("/{configurationId}")
    public ResponseEntity<Object> getConfiguration(@PathVariable Long configurationId) {
        logger.info("HTTP request comes for getting specific configuration using id");
        return qmsService.getConfiguration(configurationId);
    }

    @CrossOrigin
    @DeleteMapping("/{configurationId}")
    public ResponseEntity<?> deleteConfiguration(@PathVariable Long configurationId) {
        logger.info("HTTP request comes for deleting existing configuration");
        return qmsService.deleteConfiguration(configurationId);
    }

    //ToDo: update


}
