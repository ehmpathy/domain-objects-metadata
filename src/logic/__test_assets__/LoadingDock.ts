import { DomainEntity } from 'domain-objects';

export interface LoadingDock {
  id?: number;
  uuid?: string;
  gateNumber: number;
  phoneNumber: string | null;
  operational: boolean;
}
export class LoadingDock extends DomainEntity<LoadingDock> implements LoadingDock {
  public static unique = ['gate'];
  public static updatable = ['operational', 'phoneNumber'];
}
