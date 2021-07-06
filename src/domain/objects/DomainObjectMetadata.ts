import { DomainObject } from 'domain-objects';
import { createIsOfEnum } from 'simple-type-guards';

export enum DomainObjectPropertyType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  REFERENCE = 'REFERENCE',
  ENUM = 'ENUM',
}
export interface DomainObjectProperty {
  type: DomainObjectPropertyType;
  of?: DomainObjectProperty | string[] | string; // string[] for enum options, string for unhydrated references
  required?: boolean;
  nullable?: boolean;
}
export class DomainObjectProperty extends DomainObject<DomainObjectProperty> implements DomainObjectProperty {}

export enum DomainObjectVariant {
  DOMAIN_OBJECT = 'DomainObject',
  DOMAIN_VALUE_OBJECT = 'DomainValueObject',
  DOMAIN_ENTITY = 'DomainEntity',
  DOMAIN_EVENT = 'DomainEvent',
}
export const isOfDomainObjectVariant = createIsOfEnum(DomainObjectVariant);

export interface DomainObjectMetadata {
  name: string;
  extends: DomainObjectVariant;
  properties: {
    [index: string]: DomainObjectProperty;
  };
  decorations: {
    unique: string[] | null;
    updatable: string[] | null;
  };
}
export class DomainObjectMetadata extends DomainObject<DomainObjectMetadata> implements DomainObjectMetadata {}
