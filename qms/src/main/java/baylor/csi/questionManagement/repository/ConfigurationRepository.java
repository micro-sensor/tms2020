package baylor.csi.questionManagement.repository;


import baylor.csi.questionManagement.model.Configuration;
import baylor.csi.questionManagement.model.ConfigurationGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ConfigurationRepository extends JpaRepository<Configuration, Long> {
    @Query(name = Configuration.FIND_ALL_GROUPS_BY_ID)
    List<ConfigurationGroup> getAllGroupsById(Long configId);
}
