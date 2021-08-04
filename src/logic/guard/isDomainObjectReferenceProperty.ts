import { DomainObjectPropertyMetadata, DomainObjectReferenceMetadata, DomainObjectPropertyType } from '../..';

export const isDomainObjectReferenceProperty = (
  property: DomainObjectPropertyMetadata | Omit<DomainObjectPropertyMetadata, 'name'>,
): property is DomainObjectPropertyMetadata & { of: DomainObjectReferenceMetadata } => property.type === DomainObjectPropertyType.REFERENCE;
