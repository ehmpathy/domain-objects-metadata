import { DomainEntity } from 'domain-objects';

export interface SeaTurtle {
  seawaterSecurityNumber: string;
  name: string;
}
export class SeaTurtle extends DomainEntity<SeaTurtle> implements SeaTurtle {
  public static unique = ['seawaterSecurityNumber'] as const;
  public static updatable = ['name'];
}
