package edu.baylor.ems.service;

import edu.baylor.ems.dto.*;
import edu.baylor.ems.model.Choice;
import edu.baylor.ems.model.Exam;
import edu.baylor.ems.model.ExamStatus;
import edu.baylor.ems.model.Question;
import edu.baylor.ems.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QmsService qmsService;

    @Autowired
    private QuestionService questionService;

    public Optional<Exam> findById(Integer id) {
        return this.examRepository.findById(id);
    }

    public void deleteExam(Integer id) {
        this.examRepository.deleteById(id);
    }

    public List<Exam> findAllExams() {
        return this.examRepository.findAll();
    }

    public List<Exam> findAllExamsByStatus(String status) {

        List<Exam> allExams = findAllExams();
        List<Exam> filteredExams = allExams.stream().filter(item -> item.getStatus()==ExamStatus.valueOf(status)).collect(Collectors.toList());

        return filteredExams;
    }

    public boolean isExamExist(Integer examId, Integer examineeId) {
        return this.examRepository.existsByExamineeAndId(examineeId, examId);
    }

    public ResponseEntity<Exam> submitExam(Integer examId) {
        Optional<Exam> optionalExam = this.findById(examId);
        if (!optionalExam.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Exam exam = optionalExam.get();
        exam.setStatus(ExamStatus.DONE);
        exam.setSubmissionDate(new Date());
        exam = this.examRepository.saveAndFlush(exam);
        return new ResponseEntity<Exam>(HttpStatus.OK);
    }

    public Exam saveExam(ExamDto examDto) {
        Exam exam = new Exam(examDto);
        exam.setExamDate(new Date());
        exam.setConfigurationName(qmsService.getConfigName(Integer.toUnsignedLong(examDto.getConfigurationId())));
        exam.setStatus(ExamStatus.INIT);
        exam.getExamDateFrom().setHours(0);
        exam.getExamDateFrom().setMinutes(0);
        exam.getExamDateFrom().setSeconds(0);
        exam.getExamDateTo().setHours(23);
        exam.getExamDateTo().setMinutes(59);
        exam.getExamDateTo().setSeconds(59);
        if (examDto.getId()!=null){
            exam.setId(examDto.getId());
        }

        return this.examRepository.saveAndFlush(exam);
    }

    public ResponseEntity<List<QuestionEmsDto>> takeExam(Integer id) {
        Optional<Exam> optionalExam = this.findById(id);
        if (!optionalExam.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Exam exam = optionalExam.get();
        //ToDo: Check if exam.getExaminee() == currentlyLoggedUser
        ExamStatus examStatus = exam.getStatus();
        if (examStatus.equals(ExamStatus.INIT)){
            return handleExamInit(exam);
        } else if (examStatus.equals(ExamStatus.PROGRESS)){
            return handleExamProgress(exam);

        } else {
            // DONE
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    private ResponseEntity<List<QuestionEmsDto>> handleExamProgress(Exam exam) {
        // IN PROGRESS
        Date currentDate = new Date();
        if (currentDate.before(exam.getExamDate()) || currentDate.equals(exam.getExamDate())){
            // Return questions associated with this exam && prune them
            return ResponseEntity.ok(this.questionService.getAllByExamPruned(exam));
        } else {
            // IN PROGRESS BUT SUBMITTED AFTER DEADLINE
            if (!exam.getStatus().equals(ExamStatus.DONE)){
                // update exam to DONE
                exam.setStatus(ExamStatus.DONE);
                exam.setSubmissionDate(exam.getExamDate());
                this.examRepository.saveAndFlush(exam);
                // BAD REQUEST
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }




    private ResponseEntity<List<QuestionEmsDto>> handleExamInit(Exam exam) {

        // QMS get questions / choices
        List<QuestionQmsDto> questionQmsDtos = this.qmsService.getQuestions(exam.getConfigurationId());

        exam = setExamToProgress(exam);
        exam = setExamDate(exam);
        exam.setSum(questionQmsDtos.size());
        exam = this.examRepository.saveAndFlush(exam);

        // Persist to DB + Retrieve from DB + clear data
        List<QuestionEmsDto> questions = this.questionService.saveAllQuestionQmsDtos(questionQmsDtos, exam);
        // Update Exam to PROGRESS & set examDATE to currentDate + 30 min


        return new ResponseEntity<>(questions,HttpStatus.OK);
    }

    private Exam setExamDate(Exam exam) {
        long ONE_MINUTE_IN_MILLIS=60000;
        Calendar date = Calendar.getInstance();
        long t = date.getTimeInMillis();
        Date afterAdding=new Date(t + (30 * ONE_MINUTE_IN_MILLIS));
        exam.setExamDate(afterAdding);
        return exam;
    }

    private Exam setExamToProgress(Exam exam) {
        exam.setStatus(ExamStatus.PROGRESS);
        return exam;
    }


    public ResponseEntity<Object> finishExam(Integer id) {
        Optional<Exam> optionalExam = this.findById(id);
        if (optionalExam.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Exam exam = optionalExam.get();
        Date currentDate = new Date();
        if (currentDate.before(exam.getExamDate()) || currentDate.equals(exam.getExamDate())){
            exam.setStatus(ExamStatus.DONE);
            exam.setSubmissionDate(currentDate);
            List<Question> questions = this.questionService.getAllByExam(exam.getId());
            exam.setSum(questions.size());
            Integer correct = 0;
            for (Question q: questions
                 ) {
                boolean same = true;
                for (Choice ch: q.getChoices()
                     ) {
                    if (!(ch.isCorrect() && ch.isChosen())){
                        same = false;
                        break;
                    }
                }
                if (same) {
                    correct = correct + 1;
                }
            }
            exam.setCorrect(correct);
            examRepository.saveAndFlush(exam);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            // BAD REQUEST
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    public ExamReviewDto reviewExam(Integer id) {
        Optional<Exam> optionalExam = this.findById(id);
        if (!optionalExam.isPresent()) {
            throw new IllegalArgumentException("Exam id doesn't exist!");
        }
        Exam exam = optionalExam.get();
        List<Question> questions = this.questionService.getAllByExam(exam.getId());

        ExamReviewDto examReview = new ExamReviewDto();
        examReview.setConfigurationName(exam.getConfigurationName());
        examReview.setExaminee(exam.getExaminee());
        examReview.setCorrect(exam.getCorrect());
        examReview.setSum(exam.getSum());
        examReview.setExamDate(exam.getExamDate());
        examReview.setQuestions(questions);
        examReview.setExamDateFrom(exam.getExamDateFrom());
        examReview.setExamDateTo(exam.getExamDateTo());

        return examReview;
    }
}
