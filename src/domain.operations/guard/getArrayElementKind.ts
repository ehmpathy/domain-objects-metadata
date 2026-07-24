import {
  type DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '@src/domain.objects';

import { getArrayElementProperty } from './getArrayElementProperty';
import { isReferenceProperty } from './isReferenceProperty';

/**
 * .what = the modeled kinds an array property's element can take
 */
export type ArrayElementKind = 'primitive' | 'reference' | 'enum';

/**
 * .what = classifies the element kind of an array property, or null when the property is
 *         not an array or its element fits no modeled kind
 * .why = the three array guards (primitive, reference, enum) share one decision; a single
 *        classifier owns the full DomainObjectPropertyType enumeration, so an unhandled
 *        element kind (e.g. a nested array `string[][]`, whose element `of.type` is ARRAY)
 *        falls through one testable seam instead of three independently-silent branches
 * .note = operates on hydrated metadata; returns null for nested-array elements
 *         (of.type === ARRAY) and any unmodeled kind, so callers can fail loud on the unknown
 */
export const getArrayElementKind = (
  property: DomainObjectPropertyMetadata,
): ArrayElementKind | null => {
  // unwrap the array element; not an array ⇒ no kind
  const element = getArrayElementProperty(property);
  if (!element) return null;

  // primitive elements route to a json/text column
  if (
    element.type === DomainObjectPropertyType.STRING ||
    element.type === DomainObjectPropertyType.NUMBER ||
    element.type === DomainObjectPropertyType.BOOLEAN ||
    element.type === DomainObjectPropertyType.DATE
  )
    return 'primitive';

  // domain-object-reference elements route to a relation
  if (isReferenceProperty(element)) return 'reference';

  // enum elements route to a native enum[] column
  if (element.type === DomainObjectPropertyType.ENUM) return 'enum';

  // nested array (ARRAY) or any unmodeled kind: one place, not three
  return null;
};
