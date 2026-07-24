import { BadRequestError, UnexpectedCodePathError } from 'helpful-errors';
import { SyntaxKind, type TypeElement } from 'typescript';

import type { DomainObjectPropertyType } from '@src/domain.objects';
import type { ASTInterfacePropertyType } from '@src/domain.objects/ASTInterfacePropertyType';

import { extractHomogeneousUnionMetadata } from './extractHomogeneousUnionMetadata';
import { isNullTypeNode } from './isNullTypeNode';

/**
 * .what = extracts the primary type from a member declaration, along with nullable and required flags
 * .why = separates union unwrap from property definition extraction
 */
export const extractPrimaryTypeFromMemberDeclaration = ({
  memberDeclaration,
  propertyName,
  interfaceName,
}: {
  memberDeclaration: TypeElement;
  propertyName: string;
  interfaceName: string;
}): {
  primaryType: ASTInterfacePropertyType;
  nullable: boolean;
  required: boolean;
  resolvedType: DomainObjectPropertyType | null;
} => {
  // grab the first level type on the membership declaration
  const rootType: ASTInterfacePropertyType = (memberDeclaration as any).type;

  // figure out whether its required
  const required = !memberDeclaration.questionToken;

  // if its not a union, then its not nullable and the firstLevelType is the primary type
  if (rootType.kind !== SyntaxKind.UnionType)
    return {
      primaryType: rootType,
      required,
      nullable: false,
      resolvedType: null,
    };

  // if it is a union, then look at the subtypes.
  const subTypes = rootType.types;
  if (!subTypes)
    throw new UnexpectedCodePathError(
      'root type is a UnionType but does not have subtypes',
      { interfaceName, propertyName, rootTypeKind: rootType.kind },
    );

  // extract the homogeneous primitive (e.g., 'a' | 'b', `v${number}` | 'latest') and null presence
  const { primitiveType: homogeneousPrimitiveType, hasNull: hasNullType } =
    extractHomogeneousUnionMetadata({ subTypes });
  if (homogeneousPrimitiveType)
    return {
      primaryType: rootType,
      nullable: hasNullType,
      required,
      resolvedType: homogeneousPrimitiveType,
    };

  // it should only have two, and one of them will be the `NullKeyword` type
  const hasMoreThanTwoSubtypes = subTypes.length > 2;
  const oneOfTheSubtypesIsNotNull = !subTypes.some(isNullTypeNode);
  if (hasMoreThanTwoSubtypes || oneOfTheSubtypesIsNotNull)
    throw new BadRequestError(
      `domain object property types can only have one primary type. they can be nullable or optional, but they can not be 'string | number', for example. not satisfied by ${interfaceName}.${propertyName} `,
      {
        subTypeKinds: subTypes.map((type) => {
          // unwrap LiteralType to its inner literal kind, so 'active' | 1 reads as StringLiteral | NumericLiteral rather than LiteralType | LiteralType
          const kind =
            type.kind === SyntaxKind.LiteralType
              ? (type as any).literal.kind
              : type.kind;

          // NumericLiteral (9) and FirstLiteralToken (9) share one enum value, so the reverse map lands on the alias; prefer the domain-meaningful name
          if (kind === SyntaxKind.NumericLiteral) return 'NumericLiteral';
          return SyntaxKind[kind];
        }),
      },
    );
  // find the non-null type from the union
  const typeOtherThanNull = subTypes.find((type) => !isNullTypeNode(type));
  if (!typeOtherThanNull)
    throw new UnexpectedCodePathError('union type has no non-null subtype', {
      interfaceName,
      propertyName,
      subTypeKinds: subTypes.map((t) => t.kind),
    });

  return {
    primaryType: typeOtherThanNull,
    nullable: true,
    required,
    resolvedType: null,
  };
};
