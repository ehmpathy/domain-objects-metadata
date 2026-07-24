import { DomainEntity } from 'domain-objects';

type Variant = 'A' | 'B'; // named string-literal-union alias

/**
 * .what = a test asset whose array element is a named string-literal-union alias
 * .why = documents a prior hydration limitation: `Variant[]` is NOT expanded to a primitive —
 *        hydration throws because the alias is treated as a reference to a type that is
 *        neither a domain object nor an enum
 */
export interface NamedAliasArray {
  id: string;
  variants: Variant[]; // named-alias array; hydration does not expand this to a primitive
}
export class NamedAliasArray
  extends DomainEntity<NamedAliasArray>
  implements NamedAliasArray
{
  public static unique = ['id'];
}
