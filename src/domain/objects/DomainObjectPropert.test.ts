import { DomainObjectProperty, DomainObjectPropertyType } from './DomainObjectProperty';

describe('DomainObjectProperty', () => {
  it('should be able to instantiate', () => {
    const property = new DomainObjectProperty({
      type: DomainObjectPropertyType.STRING,
      required: true,
      nullable: true,
    });
    expect(property.type).toEqual(DomainObjectPropertyType.STRING); // sanity check
  });
});
