package edu.baylor.ecs.cms.dto;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class EmailDto {

    private static final Logger logger = LogManager.getLogger(EmailDto.class.getName());
    private String email;

    public EmailDto() {
    }

    public String getEmail() {
        logger.info(Thread.currentThread().getId() + ":" + "getEmail" + "()");
        return email;
    }

    public void setEmail(String email) {
        logger.info(Thread.currentThread().getId() + ":" + "setEmail" + "(" + email + ")");
        this.email = email;
    }
}
