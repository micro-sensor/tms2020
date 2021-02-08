package baylor.csi.questionManagement.service;

import org.eclipse.jdt.core.dom.ASTVisitor;
import org.eclipse.jdt.core.dom.CompilationUnit;
import org.eclipse.jdt.core.dom.SimpleName;
import org.eclipse.jdt.core.dom.Type;

public class CustomASTVisitor extends ASTVisitor {

    public String message = "";

    private CompilationUnit cu;

    public CustomASTVisitor(CompilationUnit compilationUnit) {
        this.cu = compilationUnit;
    }


    public boolean visit(SimpleName node) {

        String errorMessage = "";

        if (node.resolveBinding() == null) {
            if (node.getParent() instanceof Type) {
//                        System.out.println("\n\tSimpleName, resolveBinding==null, node.getParent() instanceof Type");
//                        System.out.println("\tnode getFullyQualifiedName: " + node.getFullyQualifiedName());
//                        System.out.println("\tnode toString: " + node.toString());
//                        System.out.println("\tnode getNodeType: " + node.getNodeType());
            } else {
//                        System.out.println("\n\tSimpleName, resolveBinding==null, node.getParent() NOT instanceof Type");
//                        System.out.println("\tnode getFullyQualifiedName: " + node.getFullyQualifiedName());
//                        System.out.println("\tnode getIdentifier: " + node.getIdentifier());
//                        System.out.println("\tnode isDeclaration: " + node.isDeclaration());
//                        System.out.println("\tnode toString: " + node.toString());
//                        System.out.println("\tnode getNodeType: " + node.getNodeType());
//                        System.out.println("\tnode getLocationInParent: " + node.getLocationInParent());
//                        System.out.println("\tnode getStartPosition: " + node.getStartPosition());
//                        System.out.println("\tnode cu.getLineNumber(node.getStartPosition()): " + cu.getLineNumber(node.getStartPosition()));
                if (!node.isDeclaration()) {
                    errorMessage += "ERROR: Line [" + this.cu.getLineNumber(node.getStartPosition()) + "] - Variable " + node.getIdentifier() + " was not declared\n";
                    System.out.println("ERROR: Line [" + this.cu.getLineNumber(node.getStartPosition()) + "] - Variable " + node.getIdentifier() + " was not declared");
                }

            }
        } else {
//            System.out.println("\n\tName, resolveBinding!=null");
        }

        this.message = errorMessage;

        return true;
    }

}
