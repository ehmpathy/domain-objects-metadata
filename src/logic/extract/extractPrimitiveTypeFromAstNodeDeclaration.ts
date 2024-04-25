import { SyntaxKind } from 'typescript';

import { DomainObjectPropertyType } from '../../domain';

export const extractPrimitiveTypeFromAstNodeDeclaration = ({
  declaration,
}: {
  declaration: { kind: SyntaxKind };
}): DomainObjectPropertyType | null => {
  if (declaration.kind === SyntaxKind.StringKeyword)
    return DomainObjectPropertyType.STRING;
  if (declaration.kind === SyntaxKind.NumberKeyword)
    return DomainObjectPropertyType.NUMBER;
  if (declaration.kind === SyntaxKind.BooleanKeyword)
    return DomainObjectPropertyType.BOOLEAN;
  return null;
};
