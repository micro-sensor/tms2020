package edu.baylor.ecs.cms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class JPAException extends RuntimeException {
    public JPAException(String message) {
        super(message);
    }

    public JPAException(String message, Throwable cause) {
        super(message, cause);
    }
}

