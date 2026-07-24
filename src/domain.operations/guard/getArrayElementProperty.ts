import {
  type DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '@src/domain.objects';

/**
 * .what = unwraps the element descriptor of an array property, or null when absent
 * .why = all three array guards (`isPrimitiveArrayProperty`, `isReferenceArrayProperty`,
 *        `isEnumArrayProperty`) share this defensive unwrap; one home keeps the null/shape
 *        checks from drift as the guard family grows
 * .note = operates on hydrated metadata; yields the array's `of` element descriptor only
 *         when the property is an array whose element is a property-definition object
 */
export const getArrayElementProperty = (
  property: DomainObjectPropertyMetadata,
): Omit<DomainObjectPropertyMetadata, 'name'> | null => {
  // must be an array
  if (property.type !== DomainObjectPropertyType.ARRAY) return null;

  // the array element must be a property definition object
  const element = property.of;
  if (!element || typeof element !== 'object' || Array.isArray(element))
    return null;
  if (!('type' in element)) return null;

  return element;
};
