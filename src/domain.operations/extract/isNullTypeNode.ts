import { SyntaxKind } from 'typescript';

import type { ASTInterfacePropertyType } from '@src/domain.objects/ASTInterfacePropertyType';

/**
 * .what = checks whether an AST type node represents the `null` type
 * .why = null appears in two AST shapes (the `NullKeyword` and a `LiteralType`
 *        that wraps a `NullKeyword`); this centralizes that check so union
 *        extraction does not duplicate the decode-friction logic
 */
export const isNullTypeNode = (type: ASTInterfacePropertyType): boolean =>
  type.kind === SyntaxKind.NullKeyword ||
  (type.kind === SyntaxKind.LiteralType &&
    (type as any).literal.kind === SyntaxKind.NullKeyword);
