import { UnexpectedCodePathError } from 'helpful-errors';
import { omit } from 'type-fns';
import { isArrayTypeNode, isTypeReferenceNode, SyntaxKind } from 'typescript';

import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '@src/domain.objects';
import type { ASTInterfacePropertyType } from '@src/domain.objects/ASTInterfacePropertyType';

import { extractHomogeneousUnionMetadata } from './extractHomogeneousUnionMetadata';
import { extractPrimitiveTypeFromAstNodeDeclaration } from './extractPrimitiveTypeFromAstNodeDeclaration';

/**
 * .what = extracts property definition from an AST node
 * .why = converts AST node into domain object property metadata
 */
export const extractPropertyDefinitionFromAstNode = ({
  primaryType,
  nullable,
  required,
  resolvedType = null,
  propertyName,
  interfaceName,
}: {
  primaryType: ASTInterfacePropertyType;
  nullable: boolean;
  required: boolean;
  resolvedType?: DomainObjectPropertyType | null;
  propertyName: string;
  interfaceName: string;
}): DomainObjectPropertyMetadata => {
  // prefer the pre-resolved homogeneous-union type if the caller already computed it
  if (resolvedType)
    return new DomainObjectPropertyMetadata({
      name: propertyName,
      type: resolvedType,
      nullable,
      required,
    });

  // handle the simple cases first
  const primitiveType = extractPrimitiveTypeFromAstNodeDeclaration({
    declaration: primaryType,
  });
  if (primitiveType)
    return new DomainObjectPropertyMetadata({
      name: propertyName,
      type: primitiveType,
      nullable,
      required,
    });

  // unwrap parenthesized types (e.g., ('a' | 'b')[] has ParenthesizedType that wraps UnionType)
  if (primaryType.kind === SyntaxKind.ParenthesizedType) {
    const innerType = (primaryType as any).type as ASTInterfacePropertyType;
    return extractPropertyDefinitionFromAstNode({
      primaryType: innerType,
      nullable,
      required,
      propertyName,
      interfaceName,
    });
  }

  // handle homogeneous primitive unions (e.g., 'a' | 'b' | 'c', `v${number}` | 'latest', or 'a' | 'b' | null)
  if (primaryType.kind === SyntaxKind.UnionType && primaryType.types) {
    const { primitiveType: homogeneousPrimitiveType, hasNull: hasNullInUnion } =
      extractHomogeneousUnionMetadata({ subTypes: primaryType.types });
    if (homogeneousPrimitiveType)
      return new DomainObjectPropertyMetadata({
        name: propertyName,
        type: homogeneousPrimitiveType,
        nullable: nullable || hasNullInUnion,
        required,
      });
  }

  // handle the array case
  if (isArrayTypeNode(primaryType))
    return new DomainObjectPropertyMetadata({
      name: propertyName,
      type: DomainObjectPropertyType.ARRAY,
      of: omit(
        extractPropertyDefinitionFromAstNode({
          primaryType: primaryType.elementType,
          nullable: false, // elements of an array should not be null, nulls should be filtered out
          required: true, // elements of an array should not be undefined, undefineds should be filtered out
          propertyName,
          interfaceName,
        }),
        ['name'],
      ),
      nullable,
      required,
    });

  // handle the nested type reference
  if (isTypeReferenceNode(primaryType)) {
    // extract the reference name
    const referencedName = (primaryType.typeName as any).escapedText;

    // handle date references
    if (referencedName === 'Date')
      return new DomainObjectPropertyMetadata({
        name: propertyName,
        type: DomainObjectPropertyType.DATE,
        nullable,
        required,
      });

    // handle Literalize<Enum> references // todo: think through how we can support future aliases like these via plugins, instead of hardcoded defs
    if (referencedName === 'Literalize') {
      const possibleEnumName = (primaryType.typeArguments?.[0] as any)?.typeName
        ?.escapedText;
      const hasEnumArgumentLikely =
        primaryType.typeArguments?.length === 1 &&
        primaryType.typeArguments[0]?.kind === SyntaxKind.TypeReference &&
        possibleEnumName;
      if (hasEnumArgumentLikely)
        return new DomainObjectPropertyMetadata({
          name: propertyName,
          type: DomainObjectPropertyType.REFERENCE,
          of: possibleEnumName,
          nullable,
          required,
        });
    }

    // handle UniDateTime and UniDate references // todo: think through how we can support future aliases like these via plugins, instead of hardcoded defs
    if (referencedName === 'UniDateTime' || referencedName === 'UniDate')
      return new DomainObjectPropertyMetadata({
        name: propertyName,
        type: DomainObjectPropertyType.STRING,
        nullable,
        required,
      });

    // handle Ref<> references // todo: think through how we can support future aliases like these via plugins, instead of hardcoded defs
    if (referencedName === 'Ref') {
      const possibleReferencedDobjName = (primaryType.typeArguments?.[0] as any)
        ?.exprName?.escapedText;
      const hasReferencedDObjArgumentLikely =
        primaryType.typeArguments?.length === 1 &&
        primaryType.typeArguments[0]?.kind === SyntaxKind.TypeQuery &&
        (primaryType.typeArguments[0] as any)?.exprName?.kind ===
          SyntaxKind.Identifier &&
        possibleReferencedDobjName;
      if (hasReferencedDObjArgumentLikely)
        return new DomainObjectPropertyMetadata({
          name: propertyName,
          type: DomainObjectPropertyType.REFERENCE,
          of: possibleReferencedDobjName,
          nullable,
          required,
        });
    }

    // handle generic references (e.g., alias, enum, or domain-object-references)
    return new DomainObjectPropertyMetadata({
      name: propertyName,
      type: DomainObjectPropertyType.REFERENCE,
      of: (primaryType.typeName as any).escapedText, // note: this is a string
      nullable,
      required,
    });
  }

  // throw an error otherwise
  throw new UnexpectedCodePathError(
    'could not extract property definition from interface member declaration',
    { interfaceName, propertyName, primaryTypeKind: primaryType.kind },
  );
};
