import { UnexpectedCodePathError } from '@ehmpathy/error-fns';
import { isPresent } from 'type-fns';
import { EnumDeclaration, TypeAliasDeclaration } from 'typescript';

import { extractPrimitiveTypeFromAstNodeDeclaration } from './extractPrimitiveTypeFromAstNodeDeclaration';

export const extractAliasMetadataFromAliasDeclaration = (
  aliasDeclaration: TypeAliasDeclaration,
) => {
  // resolve the primitive type, if supported
  const primitiveType = extractPrimitiveTypeFromAstNodeDeclaration({
    declaration: aliasDeclaration.type,
  });
  if (!primitiveType) {
    console.warn('unsupported type alias declaration type', {
      aliasDeclaration,
    });
    throw new UnexpectedCodePathError(
      'unsupported type alias declaration type',
      { aliasDeclaration: { name: aliasDeclaration.name.text } },
    );
  }

  return {
    name: aliasDeclaration.name.text,
    primitive: primitiveType,
  };
};
