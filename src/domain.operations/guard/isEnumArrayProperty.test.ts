import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
  DomainObjectReferenceMetadata,
  DomainObjectVariant,
} from '@src/domain.objects';

import { isEnumArrayProperty } from './isEnumArrayProperty';

describe('isEnumArrayProperty', () => {
  it('should return true for an array of enums (e.g., Status[])', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'statuses',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.ENUM, of: ['A', 'B'] },
    });
    const isEnumArray = isEnumArrayProperty(property);
    expect(isEnumArray).toEqual(true);
    if (isEnumArrayProperty(property))
      expect(property.of.type).toEqual(DomainObjectPropertyType.ENUM); // see how we can just use 'of' here
  });
  it('should return false for an array of strings (kept distinct)', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'tags',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.STRING },
    });
    expect(isEnumArrayProperty(property)).toEqual(false);
  });
  it('should return false for an array of domain-object references (kept distinct)', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'geocodes',
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.REFERENCE,
        of: new DomainObjectReferenceMetadata({
          extends: DomainObjectVariant.DOMAIN_LITERAL,
          name: 'Geocode',
        }),
      },
    });
    expect(isEnumArrayProperty(property)).toEqual(false);
  });
  it('should return false for a non-array enum property', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'status',
      type: DomainObjectPropertyType.ENUM,
      of: ['A', 'B'],
    });
    expect(isEnumArrayProperty(property)).toEqual(false);
  });
  it('should return false for a nested array (e.g., string[][]) — element is an array, not an enum', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'grid',
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.ARRAY,
        of: { type: DomainObjectPropertyType.STRING },
      },
    });
    expect(isEnumArrayProperty(property)).toEqual(false);
  });
});
