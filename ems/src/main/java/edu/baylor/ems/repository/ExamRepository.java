package edu.baylor.ems.repository;

import edu.baylor.ems.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface ExamRepository extends JpaRepository<Exam, Integer> {

    Boolean existsByExamineeAndId(Integer examinee, Integer id);

    @Query(name = Exam.FIND_BY_EXAMINEE)
    List<Exam> findByExaminee(String examineeEmail);

    @Query(name = Exam.FIND_BY_EXAM_DATE_FROM)
    List<Exam> findByExamDateFrom(int year, int month, int day);

    @Query(name = Exam.FIND_BY_EXAM_DATE_TO)
    List<Exam> findByExamDateTo(int year, int month, int day);

    @Query(name = Exam.FIND_BY_STATUS)
    List<Exam> findByStatus(Integer statusOrdinal);
}