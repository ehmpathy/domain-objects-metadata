import {
  DomainObjectNominalMetadata,
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '@src/domain.objects';

import { getArrayElementProperty } from './getArrayElementProperty';
import { isNominalProperty } from './isNominalProperty';

describe('isNominalProperty', () => {
  it('should be able to allow us to use the of clause of a nominal property without type errors', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'tagId',
      type: DomainObjectPropertyType.NOMINAL,
      of: new DomainObjectNominalMetadata({
        name: 'Uuid',
        primitive: DomainObjectPropertyType.STRING,
      }),
    });
    const isANominal = isNominalProperty(property);
    expect(isANominal).toEqual(true);
    if (isNominalProperty(property)) {
      expect(property.of.name).toEqual('Uuid'); // see how we can just use 'of' here
      expect(property.of.primitive).toEqual(DomainObjectPropertyType.STRING);
    }
  });
  it('should return false for non nominals', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'id',
      type: DomainObjectPropertyType.NUMBER,
    });
    const isANominal = isNominalProperty(property);
    expect(isANominal).toEqual(false);
  });
  it('should return false for a NOMINAL-typed property whose "of" is absent (no false confidence)', () => {
    // a hand-built / deserialized object whose `of` was never set — the guard must
    // still reject it safely, since it cannot narrow `.of` to a brand that is not there
    const property = new DomainObjectPropertyMetadata({
      name: 'tagId',
      type: DomainObjectPropertyType.NOMINAL,
    });
    const isANominal = isNominalProperty(property);
    expect(isANominal).toEqual(false); // guard must not narrow `.of` when `of` was never set
  });
  it('should return true for a deserialized nominal whose "of" is a plain object (survives serialization)', () => {
    // introspect() output is built for downstream codegen; across a json boundary the `of`
    // instance becomes a plain { name, primitive } object. the guard must still narrow it.
    const property = new DomainObjectPropertyMetadata(
      JSON.parse(
        JSON.stringify({
          name: 'tagId',
          type: DomainObjectPropertyType.NOMINAL,
          of: { name: 'Uuid', primitive: DomainObjectPropertyType.STRING },
        }),
      ),
    );
    const isANominal = isNominalProperty(property);
    expect(isANominal).toEqual(true);
    if (isNominalProperty(property))
      expect(property.of.name).toEqual('Uuid');
  });
  it('should allow a narrow of the ".of" of an array property to a nominal property', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'buddyTagIds',
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.NOMINAL,
        of: new DomainObjectNominalMetadata({
          name: 'Uuid',
          primitive: DomainObjectPropertyType.STRING,
        }),
      },
    });
    const element = getArrayElementProperty(property);
    const isANominalArray = !!element && isNominalProperty(element);
    expect(isANominalArray).toEqual(true);
  });
});
