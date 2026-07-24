import { DomainEntity } from 'domain-objects';

export interface SeaShell {
  uuid?: string;
  serialNumber: string;
  color: string;
}
export class SeaShell extends DomainEntity<SeaShell> implements SeaShell {
  public static origin = 'ehmpathy/svc-sea-registry';
  public static primary = ['uuid'] as const;
  public static unique = ['serialNumber'] as const;
  public static updatable = ['color'];
}
