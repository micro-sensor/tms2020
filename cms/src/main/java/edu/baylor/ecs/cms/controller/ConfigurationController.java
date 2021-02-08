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
        logger.info(Thread.currentThread().getId() + ":" + "createConfiguration" + "(" + object + ")");
        return qmsService.createConfiguration(object);
    }

    @CrossOrigin
    @PutMapping("/{configurationId}")
    public ResponseEntity<?> updateConfiguration(@PathVariable Long configurationId, @RequestBody Object object) {
        logger.info(Thread.currentThread().getId() + ":" + "updateConfiguration" + "(" + configurationId + "," + object +
                ")");
        return qmsService.updateConfiguration(configurationId, object);
    }

    @CrossOrigin
    @GetMapping("")
    public ResponseEntity<Object[]> getConfigurations() {
        logger.info(Thread.currentThread().getId() + ":" + "getConfigurations" + "()");
        return qmsService.getConfigurations();
    }

    @CrossOrigin
    @GetMapping("/{configurationId}")
    public ResponseEntity<Object> getConfiguration(@PathVariable Long configurationId) {
        logger.info(Thread.currentThread().getId() + ":" + "getConfiguration" + "(" + configurationId + ")");
        return qmsService.getConfiguration(configurationId);
    }

    @CrossOrigin
    @DeleteMapping("/{configurationId}")
    public ResponseEntity<?> deleteConfiguration(@PathVariable Long configurationId) {
        logger.info(Thread.currentThread().getId() + ":" + "deleteConfiguration" + "(" + configurationId + ")");
        return qmsService.deleteConfiguration(configurationId);
    }

    //ToDo: update


}
