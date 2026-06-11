import { SyntaxKind } from 'typescript';

import { DomainObjectPropertyType } from '@src/domain.objects';

/**
 * .what = maps a literal SyntaxKind to its base DomainObjectPropertyType
 * .why = single source of truth for literal-to-primitive map;
 *        used by both single literal and literal union extraction
 */
export const extractPrimitiveTypeFromLiteralKind = ({
  literalKind,
}: {
  literalKind: SyntaxKind;
}): DomainObjectPropertyType | null => {
  if (literalKind === SyntaxKind.StringLiteral)
    return DomainObjectPropertyType.STRING;
  if (literalKind === SyntaxKind.NumericLiteral)
    return DomainObjectPropertyType.NUMBER;
  if (
    literalKind === SyntaxKind.TrueKeyword ||
    literalKind === SyntaxKind.FalseKeyword
  )
    return DomainObjectPropertyType.BOOLEAN;
  return null;
};
