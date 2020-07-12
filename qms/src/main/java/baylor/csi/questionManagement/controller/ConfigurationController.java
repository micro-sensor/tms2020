package baylor.csi.questionManagement.controller;

import baylor.csi.questionManagement.Exception.JPAException;
import baylor.csi.questionManagement.Exception.ResourceNotFoundException;
import baylor.csi.questionManagement.model.Configuration;
import baylor.csi.questionManagement.model.ConfigurationGroup;
import baylor.csi.questionManagement.model.Language;
import baylor.csi.questionManagement.repository.ConfigurationGroupRepository;
import baylor.csi.questionManagement.repository.ConfigurationRepository;
import baylor.csi.questionManagement.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("/configuration")
public class ConfigurationController {

    @Autowired
    private ConfigurationRepository configurationRepository;

    @Autowired
    private ConfigurationGroupRepository configurationGroupRepository;

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

            List<Long> oldGroupIds = new ArrayList<>();
            ArrayList<Map<String, Object>> groups = (ArrayList<Map<String, Object>>) payload.get("groups");
            for (Map<String, Object> group : groups) {
                createNewGroupFromJSonForConfiguration(configuration, group, oldGroupIds);
            }
            return configurationRepository.save(configuration);

        } catch (Exception e) {
            e.printStackTrace();
            throw new JPAException("Question created failed because of " + e.getMessage());
        }

    }

    @CrossOrigin
    @PutMapping("/{configurationId}")
    public Configuration updateConfiguration(@PathVariable Long configurationId, @Valid @RequestBody Map<String, Object> payload) {
        try {
            Configuration configuration = configurationRepository.findById(configurationId).orElse(null);
            Set<ConfigurationGroup> configurationGroups = configuration.getGroups();
            configuration.setName((String) payload.get("name"));
            configuration.setDescription((String) payload.get("description"));
            // clean groups: old groups will be added back, new groups will be added
            Set<ConfigurationGroup> newGroups = new HashSet<>();
            configuration.setGroups(newGroups);

            List<Long> oldGroupIds = new ArrayList<>();
            ArrayList<Map<String, Object>> groups = (ArrayList<Map<String, Object>>) payload.get("groups");
            for (Map<String, Object> group : groups) {
                createNewGroupFromJSonForConfiguration(configuration, group, oldGroupIds);
            }
            removeDeletedGroups(configurationGroups, oldGroupIds);

            return configurationRepository.save(configuration);

        } catch (Exception e) {
            e.printStackTrace();
            throw new JPAException("Question created failed because of " + e.getMessage());
        }

    }

    private void createNewGroupFromJSonForConfiguration(Configuration configuration, Map<String, Object> group, List<Long> oldGroupIds) {

        if( group!=null && group.get("isNew")!=null && Boolean.parseBoolean(group.get("isNew").toString())) {
            ConfigurationGroup c = new ConfigurationGroup();
            c.setCategory(Long.parseLong(group.get("category").toString()));
            c.setCount(Integer.parseInt(group.get("count").toString()));
            if (group.get("language") != null) {
                Language lang = languageRepository.findByName(group.get("language").toString());
                if (lang != null) {
                    c.setLanguageId(lang.getId());
                }
            } else {
                c.setLanguageId(null);
            }
            c.setLevel(Integer.parseInt(group.get("level").toString()));
            c.setConfiguration(configuration);
            configuration.getGroups().add(c);
        }
        else {
            if(group!=null && group.get("id")!=null) {
                Long groupId = Long.parseLong(group.get("id").toString());
                ConfigurationGroup c = configurationGroupRepository.findById(groupId).orElse(null);
                configuration.getGroups().add(c);
                oldGroupIds.add(groupId);
            }
        }
    }

    private void removeDeletedGroups(Set<ConfigurationGroup> configurationGroups,  List<Long> oldGroupIds) {
        System.out.println("oldGroupIds: " + oldGroupIds);
        for( ConfigurationGroup configurationGroup : configurationGroups) {
            System.out.println("\t"+configurationGroup);
            if( !oldGroupIds.contains(configurationGroup.getId()) ){
                System.out.println("deleting "+configurationGroup.getId());
                ConfigurationGroup c = configurationGroupRepository.findById(configurationGroup.getId()).orElse(null);
                configurationGroupRepository.delete(c);
            }
        }
    }

    // for debugging:
    private void printGroup(Map<String, Object> group) {
        System.out.println("Group passed from frontend:");
        if(group.get("isNew")!=null) {
            System.out.println("\tisNew: " + Boolean.parseBoolean(group.get("isNew").toString()));
        }
        if(group.get("category")!=null) {
            System.out.println("\tcategory: " + Long.parseLong(group.get("category").toString()));
        }
        if(group.get("count")!=null) {
            System.out.println("\tcount: " + Integer.parseInt(group.get("count").toString()));
        }
        if(group.get("level")!=null) {
            System.out.println("\tlevel: " + Integer.parseInt(group.get("level").toString()));
        }
        if(group.get("language")!=null) {
            System.out.println("\tlanguage: " + Integer.parseInt(group.get("language").toString()));
        }
    }

}
