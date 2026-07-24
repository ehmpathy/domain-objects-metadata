import type {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '@src/domain.objects';

import { getArrayElementKind } from './getArrayElementKind';

/**
 * .what = guards whether a property is an array whose elements are domain-object references
 * .why = lets consumers route reference arrays to relations, distinct from primitive arrays
 * .note = operates on hydrated metadata; the array element carries `of.type === REFERENCE`
 *         (covers both nested domain objects and by-uuid refs, which extraction collapses
 *         to REFERENCE). derives from `getArrayElementKind`, the single classifier of the
 *         guard family
 */
export const isReferenceArrayProperty = (
  property: DomainObjectPropertyMetadata,
): property is DomainObjectPropertyMetadata & {
  of: Omit<DomainObjectPropertyMetadata, 'name'> & {
    type: DomainObjectPropertyType.REFERENCE;
  };
} => getArrayElementKind(property) === 'reference';
