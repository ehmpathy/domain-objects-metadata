export {
  DomainObjectMetadata,
  DomainObjectNominalMetadata,
  DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
  DomainObjectReferenceMetadata,
  DomainObjectVariant,
  isOfDomainObjectVariant,
} from './domain.objects';
export { isEnumArrayProperty } from './domain.operations/guard/isEnumArrayProperty';
export { isNominalProperty } from './domain.operations/guard/isNominalProperty';
export { isPrimitiveArrayProperty } from './domain.operations/guard/isPrimitiveArrayProperty';
export { isReferenceArrayProperty } from './domain.operations/guard/isReferenceArrayProperty';
export { isReferenceProperty } from './domain.operations/guard/isReferenceProperty';
export { introspect } from './domain.operations/introspect';
