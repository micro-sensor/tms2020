package baylor.csi.questionManagement.repository;

import baylor.csi.questionManagement.model.Code;
import baylor.csi.questionManagement.model.Language;
import baylor.csi.questionManagement.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodeRepository extends JpaRepository<Code, Long> {
    Code findByQuestionAndAndLanguage(Question question, Language language);
}
