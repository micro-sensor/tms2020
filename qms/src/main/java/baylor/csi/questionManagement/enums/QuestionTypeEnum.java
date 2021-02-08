package baylor.csi.questionManagement.enums;

public enum QuestionTypeEnum {
    SELECT_ONE("SELECT_ONE"),
    SELECT_MANY("SELECT_MANY"),
    TEXT("TEXT");

    private final String name;

    QuestionTypeEnum(String s) {
        name = s;
    }

    public static QuestionTypeEnum valueOfLabel(String name) {
        for (QuestionTypeEnum questionTypeEnum : values()) {
            if (questionTypeEnum.name.equals(name)) {
                return questionTypeEnum;
            }
        }
        return null;
    }

    public boolean equalsName(String otherName) {
        // (otherName == null) check is not needed because name.equals(null) returns false
        return name.equals(otherName);
    }

    public String toString() {
        return this.name;
    }

}