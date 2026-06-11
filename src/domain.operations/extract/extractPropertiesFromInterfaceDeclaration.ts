import type { InterfaceDeclaration, TypeElement } from 'typescript';

import type { DomainObjectPropertyMetadata } from '@src/domain.objects';

import { extractPrimaryTypeFromMemberDeclaration } from './extractPrimaryTypeFromMemberDeclaration';
import { extractPropertyDefinitionFromAstNode } from './extractPropertyDefinitionFromAstNode';

const extractPropertyFromDomainObjectInterfaceMemberDeclaration = ({
  memberDeclaration,
  interfaceName,
}: {
  memberDeclaration: TypeElement;
  interfaceName: string;
}): DomainObjectPropertyMetadata => {
  // grab the name
  const propertyName = (memberDeclaration.name as any).escapedText;

  // extract the primary type from the member declaration
  const { primaryType, nullable, required } =
    extractPrimaryTypeFromMemberDeclaration({
      memberDeclaration,
      propertyName,
      interfaceName,
    });

  // extract property definition from the primary type
  return extractPropertyDefinitionFromAstNode({
    primaryType,
    nullable,
    required,
    interfaceName,
    propertyName,
  });
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
