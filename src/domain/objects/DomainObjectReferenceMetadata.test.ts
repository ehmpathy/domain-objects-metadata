import { DomainObjectVariant } from '../constants';
import { DomainObjectReferenceMetadata } from './DomainObjectReferenceMetadata';

describe('DomainObjectReferenceMetadata', () => {
  it('should be able to instantiate', () => {
    const property = new DomainObjectReferenceMetadata({
      name: 'Rocketship',
      extends: DomainObjectVariant.DOMAIN_ENTITY,
    });
    expect(property.extends).toEqual(DomainObjectVariant.DOMAIN_ENTITY); // sanity check
  });
});
