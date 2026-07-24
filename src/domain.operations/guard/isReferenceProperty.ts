import {
  type DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
  type DomainObjectReferenceMetadata,
} from '@src/domain.objects';

export const isReferenceProperty = (
  property:
    | DomainObjectPropertyMetadata
    | Omit<DomainObjectPropertyMetadata, 'name'>,
): property is DomainObjectPropertyMetadata & {
  of: DomainObjectReferenceMetadata;
} => property.type === DomainObjectPropertyType.REFERENCE;
