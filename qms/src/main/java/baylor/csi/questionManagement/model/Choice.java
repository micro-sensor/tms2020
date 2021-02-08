package baylor.csi.questionManagement.model;


import baylor.csi.questionManagement.model.supermodel.UUIDHashedEntityObject;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "choice")
@SequenceGenerator(initialValue = 1, allocationSize = 1, name = "idgen", sequenceName = "choice_id_seq")
public class Choice extends UUIDHashedEntityObject {
    private String body;
    private Boolean correct;
    private Question question;

    @NotNull
    @Column(nullable = false, columnDefinition = "TEXT")
    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    @NotNull
    @Column(nullable = false)
    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    @JsonIgnore
    @NotNull
    @ManyToOne
    @JoinColumn(updatable = false)
    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }
}
