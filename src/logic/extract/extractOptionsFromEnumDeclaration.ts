import { isPresent } from 'simple-type-guards';
import { EnumDeclaration } from 'typescript';

export const extractOptionsFromEnumDeclaration = (enumDeclaration: EnumDeclaration) => {
  const options = enumDeclaration.members.map((member) => (member.initializer as any).text).filter(isPresent);
  return options;
};
