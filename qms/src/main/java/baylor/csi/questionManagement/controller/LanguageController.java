package baylor.csi.questionManagement.controller;

import baylor.csi.questionManagement.Exception.JPAException;
import baylor.csi.questionManagement.Exception.ParsingException;
import baylor.csi.questionManagement.Exception.ResourceNotFoundException;
import baylor.csi.questionManagement.model.Language;
import baylor.csi.questionManagement.model.dto.LanguageListDto;
import baylor.csi.questionManagement.repository.LanguageRepository;
import baylor.csi.questionManagement.service.XmlParserService;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.validation.Valid;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/language")
public class LanguageController {
    private static final Logger logger = LogManager.getLogger(CategoryInfoController.class.getName());
    @Autowired
    private LanguageRepository languageRepository;
    @Autowired
    private XmlParserService xmlParserService;

    @CrossOrigin
    @GetMapping("")
    public List<Language> findAllLanguages() {

        logger.info("Request for find all languages");
        return languageRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("/{languageId}")
    public Language findLanguageById(@PathVariable Long languageId) {
        logger.info("Request for find language by Id");
        return languageRepository.findById(languageId).orElse(null);
    }

    @CrossOrigin
    @PostMapping("")
    public Language createLanguage(@Valid @RequestBody Language language) {
        logger.info("Request for create language" );
        return languageRepository.save(language);
    }

    @CrossOrigin
    @PutMapping("/{languageId}")
    public Language updateLanguage(@PathVariable Long languageId, @Valid @RequestBody Language languageRequest) {
        logger.info(T "Request for update language");
        return languageRepository.findById(languageId)
                .map(language -> {
                    language.setName(languageRequest.getName());
                    return languageRepository.save(language);
                }).orElseThrow(() -> new ResourceNotFoundException("Language not found with id " + languageId));
    }

    @CrossOrigin
    @DeleteMapping("/{languageId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long languageId) {
        logger.info("Request for delete question");
        return languageRepository.findById(languageId)
                .map(language -> {
                    languageRepository.delete(language);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Language not found with id " + languageId));
    }

    @CrossOrigin
    @DeleteMapping("")
    public ResponseEntity<?> deleteAllLanguages() {
        logger.info("Request for delete all languages");
        try {
            languageRepository.deleteAll();
        } catch (Exception e) {
            throw new JPAException("Deletion of some languages violate database constraints");
        }
        return ResponseEntity.ok().build();
    }

    @CrossOrigin
    @GetMapping("/export")
    public String exportAllLanguages() throws IOException {

        logger.info("Request for export all languages");
        List<Language> languageList = languageRepository.findAll();
        LanguageListDto languageListDto = new LanguageListDto(languageList);

        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);

        if (languageListDto != null)
            return xmlMapper.writeValueAsString(languageListDto);

        return "Failed to export";
    }

    @CrossOrigin
    @PostMapping(value = "/import")
    public ResponseEntity<?> uploadLanguages(@RequestParam("file") MultipartFile file) throws IOException, ParserConfigurationException, SAXException {
        logger.info("Request for upload languages");

        if (file.isEmpty()) {
            throw new ResourceNotFoundException("File upload failed when importing language(s)");
        }

        Set<Language> languageList = null;
        logger.info("Parsing uploaded language file");
        byte[] bytes = file.getBytes();
        InputStream myInputStream = new ByteArrayInputStream(bytes);
        // create a new DocumentBuilderFactory
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        // use the factory to create a document builder
        DocumentBuilder builder = factory.newDocumentBuilder();
        // create a new document from input stream
        Document doc = builder.parse(myInputStream);
        doc.getDocumentElement().normalize();
        // get NodeList with "language" tag
        NodeList languageNodeList = doc.getElementsByTagName("language");
        if (languageNodeList.getLength() == 0) {
            throw new ParsingException("XML document doesn't contain tags with name language");
        }
        languageList = xmlParserService.parseLanguageNodeList(languageNodeList);

        if (languageList != null) {
            try {
                languageRepository.saveAll(languageList);
            } catch (Exception e) {
                e.printStackTrace();
                throw new JPAException("Language import failed. Reason: " + e.getMessage());
            }
        }
        logger.info("Returning result");
        return ResponseEntity.ok().build();
    }


}
