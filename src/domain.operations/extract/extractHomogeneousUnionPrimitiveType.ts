import type { DomainObjectPropertyType } from '@src/domain.objects';
import type { ASTInterfacePropertyType } from '@src/domain.objects/ASTInterfacePropertyType';

import { extractPrimitiveTypeFromAstNodeDeclaration } from './extractPrimitiveTypeFromAstNodeDeclaration';

/**
 * .what = extracts a homogeneous primitive type from an array of union subtype AST nodes
 * .why = enables unions whose members all map to the same primitive to be interpreted
 *        as that primitive for schema generation
 *
 * handles any subtype kind the primitive extractor supports, so a union may mix literal,
 * keyword, and template-literal members (e.g., `'a' | 'b'`, `` `v${number}` | 'latest' ``)
 * as long as they all map to the same primitive
 *
 * returns the primitive type if all subtypes map to the same non-null primitive,
 * or null if the union is heterogeneous or empty
 */
export const extractHomogeneousUnionPrimitiveType = ({
  subTypes,
}: {
  subTypes: ASTInterfacePropertyType[];
}): DomainObjectPropertyType | null => {
  if (subTypes.length === 0) return null;

  // map each subtype to its primitive via the shared extractor
  const primitiveTypes = subTypes.map((type) =>
    extractPrimitiveTypeFromAstNodeDeclaration({ declaration: type }),
  );
  const firstPrimitiveType = primitiveTypes[0]!; // safe: checked length > 0

  // check if all subtypes mapped to the same primitive type
  const allSamePrimitiveType =
    firstPrimitiveType !== null &&
    primitiveTypes.every((pt) => pt === firstPrimitiveType);

  return allSamePrimitiveType ? firstPrimitiveType : null;
};
