import { BadRequestError, UnexpectedCodePathError } from '@ehmpathy/error-fns';
import { omit } from 'type-fns';
import {
  InterfaceDeclaration,
  isArrayTypeNode,
  isTypeReferenceNode,
  Node,
  SyntaxKind,
  TypeElement,
} from 'typescript';

import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '../../domain';
import { extractPrimitiveTypeFromAstNodeDeclaration } from './extractPrimitiveTypeFromAstNodeDeclaration';

interface ASTInterfacePropertyType extends Node {
  name: { escapedText: string };
  kind: SyntaxKind;
  types?: ASTInterfacePropertyType[]; // present on unions
  elementType?: ASTInterfacePropertyType; // present on arrays
}

const extractPrimaryTypeFromMemberDeclaration = ({
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
      `root type is a UnionType but does not have subtypes. this is unexpected. see ${interfaceName}.${propertyName}`,
    );

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
  const typeOtherThanNull = subTypes.find(
    (type) => type.kind !== SyntaxKind.NullKeyword,
  )!;
  return { primaryType: typeOtherThanNull, nullable: true, required };
};

const extractPropertyDefinitionFromNormalizedMemberTypeDefinition = ({
  primaryType,
  nullable,
  required,
  propertyName,
  interfaceName,
}: {
  primaryType: ASTInterfacePropertyType;
  nullable: boolean;
  required: boolean;
  propertyName: string;
  interfaceName: string;
}): DomainObjectPropertyMetadata => {
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

  // handle the array case
  if (isArrayTypeNode(primaryType))
    return new DomainObjectPropertyMetadata({
      name: propertyName,
      type: DomainObjectPropertyType.ARRAY,
      of: omit(
        extractPropertyDefinitionFromNormalizedMemberTypeDefinition({
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
    `could not extract property definition from interface member declaration. see ${interfaceName}.${propertyName}`,
  );
};

const extractPropertyFromDomainObjectInterfaceMemberDeclaration = ({
  memberDeclaration,
  interfaceName,
}: {
  memberDeclaration: TypeElement;
  interfaceName: string;
}): DomainObjectPropertyMetadata => {
  // grab the name
  const propertyName = (memberDeclaration.name as any).escapedText;

  // normalize the type data on the member declaration
  const { primaryType, nullable, required } =
    extractPrimaryTypeFromMemberDeclaration({
      memberDeclaration,
      propertyName,
      interfaceName,
    });

  // grab the property based on the normalized type data now
  const definition =
    extractPropertyDefinitionFromNormalizedMemberTypeDefinition({
      primaryType,
      nullable,
      required,
      interfaceName,
      propertyName,
    });

  // and return it
  return definition;
};

export const extractPropertiesFromInterfaceDeclaration = (
  interfaceDeclaration: InterfaceDeclaration,
): Record<string, DomainObjectPropertyMetadata> => {
  const properties = interfaceDeclaration.members.map((memberDeclaration) =>
    extractPropertyFromDomainObjectInterfaceMemberDeclaration({
      memberDeclaration,
      interfaceName: interfaceDeclaration.name.text,
    }),
  );
  const propertiesObject: { [index: string]: DomainObjectPropertyMetadata } =
    {};
  properties.forEach((property) => {
    propertiesObject[property.name] = property;
  });
  return propertiesObject;
};
