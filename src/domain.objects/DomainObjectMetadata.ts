import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import { DomainObjectVariant } from './constants';
import { DomainObjectPropertyMetadata } from './DomainObjectPropertyMetadata';

const schema = z.object({
  name: z.string(),
  extends: z.nativeEnum(DomainObjectVariant),
  properties: z.record(z.string(), DomainObjectPropertyMetadata.schema),
  decorations: z.object({
    alias: z.string().nullable(),
    primary: z.array(z.string()).nullable(),
    unique: z.array(z.string()).nullable(),
    updatable: z.array(z.string()).nullable(),
  }),
});

export interface DomainObjectMetadata {
  name: string;
  extends: DomainObjectVariant;
  properties: {
    [index: string]: DomainObjectPropertyMetadata;
  };
  decorations: {
    alias: string | null;
    primary: string[] | null;
    unique: string[] | null;
    updatable: string[] | null;
  };
}
export class DomainObjectMetadata
  extends DomainObject<DomainObjectMetadata>
  implements DomainObjectMetadata
{
  public static schema = schema;
}
