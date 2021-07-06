import { DomainValueObject } from 'domain-objects';

export interface Address {
  street: string;
  suite: string | null;
  city: string;
  state: string;
  postal: string;
}
export class Address extends DomainValueObject<Address> implements Address {}
