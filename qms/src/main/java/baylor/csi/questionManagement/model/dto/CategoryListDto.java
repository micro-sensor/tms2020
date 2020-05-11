package baylor.csi.questionManagement.model.dto;

import baylor.csi.questionManagement.model.Category;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import java.util.List;

@JacksonXmlRootElement(localName = "categories")
public class CategoryListDto {

    private List<Category> categories;

    public CategoryListDto() {
    }

    public CategoryListDto(List<Category> categories) {
        this.categories = categories;
    }

    @JacksonXmlProperty(localName = "category")
    @JacksonXmlElementWrapper(useWrapping = false)
    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

}
