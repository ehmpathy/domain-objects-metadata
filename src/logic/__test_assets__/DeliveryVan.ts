import { DomainEntity } from 'domain-objects';

export interface DeliveryVan {
  id?: number;
  uuid?: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  milage: number;
}
export class DeliveryVan extends DomainEntity<DeliveryVan> implements DeliveryVan {
  public static unique = ['vin']; // vans are uniquely identified by their vin
  public static updatable = ['milage']; // the milage on vans is updated at the end of each delivery day
}
