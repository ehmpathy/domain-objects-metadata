import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import { DomainObjectPropertyType } from './DomainObjectPropertyType';

const schema = z.object({
  name: z.string(),
  primitive: z.nativeEnum(DomainObjectPropertyType),
});

/**
 * .what = metadata for a nominal property — a primitive narrowed by a brand
 * .why =
 *   a "nominal" is a primitive constrained to a distinct subset by a brand,
 *   e.g. `Uuid ⊂ string` or `IsoPrice ⊂ string`. structurally it is still the
 *   base primitive (a text column at the storage boundary), but downstream still
 *   wants to know it was a `Uuid` — so we record BOTH the base primitive and the
 *   brand name. "nominal" is the type-system term: identity by name (a nominal
 *   type), not by structure — faked in typescript via a phantom brand tag.
 *
 *   this is the difference from a bare STRING (forgets the brand) and from a
 *   REFERENCE (points at a domain object that does not exist for a branded
 *   primitive): a nominal is "a string that remembers what it is".
 *
 * .example
 *   ```ts
 *   // property `tagId: Uuid` extracts as
 *   { type: 'NOMINAL', of: { name: 'Uuid', primitive: 'STRING' } }
 *   ```
 */
export interface DomainObjectNominalMetadata {
  /**
   * the brand name — the nominal's identity (e.g. `Uuid`, `IsoPrice`, `IsoTimeStamp`)
   */
  name: string;

  /**
   * the base primitive the brand narrows — the storage type (e.g. `STRING`)
   */
  primitive: DomainObjectPropertyType;
}
export class DomainObjectNominalMetadata
  extends DomainObject<DomainObjectNominalMetadata>
  implements DomainObjectNominalMetadata
{
  public static schema = schema;
}
