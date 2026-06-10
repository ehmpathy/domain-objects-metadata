import { DomainEntity } from 'domain-objects';

export interface Item {
  upc: string;
  price: number;
  colors: string[];
  description: string;
}
export class Item extends DomainEntity<Item> implements Item {
  public static unique = ['upc'];
  public static updatable = ['colors', 'quantity', 'description'];
}
