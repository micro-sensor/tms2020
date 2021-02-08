package baylor.csi.questionManagement.repository;

import baylor.csi.questionManagement.model.ConfigurationGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigurationGroupRepository extends JpaRepository<ConfigurationGroup, Long> {

}
