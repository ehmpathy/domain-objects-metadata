import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import { DomainObjectVariant } from './constants';

const schema = z.object({
  name: z.string(),
  extends: z.nativeEnum(DomainObjectVariant),
});

export interface DomainObjectReferenceMetadata {
  name: string;
  extends: DomainObjectVariant;
}
export class DomainObjectReferenceMetadata
  extends DomainObject<DomainObjectReferenceMetadata>
  implements DomainObjectReferenceMetadata
{
  public static schema = schema;
}
