package edu.baylor.ems.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.baylor.ems.dto.ChoiceQmsDto;
import edu.baylor.ems.dto.QuestionQmsDto;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity(name="answers")
public class Question implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "serial")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exam_id", nullable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @JsonIgnore
    private Exam exam;

    @OneToMany(mappedBy = "question", fetch = FetchType.EAGER)
    private List<Choice> choices;

    @Column(name = "body")
    @Size(max = 1024)
    private String body;

    @Column(name = "code")
    private String code;

    @Column(name = "flagged")
    private boolean flagged;

    public Question(){}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public boolean isFlagged() {
        return flagged;
    }

    public void setFlagged(boolean flagged) {
        this.flagged = flagged;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
