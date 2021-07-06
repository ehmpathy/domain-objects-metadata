import { ClassDeclaration, SyntaxKind } from 'typescript';

export const getDeclarationOfClassOverview = (classDec: ClassDeclaration) => {
  console.log(JSON.stringify(classDec, null, 2));
  return {
    name: classDec.name?.escapedText,
    heritage: classDec.heritageClauses
      ?.map((clause) => clause.types.map((type) => `${SyntaxKind[clause.token]}:${(type.expression as any).escapedText}`))
      .flat(),
  };
};
