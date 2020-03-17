package baylor.csi.questionManagement.security;

import baylor.csi.questionManagement.model.Person;
import baylor.csi.questionManagement.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityAuditorAware implements AuditorAware<Long> {

    @Autowired
    private PersonRepository personRepository;

    @Override
    public Optional<Long> getCurrentAuditor() {

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication == null || !authentication.isAuthenticated()) {
//            return Optional.empty();
//        }
//
//        return Optional.of(((MyCustomUser) authentication.getPrincipal()).getId());
        Person user = personRepository.findById((long) 0).orElse(null);
        if(user == null) {
            return Optional.empty();
        } else {
            return Optional.of(user.getId());
        }
    }
}
