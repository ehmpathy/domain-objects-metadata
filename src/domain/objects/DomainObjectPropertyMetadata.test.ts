import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from './DomainObjectPropertyMetadata';

describe('DomainObjectPropertyMetadata', () => {
  it('should be able to instantiate', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'cool thing',
      type: DomainObjectPropertyType.STRING,
      required: true,
      nullable: true,
    });
    expect(property.type).toEqual(DomainObjectPropertyType.STRING); // sanity check
  });
});
