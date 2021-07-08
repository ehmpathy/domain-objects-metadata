import { DomainObjectMetadata } from '.';
import { DomainObjectVariant } from '../constants';
import { DomainObjectProperty, DomainObjectPropertyType } from './DomainObjectProperty';

describe('DomainObjectMetadataReference', () => {
  it('should be able to instantiate', () => {
    const property = new DomainObjectMetadata({
      name: 'Rocketship',
      extends: DomainObjectVariant.DOMAIN_ENTITY,
      properties: {
        id: new DomainObjectProperty({
          type: DomainObjectPropertyType.NUMBER,
          nullable: false,
          required: false,
        }),
        uuid: new DomainObjectProperty({
          type: DomainObjectPropertyType.STRING,
          nullable: false,
          required: false,
        }),
        serialNumber: new DomainObjectProperty({
          type: DomainObjectPropertyType.STRING,
          nullable: false,
          required: true,
        }),
      },
      decorations: {
        unique: ['serialNumber'],
        updatable: null,
      },
    });
    expect(property.extends).toEqual(DomainObjectVariant.DOMAIN_ENTITY); // sanity check
  });
});
