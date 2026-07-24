import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
  DomainObjectReferenceMetadata,
  DomainObjectVariant,
} from '@src/domain.objects';

import { getArrayElementKind } from './getArrayElementKind';

describe('getArrayElementKind', () => {
  it('should classify an array of primitives as primitive (e.g., string[])', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'tags',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.STRING },
    });
    expect(getArrayElementKind(property)).toEqual('primitive');
  });
  it('should classify an array of domain-object references as reference (e.g., Item[])', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'items',
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.REFERENCE,
        of: new DomainObjectReferenceMetadata({
          extends: DomainObjectVariant.DOMAIN_ENTITY,
          name: 'Item',
        }),
      },
    });
    expect(getArrayElementKind(property)).toEqual('reference');
  });
  it('should classify an array of enums as enum (e.g., Status[])', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'statuses',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.ENUM, of: ['A', 'B'] },
    });
    expect(getArrayElementKind(property)).toEqual('enum');
  });
  it('should classify a nested array as null (e.g., string[][]) — the unmodeled-kind seam', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'grid',
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.ARRAY,
        of: { type: DomainObjectPropertyType.STRING },
      },
    });
    expect(getArrayElementKind(property)).toEqual(null);
  });
  it('should classify a non-array property as null', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'id',
      type: DomainObjectPropertyType.NUMBER,
    });
    expect(getArrayElementKind(property)).toEqual(null);
  });
});
