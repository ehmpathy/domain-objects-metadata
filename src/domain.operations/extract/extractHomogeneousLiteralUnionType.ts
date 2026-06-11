import type { DomainObjectPropertyType } from '@src/domain.objects';
import type { ASTInterfacePropertyType } from '@src/domain.objects/ASTInterfacePropertyType';

import { extractPrimitiveTypeFromLiteralKind } from './extractPrimitiveTypeFromLiteralKind';

/**
 * .what = extracts homogeneous literal union type from array of literal AST nodes
 * .why = enables `'a' | 'b' | 'c'` to be interpreted as STRING type for schema generation
 *
 * returns the primitive type if all literals are the same type (e.g., all strings),
 * or null if the union is heterogeneous or empty
 */
export const extractHomogeneousLiteralUnionType = ({
  literalTypes,
}: {
  literalTypes: ASTInterfacePropertyType[];
}): DomainObjectPropertyType | null => {
  if (literalTypes.length === 0) return null;

  // map literal kinds to primitive types via shared transformer
  const primitiveTypes = literalTypes.map((type) =>
    extractPrimitiveTypeFromLiteralKind({
      literalKind: (type as any).literal.kind,
    }),
  );
  const firstPrimitiveType = primitiveTypes[0]!; // safe: checked length > 0

  // check if all literals map to the same primitive type
  const allSamePrimitiveType =
    firstPrimitiveType !== null &&
    primitiveTypes.every((pt) => pt === firstPrimitiveType);

  return allSamePrimitiveType ? firstPrimitiveType : null;
};
