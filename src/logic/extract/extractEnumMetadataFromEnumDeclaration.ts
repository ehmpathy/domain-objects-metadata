import { isPresent } from 'simple-type-guards';
import { EnumDeclaration } from 'typescript';

export const extractEnumMetadataFromEnumDeclaration = (enumDeclaration: EnumDeclaration) => {
  return {
    name: enumDeclaration.name.text,
    options: enumDeclaration.members.map((member) => (member.initializer as any).text).filter(isPresent),
  };
};
