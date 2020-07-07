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
    public ResponseEntity<Object> createConfiguration(@RequestBody Object object) {
        return qmsService.createConfiguration(object);
    }

    @CrossOrigin
    @PutMapping("/{configurationId}")
    public ResponseEntity<?> updateConfiguration(@PathVariable Long configurationId, @RequestBody Object object) {
        return qmsService.updateConfiguration(configurationId, object);
    }

    @CrossOrigin
    @GetMapping("")
    public ResponseEntity<Object[]> getConfigurations() {
        return qmsService.getConfigurations();
    }

    @CrossOrigin
    @GetMapping("/{configurationId}")
    public ResponseEntity<Object> getConfiguration(@PathVariable Long configurationId) {
        return qmsService.getConfiguration(configurationId);
    }

    @CrossOrigin
    @DeleteMapping("/{configurationId}")
    public ResponseEntity<?> deleteConfiguration(@PathVariable Long configurationId) {
        return qmsService.deleteConfiguration(configurationId);
    }

    //ToDo: update


}
