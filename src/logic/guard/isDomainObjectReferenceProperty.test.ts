import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
  DomainObjectReferenceMetadata,
  DomainObjectVariant,
} from '../..';
import { isDomainObjectArrayProperty } from './isDomainObjectArrayProperty';
import { isDomainObjectReferenceProperty } from './isDomainObjectReferenceProperty';

describe('isDomainObjectReferenceProperty', () => {
  it('should be able to allow us to use the of clause of a reference property without type errors', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'geocode',
      type: DomainObjectPropertyType.REFERENCE,
      of: new DomainObjectReferenceMetadata({
        extends: DomainObjectVariant.DOMAIN_VALUE_OBJECT,
        name: 'Geocode',
      }),
    });
    const isAReference = isDomainObjectReferenceProperty(property);
    expect(isAReference).toEqual(true);
    if (isDomainObjectReferenceProperty(property))
      expect(property.of.name).toEqual('Geocode'); // see how we can just use 'of' here
  });
  it('should return false for non references', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'id',
      type: DomainObjectPropertyType.NUMBER,
    });
    const isAReference = isDomainObjectReferenceProperty(property);
    expect(isAReference).toEqual(false);
  });
  it('should allow checking if the ".of" of an array property is a reference property', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'geocode',
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.REFERENCE,
        of: new DomainObjectReferenceMetadata({
          extends: DomainObjectVariant.DOMAIN_VALUE_OBJECT,
          name: 'Geocode',
        }),
      },
    });
    const isAnArrayReference =
      isDomainObjectArrayProperty(property) &&
      isDomainObjectReferenceProperty(property.of);
    expect(isAnArrayReference).toEqual(true);
  });
});
