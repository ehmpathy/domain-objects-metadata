import { ClassDeclaration, ClassElement, SyntaxKind } from 'typescript';

const getInitialValueOfStaticProperty = (staticProperty: ClassElement) => {
  // extract the elements of the array
  const initializer = (staticProperty as any).initializer;

  // if its a string, extract the value
  if (initializer.kind === SyntaxKind.StringLiteral) return initializer.text;

  // if its an array, extract the values
  const elements =
    initializer.type?.typeName?.escapedText === 'const'
      ? initializer.expression?.elements
      : initializer.elements;
  const initialValues = elements
    ?.filter((element: any) => element.text)
    .map((element: any) => element.text);
  return initialValues;
};

const getStaticPropertyDeclarationByName = ({
  classDeclaration,
  name,
}: {
  classDeclaration: ClassDeclaration;
  name: string;
}) => {
  return classDeclaration.members.find(
    (member) => (member.name as any).escapedText === name,
  );
};

export const extractRelevantStaticPropertiesFromClassDeclaration = (
  classDeclaration: ClassDeclaration,
): {
  alias: string | null;
  primary: string[] | null;
  unique: string[] | null;
  updatable: string[] | null;
} => {
  // grab values of alias
  const aliasPropertyDeclaration = getStaticPropertyDeclarationByName({
    classDeclaration,
    name: 'alias',
  });
  const alias = aliasPropertyDeclaration
    ? getInitialValueOfStaticProperty(aliasPropertyDeclaration)
    : null;

  // grab values of primary
  const primaryPropertyDeclaration = getStaticPropertyDeclarationByName({
    classDeclaration,
    name: 'primary',
  });
  const primary = primaryPropertyDeclaration
    ? getInitialValueOfStaticProperty(primaryPropertyDeclaration)
    : null;

  // grab values of unique
  const uniquePropertyDeclaration = getStaticPropertyDeclarationByName({
    classDeclaration,
    name: 'unique',
  });
  const unique = uniquePropertyDeclaration
    ? getInitialValueOfStaticProperty(uniquePropertyDeclaration)
    : null;

  // grab values of updatable
  const updatablePropertyDeclaration = getStaticPropertyDeclarationByName({
    classDeclaration,
    name: 'updatable',
  });
  const updatable = updatablePropertyDeclaration
    ? getInitialValueOfStaticProperty(updatablePropertyDeclaration)
    : null;

  // return them
  return {
    alias,
    primary,
    unique,
    updatable,
  };
};
