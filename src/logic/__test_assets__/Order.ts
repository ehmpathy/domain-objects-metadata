import { DomainEntity } from 'domain-objects';

import { Address } from './Address';
import { Item } from './Item';

export interface Order {
  id?: number;
  uuid?: string;
  destination: Address;
  items: Item[];
  status: string;
}
export class Order extends DomainEntity<Order> implements Order {
  public static unique = [];
  public static updatable = [];
}
