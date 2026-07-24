import type {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '@src/domain.objects';

import { getArrayElementKind } from './getArrayElementKind';

/**
 * .what = guards whether a property is an array whose elements are enums
 * .why = lets consumers route enum arrays to a native enum[] column, distinct from
 *        primitive arrays (json/text) and reference arrays (relations)
 * .note = operates on hydrated metadata; element `of.type` must be ENUM. only hydration
 *         rewrites an inner enum REFERENCE into ENUM, so pre-hydration this yields false.
 *         derives from `getArrayElementKind`, the single classifier of the guard family
 */
export const isEnumArrayProperty = (
  property: DomainObjectPropertyMetadata,
): property is DomainObjectPropertyMetadata & {
  of: Omit<DomainObjectPropertyMetadata, 'name'> & {
    type: DomainObjectPropertyType.ENUM;
  };
} => getArrayElementKind(property) === 'enum';
