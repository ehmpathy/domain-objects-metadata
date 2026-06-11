import { SyntaxKind } from 'typescript';

import { DomainObjectPropertyType } from '@src/domain.objects';

import { extractPrimitiveTypeFromLiteralKind } from './extractPrimitiveTypeFromLiteralKind';

export const extractPrimitiveTypeFromAstNodeDeclaration = ({
  declaration,
}: {
  declaration: {
    kind: SyntaxKind;
    literal?: { kind: SyntaxKind };
    type?: { kind: SyntaxKind; types?: { kind: SyntaxKind }[] };
  };
}): DomainObjectPropertyType | null => {
  // support root primitives
  if (declaration.kind === SyntaxKind.StringKeyword)
    return DomainObjectPropertyType.STRING;
  if (declaration.kind === SyntaxKind.NumberKeyword)
    return DomainObjectPropertyType.NUMBER;
  if (declaration.kind === SyntaxKind.BooleanKeyword)
    return DomainObjectPropertyType.BOOLEAN;

  // support literal types (e.g., 'active' -> STRING, 42 -> NUMBER)
  if (declaration.kind === SyntaxKind.LiteralType && declaration.literal)
    return extractPrimitiveTypeFromLiteralKind({
      literalKind: declaration.literal.kind,
    });

  // otherwise, its unsupported
  return null;
};
