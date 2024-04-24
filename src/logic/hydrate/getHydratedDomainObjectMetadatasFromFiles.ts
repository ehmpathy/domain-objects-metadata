import { UnexpectedCodePathError } from '@ehmpathy/error-fns';
import omit from 'lodash.omit';
import { isClassDeclaration, isEnumDeclaration, SourceFile } from 'typescript';

import {
  DomainObjectMetadata,
  DomainObjectReferenceMetadata,
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '../../domain';
import { extractDomainObjectMetadataForDeclarationInFile } from '../extract/extractDomainObjectMetadataForDeclarationInFile';
import { extractEnumMetadataFromEnumDeclaration } from '../extract/extractEnumMetadataFromEnumDeclaration';
import { isAClassDecorationWhichExtendsDomainObject } from '../extract/isAClassDeclarationWhichExtendsDomainObject';

// hydrate property if needed
const ensurePropertyIsHydrated = ({
  domainObjectName,
  propertyName,
  propertyDefinition: definition,
  domainObjectMetadatas,
  enumMetadatas,
}: {
  domainObjectName: string;
  propertyName: string;
  propertyDefinition: DomainObjectPropertyMetadata;
  domainObjectMetadatas: DomainObjectMetadata[];
  enumMetadatas: { name: string; options: string[] }[];
}): DomainObjectPropertyMetadata => {
  // handle the special case of arrays first; arrays are special because their `of` property is a property definition of its own
  if (definition.type === DomainObjectPropertyType.ARRAY)
    return new DomainObjectPropertyMetadata({
      ...definition,
      of: omit(
        ensurePropertyIsHydrated({
          domainObjectName,
          propertyName,
          propertyDefinition: definition.of as DomainObjectPropertyMetadata, // since arrays have nested property as "of",
          domainObjectMetadatas,
          enumMetadatas,
        }),
        'name', // make sure to remove the nested name that comes back when we hydrate a reference property
      ),
    });

  // otherwise, if not a REFERENCE property, then its already hydrated
  if (definition.type !== DomainObjectPropertyType.REFERENCE) return definition; // no change

  // since its a REFERENCE property, hydrate it
  const referencedName = definition.of as string; // reference properties define this as `string` before they're hydrated

  // try to see if its referencing a domain object
  const foundReferencedDomainObject = domainObjectMetadatas.find(
    (metadata) => metadata.name === referencedName,
  );
  if (foundReferencedDomainObject)
    return new DomainObjectPropertyMetadata({
      ...definition,
      name: propertyName, // this is not already on the `definition` if it was nested in an array, so make sure we set it
      of: new DomainObjectReferenceMetadata({
        name: foundReferencedDomainObject.name,
        extends: foundReferencedDomainObject.extends,
      }), // only expose the "name" and "extends" on the nested object metadata
    });

  // try to see if its referencing an enum
  const foundReferencedEnum = enumMetadatas.find(
    (metadata) => metadata.name === referencedName,
  );
  if (foundReferencedEnum)
    return new DomainObjectPropertyMetadata({
      ...definition,
      type: DomainObjectPropertyType.ENUM, // update the name to "enum"
      of: foundReferencedEnum.options,
    });

  // if this is neither, throw an error since we can't figure out what its referencing
  throw new UnexpectedCodePathError(
    `could not hydrate a property who references another type. no domain object or enum found with that referenced name. see \`${domainObjectName}.${propertyName}: ${referencedName}\``,
  );
};

export const getHydratedDomainObjectMetadatasFromFiles = (
  files: SourceFile[],
) => {
  // lookup all the unhydrated metadatas for all domain object declarations
  const domainObjectMetadatas = files
    .map((file) => {
      const domainObjectDeclarations = file.statements
        .filter(isClassDeclaration)
        .filter(isAClassDecorationWhichExtendsDomainObject);
      return domainObjectDeclarations.map((classDeclaration) =>
        extractDomainObjectMetadataForDeclarationInFile({
          classDeclaration,
          file,
        }),
      );
    })
    .flat();

  // lookup all the enum metadatas for all of the enum declarations
  const enumMetadatas = files
    .map((file) => {
      const enumDeclarations = file.statements.filter(isEnumDeclaration);
      return enumDeclarations.map(extractEnumMetadataFromEnumDeclaration);
    })
    .flat();

  // hydrate every type `reference` property in `domainObjectMetadata`
  const hydratedDomainObjectMetadatas = domainObjectMetadatas.map(
    (metadata) => {
      return new DomainObjectMetadata({
        ...metadata,
        properties: Object.fromEntries(
          Object.entries(metadata.properties).map(([name, definition]) => {
            return [
              name,
              ensurePropertyIsHydrated({
                domainObjectName: metadata.name,
                propertyName: name,
                propertyDefinition: definition,
                domainObjectMetadatas,
                enumMetadatas,
              }),
            ];
          }),
        ),
      });
    },
  );

  // and return the hydrated object metadatas
  return hydratedDomainObjectMetadatas;
};
