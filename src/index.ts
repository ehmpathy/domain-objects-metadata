export {
  DomainObjectMetadata,
  DomainObjectReferenceMetadata,
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
  DomainObjectVariant,
  isOfDomainObjectVariant,
} from './domain';

export { introspect } from './logic/introspect';

export { isDomainObjectArrayProperty } from './logic/guard/isDomainObjectArrayProperty';
export { isDomainObjectReferenceProperty } from './logic/guard/isDomainObjectReferenceProperty';
