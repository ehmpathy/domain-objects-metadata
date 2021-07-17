import { DomainObjectMetadata } from '.';
import { DomainObjectVariant } from '../constants';
import { DomainObjectPropertyMetadata, DomainObjectPropertyType } from './DomainObjectPropertyMetadata';

describe('DomainObjectReferenceMetadata', () => {
  it('should be able to instantiate', () => {
    const property = new DomainObjectMetadata({
      name: 'Rocketship',
      extends: DomainObjectVariant.DOMAIN_ENTITY,
      properties: {
        id: new DomainObjectPropertyMetadata({
          name: 'id',
          type: DomainObjectPropertyType.NUMBER,
          nullable: false,
          required: false,
        }),
        uuid: new DomainObjectPropertyMetadata({
          name: 'uuid',
          type: DomainObjectPropertyType.STRING,
          nullable: false,
          required: false,
        }),
        serialNumber: new DomainObjectPropertyMetadata({
          name: 'serialNumber',
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
