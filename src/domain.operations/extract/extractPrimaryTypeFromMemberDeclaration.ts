import { BadRequestError, UnexpectedCodePathError } from 'helpful-errors';
import { SyntaxKind, type TypeElement } from 'typescript';

import type { ASTInterfacePropertyType } from '@src/domain.objects/ASTInterfacePropertyType';
import { extractHomogeneousLiteralUnionType } from './extractHomogeneousLiteralUnionType';

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
} => {
  // grab the first level type on the membership declaration
  const rootType: ASTInterfacePropertyType = (memberDeclaration as any).type;

  // figure out whether its required
  const required = !memberDeclaration.questionToken;

  // if its not a union, then its not nullable and the firstLevelType is the primary type
  if (rootType.kind !== SyntaxKind.UnionType)
    return { primaryType: rootType, required, nullable: false };

  // if it is a union, then look at the subtypes.
  const subTypes = rootType.types;
  if (!subTypes)
    throw new UnexpectedCodePathError(
      'root type is a UnionType but does not have subtypes',
      { interfaceName, propertyName, rootTypeKind: rootType.kind },
    );

  // filter out null types to find the primary types
  const nonNullSubTypes = subTypes.filter(
    (type) =>
      type.kind !== SyntaxKind.NullKeyword &&
      !(
        type.kind === SyntaxKind.LiteralType &&
        (type as any).literal.kind === SyntaxKind.NullKeyword
      ),
  );
  const hasNullType = nonNullSubTypes.length < subTypes.length;

  // check if all non-null subtypes are homogeneous literals (e.g., 'a' | 'b' | 'c')
  const allAreLiteralType = nonNullSubTypes.every(
    (type) => type.kind === SyntaxKind.LiteralType,
  );
  if (allAreLiteralType) {
    const extractedType = extractHomogeneousLiteralUnionType({
      literalTypes: nonNullSubTypes,
    });
    if (extractedType)
      return {
        primaryType: rootType,
        nullable: hasNullType,
        required,
      };
  }

  // it should only have two, and one of them will be the `NullKeyword` type
  const hasMoreThanTwoSubtypes = subTypes.length > 2;
  const oneOfTheSubtypesIsNotNull = !subTypes.some(
    (type) =>
      type.kind === SyntaxKind.NullKeyword ||
      (type.kind === SyntaxKind.LiteralType &&
        (type as any).literal.kind === SyntaxKind.NullKeyword),
  );
  if (hasMoreThanTwoSubtypes || oneOfTheSubtypesIsNotNull)
    throw new BadRequestError(
      `domain object property types can only have one primary type. they can be nullable or optional, but they can not be 'string | number', for example. not satisfied by ${interfaceName}.${propertyName} `,
      {
        subTypes,
      },
    );
  // find the non-null type from the union
  const typeOtherThanNull = subTypes.find(
    (type) => type.kind !== SyntaxKind.NullKeyword,
  );
  if (!typeOtherThanNull)
    throw new UnexpectedCodePathError('union type has no non-null subtype', {
      interfaceName,
      propertyName,
      subTypeKinds: subTypes.map((t) => t.kind),
    });

  return { primaryType: typeOtherThanNull, nullable: true, required };
};
