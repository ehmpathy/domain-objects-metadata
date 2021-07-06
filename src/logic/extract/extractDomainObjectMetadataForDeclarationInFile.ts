import { ClassDeclaration, isInterfaceDeclaration, SourceFile, SyntaxKind } from 'typescript';

import { DomainObjectMetadata, DomainObjectVariant } from '../../domain/objects/DomainObjectMetadata';
import { extractClassExtendsWhat } from './extractClassExtendsWhat';
import { extractPropertiesFromInterfaceDeclaration } from './extractPropertiesFromInterfaceDeclaration';
import { extractRelevantStaticPropertiesFromClassDeclaration } from './extractRelevantStaticPropertiesFromClassDeclaration';
import { isAClassDecorationWhichExtendsDomainObject } from './isAClassDeclarationWhichExtendsDomainObject';

export const extractDomainObjectMetadataForDeclarationInFile = ({
  classDeclaration,
  file,
}: {
  classDeclaration: ClassDeclaration;
  file: SourceFile;
}): DomainObjectMetadata => {
  // sanity check that it _is_ a declaration for domain object
  if (!isAClassDecorationWhichExtendsDomainObject(classDeclaration))
    throw new Error('called extraction of domain object metadata on a class declaration which does not extend DomainObject');

  // grab the name of the class
  if (!classDeclaration.name?.text)
    throw new Error(`domain objects must be given names in their definition. found one without name in ${file.fileName}`);
  const name = classDeclaration.name.text;

  // grab which class it extends
  const extendsWhat: DomainObjectVariant = extractClassExtendsWhat(classDeclaration) as DomainObjectVariant;

  // grab the name of the interface it implements
  const implementsClause = classDeclaration.heritageClauses!.find((clause) => clause.token === SyntaxKind.ImplementsKeyword);
  if (!implementsClause) throw new Error(`domain objects must implement an interface which defines their properties. not found for ${name}`);
  const nameOfImplementedInterface = (implementsClause.types[0].expression as any).escapedText;

  // find the interface that it implements in the file
  const interfaceDeclaration = file.statements
    .filter(isInterfaceDeclaration)
    .find((declaration) => declaration.name.text === nameOfImplementedInterface);
  if (!interfaceDeclaration)
    throw new Error(
      `domain object class-declarations must be in the same file as their 'implements' interface-declarations. not satisfied for ${name}`,
    );

  // extract the properties of the class, defined on the interface
  const properties = extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);

  // grab the static properties of the class: `unique` and `updatable` specifically
  const relevantStaticProperties = extractRelevantStaticPropertiesFromClassDeclaration(classDeclaration);

  // define the decorations of this domain-object
  const decorations = {
    unique: relevantStaticProperties.unique,
    updatable: relevantStaticProperties.updatable,
  };

  // return the domain object metadata
  return new DomainObjectMetadata({
    name,
    extends: extendsWhat,
    properties,
    decorations,
  });
};
