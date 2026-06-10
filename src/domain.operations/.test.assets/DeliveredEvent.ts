import { DomainEvent } from 'domain-objects';

export interface DeliveredEvent {
  id?: number;
  uuid?: string;
  packageUuid: string;
  occurredAt: Date;
}
export class DeliveredEvent
  extends DomainEvent<DeliveredEvent>
  implements DeliveredEvent
{
  public static unique = ['packageUuid'];
}
