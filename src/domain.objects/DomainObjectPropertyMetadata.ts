import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import type { DomainObjectNominalMetadata } from './DomainObjectNominalMetadata';
import { DomainObjectPropertyType } from './DomainObjectPropertyType';
import type { DomainObjectReferenceMetadata } from './DomainObjectReferenceMetadata';

export { DomainObjectPropertyType } from './DomainObjectPropertyType';

const schema = z.object({
  name: z.string().optional(), // may be omitted, if used in "of" // todo: create a separate type for this
  type: z.nativeEnum(DomainObjectPropertyType),
  // the shape of `of` varies by `type`; every variant (reference/enum/array/nominal/pre-hydration string) shares this one `z.any()`.
  // it is defended by the compile-time union below + the `isDomainObject*Property` runtime guards.
  // note: a per-type `superRefine` cannot fail loud at construction here — domain-objects@0.31.13 detects a zod schema via the
  // v3 `_refinement` internal, but this repo runs zod v4 (no `_refinement`), so NO dobj schema validates on `new` (proven empirically).
  // a `superRefine` would be inert dead code (a failhide). see the yield close-out for the follow-up ticket.
  of: z.any().optional(),
  required: z.boolean().optional(),
  nullable: z.boolean().optional(),
});

export interface DomainObjectPropertyMetadata {
  name: string;
  type: DomainObjectPropertyType;
  of?:
    | DomainObjectReferenceMetadata // if it refs another domain object
    | Omit<DomainObjectPropertyMetadata, 'name'> // if its an array, this holds the type of objects in the array
    | string[] // if its an enum, this holds the options of the enum
    | DomainObjectNominalMetadata // if its a nominal, this holds the brand name + base primitive type (e.g., { name: 'Uuid', primitive: STRING })
    | string; // before hydration, this holds the name of the referenced type for references
  required?: boolean;
  nullable?: boolean;
}
export class DomainObjectPropertyMetadata
  extends DomainObject<DomainObjectPropertyMetadata>
  implements DomainObjectPropertyMetadata
{
  public static schema = schema;
}
