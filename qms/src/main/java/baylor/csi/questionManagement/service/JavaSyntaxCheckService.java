package baylor.csi.questionManagement.service;

import baylor.csi.questionManagement.Exception.SyntaxCheckException;
import org.eclipse.jdt.core.compiler.IProblem;
import org.eclipse.jdt.core.dom.*;
import org.eclipse.jface.text.BadLocationException;
import org.eclipse.jface.text.Document;
import org.eclipse.text.edits.TextEdit;
import org.springframework.stereotype.Service;

@Service
public class JavaSyntaxCheckService {

    public String check(String codeBlock) {

        String message = "";

        int codeBlockType = ASTParser.K_STATEMENTS;
        if (codeBlock.contains("class ")) {
            codeBlockType = ASTParser.K_COMPILATION_UNIT;
        } else {
            throw new SyntaxCheckException("Java code should be inside class");
        }
        ASTParser codeBlockParser = ASTParser.newParser(AST.JLS3);
        codeBlockParser.setKind(codeBlockType);
        codeBlockParser.setSource(codeBlock.toCharArray());
        codeBlockParser.setResolveBindings(true);
        ASTNode astNode = codeBlockParser.createAST(null);

        if (codeBlockType == ASTParser.K_COMPILATION_UNIT) {
            System.out.println("type: ASTParser.K_COMPILATION_UNIT");
            CompilationUnit compilationUnit = (CompilationUnit) astNode;
            compilationUnit.recordModifications();
            return printErrors(compilationUnit);
        } else if (codeBlockType == ASTParser.K_STATEMENTS) {
            System.out.println("type: ASTParser.K_STATEMENTS");
            Block block_of_code = (Block) astNode;

            ASTParser parser = ASTParser.newParser(AST.JLS3);
            parser.setKind(ASTParser.K_COMPILATION_UNIT);
            parser.setSource("".toCharArray());
            CompilationUnit compilationUnit = (CompilationUnit) parser.createAST(null);
            compilationUnit.recordModifications();
            AST ast = compilationUnit.getAST();

            TypeDeclaration typeDeclaration = ast.newTypeDeclaration();
            typeDeclaration.setName(ast.newSimpleName("Test"));
            typeDeclaration.bodyDeclarations().add(block_of_code);
            compilationUnit.types().add(typeDeclaration);

            return printErrors(compilationUnit);
        }

        return message;
    }

    private String printErrors(CompilationUnit cu) {

        String message = "";
//        printResultingCode(cu);

        IProblem[] problems = cu.getProblems();
        AST ast = cu.getAST();
        for (IProblem problem : problems) {
            if (problem.isError()) {
                message += "ERROR: Line [" + problem.getSourceLineNumber() + "] - " + problem.getMessage() + problem.getSourceStart() + "\n";
                System.out.println("ERROR: Line [" + problem.getSourceLineNumber() + "] - " + problem.getMessage() + problem.getSourceStart());
            } else if (problem.isWarning()) {
                message += "WARNING: Line [" + problem.getSourceLineNumber() + "] - " + problem.getMessage() + problem.getSourceStart() + "\n";
                System.out.println("WARNING: Line [" + problem.getSourceLineNumber() + "] - " + problem.getMessage() + problem.getSourceStart());
            }
        }

        CustomASTVisitor customASTVisitor = new CustomASTVisitor(cu);
        cu.accept(customASTVisitor);
        message += customASTVisitor.message;

        return message;
    }

    private void printResultingCode(CompilationUnit cu) {
        // Print the resulting document
        Document document = new Document();
        TextEdit edits = cu.rewrite(document, null);
        try {
            edits.apply(document);
        } catch (BadLocationException e) {
            e.printStackTrace();
        }
        System.out.println("Resulting document:");
        System.out.println(document.get());
    }


}
