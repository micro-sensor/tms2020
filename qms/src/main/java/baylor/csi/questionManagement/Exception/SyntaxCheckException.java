package baylor.csi.questionManagement.Exception;

public class SyntaxCheckException extends RuntimeException {

    public SyntaxCheckException(String message) {
        super(message);
    }

    public SyntaxCheckException(String message, Throwable cause) {
        super(message, cause);
    }
}
