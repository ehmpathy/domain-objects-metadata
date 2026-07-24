import type { DomainObjectPropertyType } from '@src/domain.objects';
import type { ASTInterfacePropertyType } from '@src/domain.objects/ASTInterfacePropertyType';

import { extractHomogeneousUnionPrimitiveType } from './extractHomogeneousUnionPrimitiveType';
import { isNullTypeNode } from './isNullTypeNode';

/**
 * .what = extracts, from a union's raw subtypes, the homogeneous primitive of its
 *         non-null members plus whether a null member is present
 * .why = both the member-declaration and property-definition steps must make the same
 *        "filter nulls, then check homogeneity" decision; a single transformer keeps
 *        them unified by contract rather than by coincidence of copy-pasted logic
 *
 * returns primitiveType = the shared primitive if all non-null members map to it, else null
 * returns hasNull = true iff at least one member is a null type node
 */
export const extractHomogeneousUnionMetadata = ({
  subTypes,
}: {
  subTypes: ASTInterfacePropertyType[];
}): {
  primitiveType: DomainObjectPropertyType | null;
  hasNull: boolean;
} => {
  // filter out null members to isolate the primary members
  const nonNullSubTypes = subTypes.filter((type) => !isNullTypeNode(type));
  const hasNull = nonNullSubTypes.length < subTypes.length;

  // check whether the non-null members all map to the same primitive
  const primitiveType = extractHomogeneousUnionPrimitiveType({
    subTypes: nonNullSubTypes,
  });

  return { primitiveType, hasNull };
};
