package baylor.csi.questionManagement.model;

import baylor.csi.questionManagement.model.supermodel.UUIDHashedEntityObject;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "category")
@SequenceGenerator(initialValue = 1, allocationSize = 1, name = "idgen", sequenceName = "category_id_seq")
@NamedQueries({
        @NamedQuery(name = Category.FIND_NAMES_BY_QUESTION_ID,
                query = "select c.name from Category c join c.questions q where q.id = ?1"),
        @NamedQuery(name = Category.FIND_QUESTION_COUNT_DTO_BY_ID,
                query = "select new baylor.csi.questionManagement.model.dto.QuestionCountDto(q.level, l.name, count(q)) from Category c join c.questions q left join q.codes code left join code.language l where c.id = ?1 group by q.level, l.name order by q.level,l.name asc"),
})
public class Category extends UUIDHashedEntityObject {

    public static final String FIND_NAMES_BY_QUESTION_ID = "FIND_NAMES_BY_QUESTION_ID";
    public static final String FIND_QUESTION_COUNT_DTO_BY_ID = "FIND_QUESTION_COUNT_DTO_BY_ID";

    private String name;
    private String description;
    private Set<Question> questions = new HashSet<>();

    @NotNull
    @Column(nullable = false, unique = true)
    @Size(max = 256, min = 3)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @NotNull
    @Column(nullable = false)
    @Size(min = 3, max = 1024)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    @JsonIgnore
    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    public Set<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
    }
}
