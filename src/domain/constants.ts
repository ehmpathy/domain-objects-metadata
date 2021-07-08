import { createIsOfEnum } from 'simple-type-guards';

export enum DomainObjectVariant {
  DOMAIN_OBJECT = 'DomainObject',
  DOMAIN_VALUE_OBJECT = 'DomainValueObject',
  DOMAIN_ENTITY = 'DomainEntity',
  DOMAIN_EVENT = 'DomainEvent',
}
export const isOfDomainObjectVariant = createIsOfEnum(DomainObjectVariant);
