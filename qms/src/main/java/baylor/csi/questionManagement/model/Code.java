package baylor.csi.questionManagement.model;

import baylor.csi.questionManagement.model.supermodel.UUIDHashedEntityObject;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(name = "code")
@SequenceGenerator(initialValue = 1, allocationSize = 1, name = "idgen", sequenceName = "code_id_seq")
public class Code extends UUIDHashedEntityObject {
    private Language language;
    private String body;
    private Question question;

    @ManyToOne(fetch = FetchType.EAGER)
    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    @NotNull
    @Column(nullable = false, columnDefinition = "TEXT")
    @Size(min = 3)
    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
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
