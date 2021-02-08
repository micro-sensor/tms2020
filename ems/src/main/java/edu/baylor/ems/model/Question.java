package edu.baylor.ems.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.baylor.ems.enums.QuestionTypeEnum;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity(name = "answers")
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

    @Column(name = "body", columnDefinition = "TEXT")
//    @Size(max = 1024)
    private String body;

    @Column(name = "code", columnDefinition = "TEXT")
    private String code;

    @Column(name = "flagged")
    private boolean flagged;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionType")
    private QuestionTypeEnum questionType;

    @Column(name = "textAnswer", columnDefinition = "TEXT")
    private String textAnswer;

    public Question() {
    }

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

    public QuestionTypeEnum getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionTypeEnum questionType) {
        this.questionType = questionType;
    }

    public String getTextAnswer() {
        return textAnswer;
    }

    public void setTextAnswer(String textAnswer) {
        this.textAnswer = textAnswer;
    }
}
