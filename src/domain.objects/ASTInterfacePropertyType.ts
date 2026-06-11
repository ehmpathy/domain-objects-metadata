import type { Node, SyntaxKind } from 'typescript';

export interface ASTInterfacePropertyType extends Node {
  name: { escapedText: string };
  kind: SyntaxKind;
  types?: ASTInterfacePropertyType[]; // present on unions
  elementType?: ASTInterfacePropertyType; // present on arrays
}
