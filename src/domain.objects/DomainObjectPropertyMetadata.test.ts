import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from './DomainObjectPropertyMetadata';

describe('DomainObjectPropertyMetadata', () => {
  it('should be able to instantiate', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'cool prop',
      type: DomainObjectPropertyType.STRING,
      required: true,
      nullable: true,
    });
    expect(property.type).toEqual(DomainObjectPropertyType.STRING); // sanity check
  });
  it('should accept an ALIAS property whose "of" carries a valid brand', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'tagId',
      type: DomainObjectPropertyType.NOMINAL,
      of: { name: 'Uuid', primitive: DomainObjectPropertyType.STRING },
    });
    expect(property.type).toEqual(DomainObjectPropertyType.NOMINAL); // sanity check
    expect(property.of).toEqual({
      name: 'Uuid',
      primitive: DomainObjectPropertyType.STRING,
    }); // the brand + primitive are preserved on the property
  });
});
