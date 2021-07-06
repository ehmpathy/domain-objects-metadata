import ts, { ClassDeclaration, ImportDeclaration, InterfaceDeclaration, SyntaxKind } from 'typescript';
import { getDeclarationOfClassOverview } from './getDeclarationOfClassOverview';
import { getDeclarationOfInterfaceOverview } from './getDeclarationOfInterfaceOverview';

export const getFileOverview = (file: ts.SourceFile) => {
  // file name
  const fileOverview = {
    name: file.fileName,
    references: {
      referencedFiles: file.referencedFiles.map((reference) => reference.fileName),
      typeReferenceDirectives: file.typeReferenceDirectives.map((reference) => reference.fileName),
      libReferenceDirectives: file.libReferenceDirectives.map((reference) => reference.fileName),
    },
    statements: {
      interfaces: file.statements
        .filter((statement): statement is InterfaceDeclaration => statement.kind === SyntaxKind.InterfaceDeclaration)
        .map(getDeclarationOfInterfaceOverview),
      classes: file.statements
        .filter((statement): statement is ClassDeclaration => statement.kind === SyntaxKind.ClassDeclaration)
        .map(getDeclarationOfClassOverview),

      count: file.statements.length,
    },
  };
  return fileOverview;
};
