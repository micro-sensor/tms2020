package baylor.csi.questionManagement.model.dto;

import baylor.csi.questionManagement.model.Language;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import java.util.List;

@JacksonXmlRootElement(localName = "languages")
public class LanguageListDto {

    private List<Language> languages;

    public LanguageListDto() {
    }

    public LanguageListDto(List<Language> languages) {
        this.languages = languages;
    }

    @JacksonXmlProperty(localName = "language")
    @JacksonXmlElementWrapper(useWrapping = false)
    public List<Language> getLanguages() {
        return languages;
    }

    public void setLanguages(List<Language> languages) {
        this.languages = languages;
    }

}
