import {
  type DomainObjectNominalMetadata,
  type DomainObjectPropertyMetadata,
  DomainObjectPropertyType,
} from '@src/domain.objects';

import { isObjectShapedAs } from './isObjectShapedAs';

export const isNominalProperty = (
  property:
    | DomainObjectPropertyMetadata
    | Omit<DomainObjectPropertyMetadata, 'name'>,
): property is DomainObjectPropertyMetadata & {
  of: DomainObjectNominalMetadata;
} =>
  property.type === DomainObjectPropertyType.NOMINAL &&
  // `of` must be present + carry the brand shape. a shape check (vs class `instanceof`)
  // survives serialization boundaries — introspect() output is built for downstream codegen,
  // so a deserialized `of` is a plain { name, primitive } object, not a class instance.
  isObjectShapedAs(property.of, ['name', 'primitive']);
