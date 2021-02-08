package edu.baylor.ems.dto;

import java.util.List;

public class ExamSubmissionDto {
    private Integer examId;
    private List<Integer> chosenAnswerIds;

    public ExamSubmissionDto() {
    }

    public Integer getExamId() {
        return examId;
    }

    public void setExamId(Integer examId) {
        this.examId = examId;
    }

    public List<Integer> getChosenAnswerIds() {
        return chosenAnswerIds;
    }

    public void setChosenAnswerIds(List<Integer> chosenAnswerIds) {
        this.chosenAnswerIds = chosenAnswerIds;
    }
}
