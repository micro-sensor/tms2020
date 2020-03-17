package baylor.csi.questionManagement.controller;

import baylor.csi.questionManagement.Exception.InstanceCreatingException;
import baylor.csi.questionManagement.Exception.ResourceNotFoundException;
import baylor.csi.questionManagement.model.Category;
import baylor.csi.questionManagement.model.Configuration;
import baylor.csi.questionManagement.model.ConfigurationGroup;
import baylor.csi.questionManagement.model.Language;
import baylor.csi.questionManagement.repository.CategoryRepository;
import baylor.csi.questionManagement.repository.ConfigurationRepository;
import baylor.csi.questionManagement.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/configuration")
public class ConfigurationController {
    @Autowired
    private ConfigurationRepository configurationRepository;

    @Autowired
    private LanguageRepository languageRepository;

    @CrossOrigin
    @GetMapping("")
    public List<Configuration> findAllConfigurations() {
        return configurationRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("/{configurationId}")
    public Configuration findConfigurationsById(@PathVariable Long configurationId) {
        return configurationRepository.findById(configurationId).orElse(null);
    }



    @CrossOrigin
    @DeleteMapping("/{configurationId}")
    public ResponseEntity<?> deleteConfiguration(@PathVariable Long configurationId) {
        return configurationRepository.findById(configurationId)
                .map(configuration -> {
                    configurationRepository.delete(configuration);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Configuration not found with id " + configurationId));
    }

    @CrossOrigin
    @PostMapping("")
    public Configuration createConfiguration(@Valid @RequestBody Map<String, Object> payload) {
        try {
            Configuration configuration = new Configuration();
            configuration.setName((String) payload.get("name"));
            configuration.setDescription((String) payload.get("description"));

            ArrayList<Map<String, Object>> groups = (ArrayList<Map<String, Object>>) payload.get("groups");
            for (Map<String, Object> group : groups) {
                createNewGroupFromJSonForConfiguration(configuration, group);
            }

            return configurationRepository.save(configuration);

        } catch (Exception e) {
            e.printStackTrace();
            throw new InstanceCreatingException("Question created failed because of " + e.getMessage());
        }

    }

    private void createNewGroupFromJSonForConfiguration(Configuration configuration, Map<String, Object> group) {
        ConfigurationGroup c = new ConfigurationGroup();
        c.setCategory(Long.parseLong(group.get("category").toString()));
        c.setCount(Integer.parseInt(group.get("count").toString()));
        c.setLanguageId(languageRepository.findByName(group.get("language").toString()).getId());
        c.setLevel(Integer.parseInt(group.get("level").toString()));
        c.setConfiguration(configuration);
        configuration.getGroups().add(c);
    }


}
