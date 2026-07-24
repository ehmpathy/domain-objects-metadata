import { DomainEntity } from 'domain-objects';

/**
 * .what = a test asset whose array element is an element-level primitive union
 * .why = documents a prior extraction limitation: `(string | null)[]` is NOT supported —
 *        extraction throws, distinct from the supported outer-level `string[] | null`
 */
export interface PrimitiveNullableUnionArray {
  id: string;
  values: (string | null)[]; // element-level union; extraction does not support this
}
export class PrimitiveNullableUnionArray
  extends DomainEntity<PrimitiveNullableUnionArray>
  implements PrimitiveNullableUnionArray
{
  public static unique = ['id'];
}
