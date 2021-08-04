import { DomainObjectPropertyMetadata, DomainObjectReferenceMetadata, DomainObjectPropertyType } from '../..';

export const isDomainObjectReferenceProperty = (
  property: DomainObjectPropertyMetadata,
): property is DomainObjectPropertyMetadata & { of: DomainObjectReferenceMetadata } => property.type === DomainObjectPropertyType.REFERENCE;
