import { UniDateTime } from '@ehmpathy/uni-time';
import { DomainEvent } from 'domain-objects';

import { Nutrient } from './Nutrient';

export interface NutrientResearchPublicationEvent {
  nutrient: Nutrient;
  authors: string[];
  occurredAt: UniDateTime;
}
export class NutrientResearchPublicationEvent
  extends DomainEvent<NutrientResearchPublicationEvent>
  implements NutrientResearchPublicationEvent
{
  public static unique = ['nutrient', 'exid', 'occurredAt'];
}
