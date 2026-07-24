import {
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
  DomainObjectVariant,
} from '@src/domain.objects';

import { getArrayElementProperty } from './getArrayElementProperty';

describe('getArrayElementProperty', () => {
  it('should return the element descriptor for an array property', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'tags',
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.STRING },
    });
    const element = getArrayElementProperty(property);
    expect(element?.type).toEqual(DomainObjectPropertyType.STRING);
  });
  it('should return null for a non-array property', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'id',
      type: DomainObjectPropertyType.STRING,
    });
    expect(getArrayElementProperty(property)).toEqual(null);
  });
  it('should return null when the array element `of` is a bare string (e.g., pre-hydration reference name)', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'refs',
      type: DomainObjectPropertyType.ARRAY,
      of: 'SomeUnhydratedType',
    });
    expect(getArrayElementProperty(property)).toEqual(null);
  });
  it('should return null when the array element `of` is itself an array (malformed element descriptor)', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'weird',
      type: DomainObjectPropertyType.ARRAY,
      of: ['A', 'B'],
    });
    expect(getArrayElementProperty(property)).toEqual(null);
  });
  it('should return null when an array property has no `of` element descriptor at all', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'bare',
      type: DomainObjectPropertyType.ARRAY,
    });
    expect(getArrayElementProperty(property)).toEqual(null);
  });
  it('should return null when the array element `of` is an object without a `type` key (e.g., a bare reference descriptor)', () => {
    const property = new DomainObjectPropertyMetadata({
      name: 'refless',
      type: DomainObjectPropertyType.ARRAY,
      of: { name: 'SeaTurtle', extends: DomainObjectVariant.DOMAIN_ENTITY },
    });
    expect(getArrayElementProperty(property)).toEqual(null);
  });
});
