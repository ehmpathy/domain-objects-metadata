import { DomainEntity, Ref } from 'domain-objects';
import { Literalize } from 'type-fns';

import { SeaTurtle } from './SeaTurtle';

export enum SeaGuideRank {
  SAND_SCOUT = 'SAND_SCOUT',
  KELP_KEEPER = 'KELP_KEEPER',
  WAVE_WHISPERER = 'WAVE_WHISPERER',
  OCEAN_ORACLE = 'OCEAN_ORACLE',
}
export interface SeaGuide {
  uuid?: string;
  turtle: Ref<typeof SeaTurtle>;
  rank: Literalize<SeaGuideRank>;
}
export class SeaGuide extends DomainEntity<SeaGuide> implements SeaGuide {
  public static primary = ['uuid'] as const;
  public static unique = ['turtle'] as const;
  public static updatable = ['name'];
}
