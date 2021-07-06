import { ClassDeclaration, SyntaxKind } from 'typescript';

export const extractClassExtendsWhat = (declaration: ClassDeclaration): null | string => {
  if (!declaration.heritageClauses) return null;
  if (!declaration.heritageClauses.length) return null;
  const extendsClause = declaration.heritageClauses.find((clause) => clause.token === SyntaxKind.ExtendsKeyword);
  if (!extendsClause) return null;
  const extendsWhat = (extendsClause as any).types[0].expression.escapedText;
  return extendsWhat;
};
