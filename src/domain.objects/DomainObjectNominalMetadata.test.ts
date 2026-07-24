import { DomainObjectNominalMetadata } from './DomainObjectNominalMetadata';
import { DomainObjectPropertyType } from './DomainObjectPropertyType';

describe('DomainObjectNominalMetadata', () => {
  it('should be able to instantiate', () => {
    const nominal = new DomainObjectNominalMetadata({
      name: 'Uuid',
      primitive: DomainObjectPropertyType.STRING,
    });
    expect(nominal.name).toEqual('Uuid'); // sanity check
    expect(nominal.primitive).toEqual(DomainObjectPropertyType.STRING); // sanity check
  });
});
