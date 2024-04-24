import { isPresent } from 'type-fns';
import { EnumDeclaration } from 'typescript';

export const extractEnumMetadataFromEnumDeclaration = (
  enumDeclaration: EnumDeclaration,
) => {
  return {
    name: enumDeclaration.name.text,
    options: enumDeclaration.members
      .map((member) => (member.initializer as any).text)
      .filter(isPresent),
  };
};
