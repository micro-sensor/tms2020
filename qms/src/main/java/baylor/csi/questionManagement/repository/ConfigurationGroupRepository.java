package baylor.csi.questionManagement.repository;

import baylor.csi.questionManagement.model.ConfigurationGroup;
import baylor.csi.questionManagement.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConfigurationGroupRepository extends JpaRepository<ConfigurationGroup, Long> {

}
