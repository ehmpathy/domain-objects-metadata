import { InterfaceDeclaration } from 'typescript';

export const getDeclarationOfInterfaceOverview = (
  interfaceDec: InterfaceDeclaration,
) => {
  return {
    name: interfaceDec.name?.escapedText,
    members: interfaceDec.members.map(
      (member) => (member.name as any).escapedText,
    ),
  };
};
