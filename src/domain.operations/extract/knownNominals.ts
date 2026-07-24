import { DomainObjectPropertyType } from '@src/domain.objects';

/**
 * .what = registry of known branded nominal types and their base primitive types
 * .why = lets the extractor recognize branded nominals (Uuid, IsoPrice, iso-time, ...)
 *        and record both the brand name and the storage primitive, instead of a bare
 *        REFERENCE to a type that has no domain object
 * .note = a nominal is a primitive narrowed by a brand (e.g. Uuid ⊂ string) — a nominal type
 *         faked via a phantom tag; we keep both the base primitive and the brand name
 * .note = every primitive is STRING today; the shape leaves room for future non-string brands
 * .note = match is name-based, so any unrelated type that reuses a registry name (e.g. a local
 *         `type Hash = ...`) is also treated as the branded nominal. accepted collision risk,
 *         consistent with the extant `Date` / `Ref` precedent — keep names here specific.
 */
export const knownNominals: {
  name: string;
  primitive: DomainObjectPropertyType;
}[] = [
  // serde-fns
  { name: 'Serializable', primitive: DomainObjectPropertyType.STRING },
  // uuid-fns
  { name: 'Uuid', primitive: DomainObjectPropertyType.STRING },
  // hash-fns
  { name: 'Hash', primitive: DomainObjectPropertyType.STRING },
  // iso-price (words + human string forms; IsoPriceShape object stays REFERENCE)
  { name: 'IsoPrice', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoPriceWords', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoPriceHuman', primitive: DomainObjectPropertyType.STRING },
  // iso-time — stamps
  { name: 'IsoTimeStamp', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoDateStamp', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoMonthStamp', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoYearStamp', primitive: DomainObjectPropertyType.STRING },
  // iso-time — floats
  { name: 'IsoTimeFloat', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoHourFloat', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoMinuteFloat', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoMonthFloat', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoDayFloat', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoWeekdayFloat', primitive: DomainObjectPropertyType.STRING },
  // iso-time — durations (words form; IsoDurationShape object stays REFERENCE)
  { name: 'IsoDuration', primitive: DomainObjectPropertyType.STRING },
  { name: 'IsoDurationWords', primitive: DomainObjectPropertyType.STRING },
];
