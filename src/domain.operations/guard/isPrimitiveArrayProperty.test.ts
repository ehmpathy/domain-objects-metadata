import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
  DomainObjectReferenceMetadata,
  DomainObjectVariant,
} from '@src/domain.objects';

import { isPrimitiveArrayProperty } from './isPrimitiveArrayProperty';

describe('isPrimitiveArrayProperty', () => {
  it('should return true for an array of strings (e.g., string[])', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'tags',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.STRING },
    });
    const isPrimArray = isPrimitiveArrayProperty(property);
    expect(isPrimArray).toEqual(true);
    if (isPrimitiveArrayProperty(property))
      expect(property.of.type).toEqual(DomainObjectPropertyType.STRING); // see how we can just use 'of' here
  });
  it('should return true for an array of numbers (e.g., number[])', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'scores',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.NUMBER },
    });
    expect(isPrimitiveArrayProperty(property)).toEqual(true);
  });
  it('should return true for an array of booleans', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'flags',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.BOOLEAN },
    });
    expect(isPrimitiveArrayProperty(property)).toEqual(true);
  });
  it('should return true for an array of dates', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'occurredAts',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.DATE },
    });
    expect(isPrimitiveArrayProperty(property)).toEqual(true);
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
    expect(isPrimitiveArrayProperty(property)).toEqual(false);
  });
  it('should return false for an array of enums (kept distinct)', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'statuses',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.ENUM, of: ['A', 'B'] },
    });
    expect(isPrimitiveArrayProperty(property)).toEqual(false);
  });
  it('should return false for a non-array primitive property', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'id',
      type: DomainObjectPropertyType.NUMBER,
    });
    expect(isPrimitiveArrayProperty(property)).toEqual(false);
  });
  it('should return false for a nested array (e.g., string[][]) — element is an array, not a primitive', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'grid',
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.ARRAY,
        of: { type: DomainObjectPropertyType.STRING },
      },
    });
    expect(isPrimitiveArrayProperty(property)).toEqual(false);
  });
});
