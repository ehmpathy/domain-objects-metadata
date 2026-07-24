import { DomainEvent } from 'domain-objects';
import { IsoTimeStamp } from 'iso-time';

import { Nutrient } from './Nutrient';

export interface NutrientResearchPublicationEvent {
  nutrient: Nutrient;
  authors: string[];
  occurredAt: IsoTimeStamp;
}
export class NutrientResearchPublicationEvent
  extends DomainEvent<NutrientResearchPublicationEvent>
  implements NutrientResearchPublicationEvent
{
  public static unique = ['nutrient', 'exid', 'occurredAt'];
}
