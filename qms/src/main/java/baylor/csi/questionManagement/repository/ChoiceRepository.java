package baylor.csi.questionManagement.repository;

import baylor.csi.questionManagement.model.Choice;
import baylor.csi.questionManagement.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Long> {
    List<Choice> findByQuestion(Question question);
}
