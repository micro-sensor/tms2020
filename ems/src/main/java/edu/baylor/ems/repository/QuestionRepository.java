package edu.baylor.ems.repository;

import edu.baylor.ems.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    List<Question> getAllByExam_Id(Integer id);
}
