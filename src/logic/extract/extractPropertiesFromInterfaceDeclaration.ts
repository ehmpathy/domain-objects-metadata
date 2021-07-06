import { InterfaceDeclaration, isArrayTypeNode, isTypeReferenceNode, Node, SyntaxKind, TypeElement } from 'typescript';
import { DomainObjectProperty, DomainObjectPropertyType } from '../../domain/objects/DomainObjectMetadata';

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
}): { primaryType: ASTInterfacePropertyType; nullable: boolean; required: boolean } => {
  // grab the first level type on the membership declaration
  const rootType: ASTInterfacePropertyType = (memberDeclaration as any).type;

  // figure out whether its required
  const required = !memberDeclaration.questionToken;

  // if its not a union, then its not nullable and the firstLevelType is the primary type
  if (rootType.kind !== SyntaxKind.UnionType) return { primaryType: rootType, required, nullable: false };

  // if it is a union, then look at the subtypes.
  const subTypes = rootType.types;
  if (!subTypes) throw new Error(`root type is a UnionType but does not have subtypes. this is unexpected. see ${interfaceName}.${propertyName}`);

  // it should only have two, and one of them will be the `NullKeyword` type
  const hasMoreThanTwoSubtypes = subTypes.length > 2;
  const oneOfTheSubtypesIsNotNull = !subTypes.some((type) => type.kind === SyntaxKind.NullKeyword);
  if (hasMoreThanTwoSubtypes || oneOfTheSubtypesIsNotNull)
    throw new Error(
      `domain object property types can only have one primary type. they can be nullable or optional, but they can not be 'string | number', for example. not satisfied by ${interfaceName}.${propertyName} `,
    );
  const typeOtherThanNull = subTypes.find((type) => type.kind !== SyntaxKind.NullKeyword)!;
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
}): DomainObjectProperty => {
  // handle the simple cases first
  if (primaryType.kind === SyntaxKind.StringKeyword) return new DomainObjectProperty({ type: DomainObjectPropertyType.STRING, nullable, required });
  if (primaryType.kind === SyntaxKind.NumberKeyword) return new DomainObjectProperty({ type: DomainObjectPropertyType.NUMBER, nullable, required });
  if (primaryType.kind === SyntaxKind.BooleanKeyword) return new DomainObjectProperty({ type: DomainObjectPropertyType.BOOLEAN, nullable, required });

  // handle the array case
  if (isArrayTypeNode(primaryType))
    return new DomainObjectProperty({
      type: DomainObjectPropertyType.ARRAY,
      of: extractPropertyDefinitionFromNormalizedMemberTypeDefinition({
        primaryType: primaryType.elementType,
        nullable: false, // elements of an array should not be null, nulls should be filtered out
        required: true, // elements of an array should not be undefined, undefineds should be filtered out
        propertyName,
        interfaceName,
      }),
      nullable,
      required,
    });

  // handle the nested type reference
  if (isTypeReferenceNode(primaryType))
    return new DomainObjectProperty({
      type: DomainObjectPropertyType.REFERENCE,
      of: (primaryType.typeName as any).escapedText, // note: this is a string
      nullable,
      required,
    });

  // throw an error otherwise
  throw new Error(`could not extract property definition from interface member declaration. see ${interfaceName}.${propertyName}`);
};

const extractPropertyFromDomainObjectInterfaceMemberDeclaration = ({
  memberDeclaration,
  interfaceName,
}: {
  memberDeclaration: TypeElement;
  interfaceName: string;
}): { name: string; definition: DomainObjectProperty } => {
  // grab the name
  const propertyName = (memberDeclaration.name as any).escapedText;

  // normalize the type data on the member declaration
  const { primaryType, nullable, required } = extractPrimaryTypeFromMemberDeclaration({ memberDeclaration, propertyName, interfaceName });

  // grab the property based on the normalized type data now
  const definition = extractPropertyDefinitionFromNormalizedMemberTypeDefinition({ primaryType, nullable, required, interfaceName, propertyName });

  return {
    name: propertyName,
    definition,
  };
};

export const extractPropertiesFromInterfaceDeclaration = (interfaceDeclaration: InterfaceDeclaration) => {
  const properties = interfaceDeclaration.members.map((memberDeclaration) =>
    extractPropertyFromDomainObjectInterfaceMemberDeclaration({
      memberDeclaration,
      interfaceName: interfaceDeclaration.name.text,
    }),
  );
  const propertiesObject: { [index: string]: DomainObjectProperty } = {};
  properties.forEach((property) => {
    propertiesObject[property.name] = property.definition;
  });
  return propertiesObject;
};
