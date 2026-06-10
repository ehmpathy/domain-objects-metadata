import {
  type DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '@src/domain.objects';

export const isDomainObjectArrayProperty = (
  property: DomainObjectPropertyMetadata,
): property is DomainObjectPropertyMetadata & {
  of: Omit<DomainObjectPropertyMetadata, 'name'>;
} => property.type === DomainObjectPropertyType.ARRAY;
