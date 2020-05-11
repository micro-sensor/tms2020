package edu.baylor.ems.controller;

import edu.baylor.ems.dto.ExamDto;
import edu.baylor.ems.dto.ExamReviewDto;
import edu.baylor.ems.dto.QuestionEmsDto;
import edu.baylor.ems.model.Exam;
import edu.baylor.ems.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("exam")
public class ExamController {

    @Autowired
    private ExamService examService;

//    @PreAuthorize("hasAnyAuthority('ROLE_ems-frontend')")
    @CrossOrigin(origins = "*")
    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity<List<Exam>> listAllExams() {
        List<Exam> exams = examService.findAllExams();
        if(exams.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(exams, HttpStatus.OK);
    }

    //From CMS
    @CrossOrigin(origins = "*")
    @RequestMapping(value = "", method = RequestMethod.POST, produces = "application/json; charset=UTF-8")
    public ResponseEntity<Exam> createExam(@RequestBody ExamDto examDto) {
        Exam exam = examService.saveExam(examDto);
        return new ResponseEntity<>(exam, HttpStatus.CREATED);
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json; charset=UTF-8")
    public ResponseEntity<Integer> deleteExam(@PathVariable("id") Integer id) {
        examService.deleteExam(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/take/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<QuestionEmsDto>> takeExam(@PathVariable("id") Integer id) {
        // check ID
        return examService.takeExam(id);
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/submit/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Exam> submitExam(@PathVariable("id") Integer id) {
        // check ID
        return examService.submitExam(id);
    }

    // change status to done + calculate wrong / correct / sum of answers

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/finish/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> finishExam(@PathVariable("id") Integer id) {
        // check ID
        return examService.finishExam(id);
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/get/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Exam> getExam(@PathVariable("id") Integer id) {
        // check ID
        return new ResponseEntity<>(examService.findById(id).get(), HttpStatus.CREATED);
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/review/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ExamReviewDto> reviewExam(@PathVariable("id") Integer id) {
        ExamReviewDto review = examService.reviewExam(id);
        return new ResponseEntity<ExamReviewDto>(review, HttpStatus.OK);
    }

}
