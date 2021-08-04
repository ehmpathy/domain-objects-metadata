import { DomainObjectPropertyMetadata, DomainObjectPropertyType } from '../..';

export const isDomainObjectArrayProperty = (
  property: DomainObjectPropertyMetadata,
): property is DomainObjectPropertyMetadata & { of: Omit<DomainObjectPropertyMetadata, 'name'> } => property.type === DomainObjectPropertyType.ARRAY;
