import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
  DomainObjectReferenceMetadata,
  DomainObjectVariant,
} from '@src/domain.objects';

import { isReferenceArrayProperty } from './isReferenceArrayProperty';

describe('isReferenceArrayProperty', () => {
  it('should return true for an array of domain-object references', () => {
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
    const isRefArray = isReferenceArrayProperty(property);
    expect(isRefArray).toEqual(true);
    if (isReferenceArrayProperty(property))
      expect(property.of.type).toEqual(DomainObjectPropertyType.REFERENCE); // see how we can just use 'of' here
  });
  it('should return false for an array of primitives (e.g., string[])', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'tags',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.STRING },
    });
    expect(isReferenceArrayProperty(property)).toEqual(false);
  });
  it('should return false for an array of numbers (e.g., number[])', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'scores',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.NUMBER },
    });
    expect(isReferenceArrayProperty(property)).toEqual(false);
  });
  it('should return false for an array of enums (kept distinct)', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'statuses',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.ENUM, of: ['A', 'B'] },
    });
    expect(isReferenceArrayProperty(property)).toEqual(false);
  });
  it('should return false for a non-array reference property', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'geocode',
      type: DomainObjectPropertyType.REFERENCE,
      of: new DomainObjectReferenceMetadata({
        extends: DomainObjectVariant.DOMAIN_LITERAL,
        name: 'Geocode',
      }),
    });
    expect(isReferenceArrayProperty(property)).toEqual(false);
  });
  it('should return false for a non-array primitive property', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'id',
      type: DomainObjectPropertyType.NUMBER,
    });
    expect(isReferenceArrayProperty(property)).toEqual(false);
  });
  it('should return false for a nested array (e.g., string[][]) — element is an array, not a reference', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'grid',
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.ARRAY,
        of: { type: DomainObjectPropertyType.STRING },
      },
    });
    expect(isReferenceArrayProperty(property)).toEqual(false);
  });
});
