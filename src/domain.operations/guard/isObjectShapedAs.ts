/**
 * .what = a type-guard that a value is a non-null object which holds every named key
 * .why = each domain-object property guard needs the same primitive — "is `of` a real
 *   object with these keys?" — to reject an absent/malformed `of` before a caller narrows
 *   and crashes on `property.of.<key>`. extracted once + reused across all three guards, so
 *   the rigor cannot drift between them. a shape check (not a class `instanceof`) survives
 *   the serialization boundary that introspect() output crosses for downstream codegen.
 */
export const isObjectShapedAs = <TKey extends string>(
  value: unknown,
  keys: readonly TKey[],
): value is Record<TKey, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  keys.every((key) => key in value);
