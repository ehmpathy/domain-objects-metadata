import { DomainEntity } from 'domain-objects';

export interface SeaTurtle {
  uuid?: string;
  seawaterSecurityNumber: string;
  name: string;
}
export class SeaTurtle extends DomainEntity<SeaTurtle> implements SeaTurtle {
  public static primary = ['uuid'] as const;
  public static unique = ['seawaterSecurityNumber'] as const;
  public static updatable = ['name'];
}
