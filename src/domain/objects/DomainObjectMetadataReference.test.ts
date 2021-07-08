import { DomainObjectVariant } from '../constants';
import { DomainObjectMetadataReference } from './DomainObjectMetadataReference';

describe('DomainObjectMetadataReference', () => {
  it('should be able to instantiate', () => {
    const property = new DomainObjectMetadataReference({
      name: 'Rocketship',
      extends: DomainObjectVariant.DOMAIN_ENTITY,
    });
    expect(property.extends).toEqual(DomainObjectVariant.DOMAIN_ENTITY); // sanity check
  });
});
