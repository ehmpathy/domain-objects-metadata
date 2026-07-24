import { DomainEntity } from 'domain-objects';

/**
 * .what = a test asset whose array element is an element-level primitive union
 * .why = exercises homogeneous-union support: `(string | null)[]` collapses to a
 *        primitive array of STRING, with the null member filtered out at the element level
 */
export interface PrimitiveNullableUnionArray {
  id: string;
  values: (string | null)[]; // element-level union; collapses to STRING, null filtered out
}
export class PrimitiveNullableUnionArray
  extends DomainEntity<PrimitiveNullableUnionArray>
  implements PrimitiveNullableUnionArray
{
  public static unique = ['id'];
}
