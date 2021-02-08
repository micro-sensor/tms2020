package edu.baylor.ems.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.baylor.ems.dto.ExamDto;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

@Entity(name = "exam")
@NamedQueries(value = {
        @NamedQuery(name = Exam.FIND_BY_EXAMINEE,
                query = "select e from exam e where e.examinee like :examineeEmail"),
        @NamedQuery(name = Exam.FIND_BY_EXAM_DATE_FROM,
                query = "select e from exam e where YEAR(e.examDateFrom) = ?1 and MONTH(e.examDateFrom) = ?2 and DAY(e.examDateFrom) = ?3"),
        @NamedQuery(name = Exam.FIND_BY_EXAM_DATE_TO,
                query = "select e from exam e where YEAR(e.examDateTo) = ?1 and MONTH(e.examDateTo) = ?2 and DAY(e.examDateTo) = ?3"),
        @NamedQuery(name = Exam.FIND_BY_STATUS,
                query = "select e from exam e where e.status=:statusOrdinal"),
})
public class Exam implements Serializable {

    public static final String FIND_BY_EXAMINEE = "FIND_BY_EXAMINEE";
    public static final String FIND_BY_EXAM_DATE_FROM = "FIND_BY_EXAM_DATE_FROM";
    public static final String FIND_BY_EXAM_DATE_TO = "FIND_BY_EXAM_DATE_TO";
    public static final String FIND_BY_STATUS = "FIND_BY_STATUS";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "serial")
    private Integer id;

    @Column(name = "examinee")
    private String examinee;

    @Column(name = "issuer")
    private Integer issuer;

    @Column(name = "configuration_id")
    private Integer configurationId;

    @Column(name = "configuration_name")
    private String configurationName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "US/Central")
    private Date examDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "US/Central")
    private Date submissionDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date examDateFrom;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date examDateTo;

    @Column(name = "status")
    private ExamStatus status;

    @Column(name = "correct")
    private Integer correct;

    @Column(name = "sum")
    private Integer sum;

    public Exam() {
    }

    public Exam(ExamDto examDto) {
        this.examinee = examDto.getExaminee();
        this.examDate = examDto.getExamDate();
        this.issuer = examDto.getIssuer();
        this.configurationId = examDto.getConfigurationId();
        this.examDateFrom = examDto.getExamDateFrom();
        this.examDateTo = examDto.getExamDateTo();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getExaminee() {
        return examinee;
    }

    public void setExaminee(String examinee) {
        this.examinee = examinee;
    }

    public Integer getIssuer() {
        return issuer;
    }

    public void setIssuer(Integer issuer) {
        this.issuer = issuer;
    }

    public Integer getConfigurationId() {
        return configurationId;
    }

    public void setConfigurationId(Integer configurationId) {
        this.configurationId = configurationId;
    }

    public Date getExamDate() {
        return examDate;
    }

    public void setExamDate(Date examDate) {
        this.examDate = examDate;
    }

    public Date getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(Date submissionDate) {
        this.submissionDate = submissionDate;
    }

    public Date getExamDateFrom() {
        return examDateFrom;
    }

    public void setExamDateFrom(Date examDateFrom) {
        this.examDateFrom = examDateFrom;
    }

    public Date getExamDateTo() {
        return examDateTo;
    }

    public void setExamDateTo(Date examDateTo) {
        this.examDateTo = examDateTo;
    }

    public ExamStatus getStatus() {
        return status;
    }

    public void setStatus(ExamStatus status) {
        this.status = status;
    }

    public Integer getCorrect() {
        return correct;
    }

    public void setCorrect(Integer correct) {
        this.correct = correct;
    }

    public Integer getSum() {
        return sum;
    }

    public void setSum(Integer sum) {
        this.sum = sum;
    }

    public String getConfigurationName() {
        return configurationName;
    }

    public void setConfigurationName(String configurationName) {
        this.configurationName = configurationName;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Exam)) return false;
        Exam exam = (Exam) o;
        return Objects.equals(getId(), exam.getId()) &&
                Objects.equals(getExaminee(), exam.getExaminee()) &&
                Objects.equals(getIssuer(), exam.getIssuer()) &&
                Objects.equals(getConfigurationId(), exam.getConfigurationId()) &&
                Objects.equals(getExamDate(), exam.getExamDate()) &&
                getStatus() == exam.getStatus() &&
                Objects.equals(getCorrect(), exam.getCorrect()) &&
                Objects.equals(getSum(), exam.getSum()) &&
                Objects.equals(getExamDateFrom(), exam.getExamDateFrom()) &&
                Objects.equals(getExamDateTo(), exam.getExamDateTo());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getExaminee(), getIssuer(), getConfigurationId(), getExamDate(), getStatus(), getCorrect(), getSum(), getExamDateFrom(), getExamDateTo());
    }

    @Override
    public String toString() {
        return "Exam{" +
                "id=" + id +
                ", examinee='" + examinee + '\'' +
                ", issuer=" + issuer +
                ", configurationId=" + configurationId +
                ", examDate=" + examDate +
                ", status=" + status +
                ", correct=" + correct +
                ", sum=" + sum +
                ", validFrom=" + examDateFrom +
                ", validTill=" + examDateTo +
                '}';
    }
}
