import type {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '@src/domain.objects';

import { getArrayElementKind } from './getArrayElementKind';

/**
 * .what = guards whether a property is an array whose elements are primitives
 * .why = lets consumers route primitive arrays to a json/text column, distinct from
 *        reference arrays (relations) and enum arrays (native enum[])
 * .note = operates on hydrated metadata; element `of.type` must be STRING, NUMBER, BOOLEAN,
 *         or DATE. explicitly excludes REFERENCE (reference array) and ENUM (enum array).
 *         derives from `getArrayElementKind`, the single classifier of the guard family
 */
export const isPrimitiveArrayProperty = (
  property: DomainObjectPropertyMetadata,
): property is DomainObjectPropertyMetadata & {
  of: Omit<DomainObjectPropertyMetadata, 'name'> & {
    type:
      | DomainObjectPropertyType.STRING
      | DomainObjectPropertyType.NUMBER
      | DomainObjectPropertyType.BOOLEAN
      | DomainObjectPropertyType.DATE;
  };
} => getArrayElementKind(property) === 'primitive';
