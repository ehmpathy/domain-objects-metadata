import {
  type ClassDeclaration,
  type ClassElement,
  SyntaxKind,
} from 'typescript';

const getInitialValueOfStaticProperty = (staticProperty: ClassElement) => {
  // extract the elements of the array
  const initializer = (staticProperty as any).initializer;

  // if its a string, extract the value
  if (initializer.kind === SyntaxKind.StringLiteral) return initializer.text;

  // if its a string asserted `as const`, unwrap the assertion and extract the value
  if (
    initializer.type?.typeName?.escapedText === 'const' &&
    initializer.expression?.kind === SyntaxKind.StringLiteral
  )
    return initializer.expression.text;

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
  origin: string | null;
  alias: string | null;
  primary: string[] | null;
  unique: string[] | null;
  updatable: string[] | null;
} => {
  // grab the initial value of a static property by name, or null if absent
  const getStaticValueByName = (name: string) => {
    const declaration = getStaticPropertyDeclarationByName({
      classDeclaration,
      name,
    });
    return declaration ? getInitialValueOfStaticProperty(declaration) : null;
  };

  // return the value of each relevant static property
  return {
    origin: getStaticValueByName('origin'),
    alias: getStaticValueByName('alias'),
    primary: getStaticValueByName('primary'),
    unique: getStaticValueByName('unique'),
    updatable: getStaticValueByName('updatable'),
  };
};
