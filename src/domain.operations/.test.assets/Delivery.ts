import { DomainEntity } from 'domain-objects';

import { Address } from './Address';
import { DeliveryVan } from './DeliveryVan';

interface Package {
  id?: number;
  uuid?: string;
  trackingNumber: string;
  weight: number;
}
class Package extends DomainEntity<Package> implements Package {
  public static unique = ['trackingNumber'];
}

export enum DeliveryStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}
export interface Delivery {
  id?: number;
  uuid?: string;
  van: DeliveryVan;
  destination: Address;
  contactInfo: string[];
  packages: Package[];
  status: DeliveryStatus;
}
export class Delivery extends DomainEntity<Delivery> implements Delivery {
  public static unique = []; // deliveries are not uniquely identified by any of their natural keys
  public static updatable = ['status', 'contactInfo']; // the status and contactInfo of a delivery are updatable
}
