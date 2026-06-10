import { DomainEntity } from 'domain-objects';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}
export interface Payment {
  externalId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}
export class Payment extends DomainEntity<Payment> implements Payment {
  public static unique = ['externalId'];
  public static updatable = ['status', 'amount', 'currency'];
}
