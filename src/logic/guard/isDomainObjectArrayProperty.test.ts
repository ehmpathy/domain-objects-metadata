import { DomainObjectPropertyMetadata, DomainObjectPropertyType } from '../..';
import { isDomainObjectArrayProperty } from './isDomainObjectArrayProperty';

describe('isDomainObjectArrayProperty', () => {
  it('should be able to allow us to use the of clause of an array property without type errors', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'geocode',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.NUMBER },
    });
    const isAnArray = isDomainObjectArrayProperty(property);
    expect(isAnArray).toEqual(true);
    if (isDomainObjectArrayProperty(property)) expect(property.of.type).toEqual(DomainObjectPropertyType.NUMBER); // see how we can just use 'of' here
  });
  it('should return false for non arrays', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'id',
      type: DomainObjectPropertyType.NUMBER,
    });
    const isAnArray = isDomainObjectArrayProperty(property);
    expect(isAnArray).toEqual(false);
  });
});
