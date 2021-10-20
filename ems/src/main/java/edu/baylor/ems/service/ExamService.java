package edu.baylor.ems.service;

import edu.baylor.ems.dto.ExamDto;
import edu.baylor.ems.dto.ExamReviewDto;
import edu.baylor.ems.dto.QuestionEmsDto;
import edu.baylor.ems.dto.QuestionQmsDto;
import edu.baylor.ems.model.Choice;
import edu.baylor.ems.model.Exam;
import edu.baylor.ems.model.ExamStatus;
import edu.baylor.ems.model.Question;
import edu.baylor.ems.repository.ExamRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamService {
    private static final Logger logger = LogManager.getLogger(ExamService.class.getName());
    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QmsService qmsService;

    @Autowired
    private QuestionService questionService;

    public Optional<Exam> findById(Integer id) {

        logger.info("Performing database query to find exam by id");
        ogger.info("returning the result");
        return this.examRepository.findById(id);
    }

    public void deleteExam(Integer id) {
        logger.info("Perform database query to delete exam");
        ogger.info("returning the result");
        this.examRepository.deleteById(id);
    }

    public List<Exam> findAllExams() {
        logger.info("Service perform database query to find all exams");
        logger.info("returning the result");
        return this.examRepository.findAll();
    }

    public List<Exam> findAllExamsByStatus(String status) {
        logger.info("Service called for find all exam based on exam status");

        List<Exam> allExams = findAllExams();
        logger.info("filtered the exams based on their stutus");
        List<Exam> filteredExams = allExams.stream().filter(item -> item.getStatus() == ExamStatus.valueOf(status)).collect(Collectors.toList());
        logger.info("returning the result");
        return filteredExams;
    }

    public boolean isExamExist(Integer examId, Integer examineeId) {
        logger.info("Checking exam existance");
        logger.info("returning the result");
        return this.examRepository.existsByExamineeAndId(examineeId, examId);
    }

    public ResponseEntity<Exam> submitExam(Integer examId) {
        logger.info("Perform database query to find exam by id");
        Optional<Exam> optionalExam = this.findById(examId);
        if (!optionalExam.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Exam exam = optionalExam.get();
        logger.info("Update exam data");
        exam.setStatus(ExamStatus.DONE);
        exam.setSubmissionDate(new Date());
        exam = this.examRepository.saveAndFlush(exam);
        logger.info("Persist updated exam");
        logger.info("Returning the result");
        return new ResponseEntity<Exam>(HttpStatus.OK);
    }

    public Exam saveExam(ExamDto examDto) {
        logger.info("Creating new exam");
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
        if (examDto.getId() != null) {
            exam.setId(examDto.getId());
        }
        logger.info("Persisting exam to database");
        logger.info("retunring persisted exam");

        return this.examRepository.saveAndFlush(exam);
    }

    public ResponseEntity<List<QuestionEmsDto>> takeExam(Integer id) {
        logger.info("Perform database query to find exam by id");
        Optional<Exam> optionalExam = this.findById(id);
        if (!optionalExam.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Exam exam = optionalExam.get();
        //ToDo: Check if exam.getExaminee() == currentlyLoggedUser
        ExamStatus examStatus = exam.getStatus();
        logger.info("Checking exam validity");
        logger.info("Updating exam status");
        logger.info("Returning the result");
        if (examStatus.equals(ExamStatus.INIT)) {
            return handleExamInit(exam);
        } else if (examStatus.equals(ExamStatus.PROGRESS)) {
            return handleExamProgress(exam);

        } else {
            // DONE
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    private ResponseEntity<List<QuestionEmsDto>> handleExamProgress(Exam exam) {
        // IN PROGRESS
        Date currentDate = new Date();
        if (currentDate.before(exam.getExamDate()) || currentDate.equals(exam.getExamDate())) {
            // Return questions associated with this exam && prune them
            return ResponseEntity.ok(this.questionService.getAllByExamPruned(exam));
        } else {
            // IN PROGRESS BUT SUBMITTED AFTER DEADLINE
            if (!exam.getStatus().equals(ExamStatus.DONE)) {
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


        return new ResponseEntity<>(questions, HttpStatus.OK);
    }

    private Exam setExamDate(Exam exam) {
        logger.info("Service Setting the exam date");
        long ONE_MINUTE_IN_MILLIS = 60000;
        Calendar date = Calendar.getInstance();
        long t = date.getTimeInMillis();
        Date afterAdding = new Date(t + (30 * ONE_MINUTE_IN_MILLIS));
        exam.setExamDate(afterAdding);
        logger.info("Returning updated exam");
        return exam;
    }

    private Exam setExamToProgress(Exam exam) {
        exam.setStatus(ExamStatus.PROGRESS);
        return exam;
    }


    public ResponseEntity<Object> finishExam(Integer id) {
        logger.info("Perform database query to find exam by id");
        Optional<Exam> optionalExam = this.findById(id);
        if (optionalExam.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Exam exam = optionalExam.get();
        Date currentDate = new Date();
        logger.info("Updating the data of found exam");
        if (currentDate.before(exam.getExamDate()) || currentDate.equals(exam.getExamDate())) {
            logger.info("Setting exam status as done");
            exam.setStatus(ExamStatus.DONE);
            exam.setSubmissionDate(currentDate);
            List<Question> questions = this.questionService.getAllByExam(exam.getId());
            exam.setSum(questions.size());
            Integer correct = 0;
            logger.info("Checking the validity of exam questions");
            for (Question q : questions
            ) {
                boolean same = true;
                for (Choice ch : q.getChoices()
                ) {
                    if (!(ch.isCorrect() && ch.isChosen())) {
                        same = false;
                        break;
                    }
                }
                if (same) {
                    correct = correct + 1;
                }
            }
            logger.info("Updating the exam as correct");
            exam.setCorrect(correct);
            logger.info("Performing persist operation on updated exam");
            examRepository.saveAndFlush(exam);
            logger.info("Returning the result");
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            // BAD REQUEST
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    public ExamReviewDto reviewExam(Integer id) {
        logger.info("Perform database query to find exam by id");
        Optional<Exam> optionalExam = this.findById(id);
        if (!optionalExam.isPresent()) {
            throw new IllegalArgumentException("Exam id doesn't exist!");
        }
        Exam exam = optionalExam.get();
        List<Question> questions = this.questionService.getAllByExam(exam.getId());

        logger.info("Create new review");
        ExamReviewDto examReview = new ExamReviewDto();
        examReview.setConfigurationName(exam.getConfigurationName());
        examReview.setExaminee(exam.getExaminee());
        examReview.setCorrect(exam.getCorrect());
        examReview.setSum(exam.getSum());
        examReview.setExamDate(exam.getExamDate());
        examReview.setQuestions(questions);
        examReview.setExamDateFrom(exam.getExamDateFrom());
        examReview.setExamDateTo(exam.getExamDateTo());
        logger.info("Set all required data in created review");
        logger.info("returning the review");

        return examReview;
    }
}
