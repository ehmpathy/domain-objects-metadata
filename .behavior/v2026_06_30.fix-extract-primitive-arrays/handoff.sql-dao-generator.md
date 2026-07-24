# handoff: sql-dao-generator — consume primitive-array + enum-array classification

## repo

ehmpathy/sql-dao-generator

## parent

- upstream metadata task: ehmpathy/domain-objects-metadata#24 (this behavior)
- grandparent handoff: ehmpathy/domain-objects-metadata#19 (item 5)

## context

`domain-objects-metadata` is adding classification so consumers can tell three kinds of
array apart. today `sql-dao-generator` rejects `string[]` / `number[]` because the old
guard `isDomainObjectArrayProperty` matched **every** array, so a primitive array fell into
the domain-object-array branch and threw `UserInputError`.

that forced consumers to downgrade domain types:

```ts
tags: string; // todo: revert to string[] once metadata supports primitive arrays
```

## what changed upstream (domain-objects-metadata)

once the upstream task ships, the metadata contract is:

1. **`isDomainObjectArrayProperty` is RENAMED + NARROWED → `isReferenceArrayProperty`** — it
   now returns `true` **only** when the array element is a domain-object reference
   (`property.type === ARRAY && element of.type === REFERENCE`). ⚠️ **two breaks in one
   release**: the export name changes (update your import), AND it no longer returns `true`
   for `string[]`, `number[]`, or `enum[]`. (covers both nested `Item[]` and by-uuid
   `Ref<typeof Item>[]` — extraction collapses both to `REFERENCE`.)
2. **`isPrimitiveArrayProperty` is ADDED** — returns `true` for arrays whose element is a
   primitive (`STRING | NUMBER | BOOLEAN | DATE`). excludes ENUM.
3. **`isEnumArrayProperty` is ADDED** — returns `true` for arrays whose element is an enum
   (`of.type === ENUM`). enum arrays stay distinct from primitive and reference arrays, so
   you can emit a native `enum[]` column. use this guard rather than an inline check.

all guards operate on **hydrated** metadata (what `introspect` returns).

## what

update `sql-dao-generator` to branch on the three array kinds instead of a throw.

## where

- `src/domain.operations/define/sqlSchemaGenerator/defineSqlSchemaGeneratorCodeForProperty.ts`
  — the `isDomainObjectArrayProperty(domainObjectProperty)` branch (currently ~line 33)
  throws `UserInputError` for any array that is not a domain-object reference and not a
  `_uuids`-suffixed string array. this is the primary site.
- **first, update the import**: `isDomainObjectArrayProperty` no longer exists — swap every
  import to `isReferenceArrayProperty`. audit all callsites, since the renamed guard also
  changes behavior for primitive/enum arrays:
  - `src/domain.operations/define/databaseAccessObjects/defineDaoFindByMethodCodeForDomainObject.ts`
  - `src/domain.operations/define/databaseAccessObjects/defineDaoUtilCastMethodCodeForDomainObject.ts`
  - `src/domain.operations/define/sqlSchemaRelationship/defineSqlSchemaReferenceForDomainObjectProperty.ts`
  - `src/domain.operations/define/sqlSchemaRelationship/isADirectlyNestedDomainObjectProperty.ts`

## expected

in `defineSqlSchemaGeneratorCodeForProperty`, branch (illustrative):

```ts
// reference arrays → relation / foreign keys (prior behavior, now via renamed guard)
if (isReferenceArrayProperty(domainObjectProperty)) { /* prior relation logic */ }

// enum arrays → native enum[] column
if (isEnumArrayProperty(domainObjectProperty)) {
  return `prop.ARRAY_OF(prop.ENUM([...]))`; // consumer decides exact emission
}

// primitive arrays → json/text column
if (isPrimitiveArrayProperty(domainObjectProperty)) {
  return 'prop.JSON()'; // or TEXT — consumer's call on column type
}

// ⚠️ fail loud on an array that hydrates but fits none of the three guards.
// a nested array (string[][]) hydrates fine yet returns `false` from all three
// guards; do NOT let it fall through silently (that drops the column) — throw instead.
if (domainObjectProperty.type === DomainObjectPropertyType.ARRAY) {
  throw new UserInputError('unclassified array element kind', {
    property: domainObjectProperty,
  });
}
```

- `string[]`, `number[]`, `boolean[]`, `Date[]` → json/text column
- `Status[]` (enum) → native `enum[]` column
- `Item[]` / `Ref<typeof Item>[]` (domain-object refs) → relation (unchanged)
- a nested array (`string[][]`) hydrates but returns `false` from all three guards → fail
  loud at this branch, never a silent no-op
- keep the `_uuids`-suffix special case intact (currently emits `prop.ARRAY_OF(prop.UUID())`)

> ⚠️ note on unsupported shapes — these throw INSIDE `introspect()`, before your guard-branch
> code ever runs, so you never receive metadata for them (they are prior extraction/hydration
> limitations of `domain-objects-metadata`, not a guard-classification result):
> - `(string | null)[]` — element-level primitive union → throws in extraction
> - `Variant[]` where `type Variant = 'A' | 'B'` — named literal-union alias → throws in hydration
>
> so the fail-loud branch above handles only shapes that DO hydrate but fit no guard
> (e.g. `string[][]`); the two shapes above surface as an `introspect()`-level throw instead —
> the guards never see them. (verified by regression tests in `introspect.test.ts`.)

## acceptance

- bump `domain-objects-metadata` to the version that ships `isReferenceArrayProperty` +
  `isPrimitiveArrayProperty` + `isEnumArrayProperty`.
- swap all `isDomainObjectArrayProperty` imports → `isReferenceArrayProperty` (old name is
  gone).
- a fixture domain object with `tags: string[]` and `scores: number[]` generates a DAO with
  json/text columns (no `UserInputError`).
- a fixture with an `enum[]` prop generates a native `enum[]` column (NOT json/text).
- reference-array props (`Item[]`) still generate relations — no regression.
- the renamed `isReferenceArrayProperty` does not break the other four callsites above.

## verification

```sh
# in a consumer service that generates DAOs:
<consumer> npm run generate:dao:postgres
```

should generate DAOs from the precise domain types with no `// todo: revert` downgrades.

## out of scope (owned upstream)

- extraction of primitive arrays — already works in `domain-objects-metadata`.
- the guard definitions themselves — delivered by ehmpathy/domain-objects-metadata#24.

## see also

- upstream contract: ehmpathy/domain-objects-metadata#24
- upstream vision: `.behavior/v2026_06_30.fix-extract-primitive-arrays/1.vision.yield.md`
