package edu.baylor.ems.controller;

import edu.baylor.ems.dto.SelectedChoiceEmsDto;
import edu.baylor.ems.model.Choice;
import edu.baylor.ems.service.ChoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("choice")
public class ChoiceController {

    @Autowired
    private ChoiceService choiceService;

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "", method = RequestMethod.POST, produces = "application/json; charset=UTF-8")
    public ResponseEntity<List<Choice>> updateChoices(@RequestBody SelectedChoiceEmsDto selectedChoiceEmsDto) {
        return ResponseEntity.ok(choiceService.selectChoices(selectedChoiceEmsDto));
    }

}
