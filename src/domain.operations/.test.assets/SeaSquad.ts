import { DomainEntity, Ref } from 'domain-objects';

import { SeaTurtle } from './SeaTurtle';

/**
 * .what = a squad of sea turtles, referenced by uuid
 * .why = a natural array-of-references usecase; `members: Ref<typeof SeaTurtle>[]`
 *        collapses to a REFERENCE array on extraction, classified identically to
 *        a nested domain-object array
 */
export interface SeaSquad {
  uuid?: string;
  name: string;
  members: Ref<typeof SeaTurtle>[];
}
export class SeaSquad
  extends DomainEntity<SeaSquad>
  implements SeaSquad
{
  public static primary = ['uuid'] as const;
  public static unique = ['name'] as const;
}
