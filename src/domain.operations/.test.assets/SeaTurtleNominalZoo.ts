/**
 * test asset: a divergent seaturtle-themed "zoo" of branded nominals.
 *
 * each interface is a distinct sea-world entity whose branded field exercises
 * one recognized nominal. together they exhaustively cover every entry in the
 * known-nominal registry, plus the required / optional / nullable / array flags.
 */
import { Hash } from 'hash-fns';
import {
  IsoDateStamp,
  IsoDateStampRange,
  IsoDayFloat,
  IsoDuration,
  IsoDurationShape,
  IsoDurationWords,
  IsoHourFloat,
  IsoMinuteFloat,
  IsoMonthFloat,
  IsoMonthStamp,
  IsoTimeFloat,
  IsoTimeStamp,
  IsoTimeStampRange,
  IsoWeekdayFloat,
  IsoYearStamp,
} from 'iso-time';
import { IsoPrice, IsoPriceHuman, IsoPriceShape, IsoPriceWords } from 'iso-price';
import { Serializable } from 'serde-fns';
import { Uuid } from 'uuid-fns';

// serde-fns — raw json blob streamed from a satellite tracker
export interface SeaTurtleTelemetry {
  payload: Serializable;
}

// uuid-fns — the tag's globally-unique id
export interface SeaTurtleTag {
  tagId: Uuid;
}

// hash-fns — perceptual hash of a shell's scute pattern (optional: not always computed)
export interface ShellScuteScan {
  patternHash?: Hash;
}

// iso-price — amount billed for a volunteer reef cleanup (nullable: not yet finalized)
export interface ReefCleanupInvoice {
  laborCost: IsoPrice | null;
}

// iso-price words form — 'USD 12.50' offer for a kelp bundle
export interface KelpMarketOffer {
  askPrice: IsoPriceWords;
}

// iso-price human form — '$9.99' on a turtle plushie
export interface GiftShopPlushie {
  priceTag: IsoPriceHuman;
}

// iso-time stamp — the exact instant a turtle was observed
export interface TurtleSpotEvent {
  observedAt: IsoTimeStamp;
}

// iso-time date stamp — the day a clutch hatched
export interface HatchEvent {
  hatchedOn: IsoDateStamp;
}

// iso-time month stamp — the month of peak migration
export interface MigrationSeason {
  peakMonth: IsoMonthStamp;
}

// iso-time year stamp — the year a turtle was first tagged
export interface TagRecord {
  taggedYear: IsoYearStamp;
}

// iso-time time float — the time-of-day a turtle surfaced for air
export interface SurfaceBreath {
  breathedAt: IsoTimeFloat;
}

// iso-time hour float — the hour-of-day a feed window opens
export interface FeedWindow {
  opensAtHour: IsoHourFloat;
}

// iso-time minute float — the minute-of-hour a breach was detected
export interface BreachAlert {
  detectedMinute: IsoMinuteFloat;
}

// iso-time month float — the fractional month of a bloom peak
export interface AlgaeBloom {
  peakMonthFloat: IsoMonthFloat;
}

// iso-time day float — the day-of-month tied to a lunar cycle
export interface LunarForage {
  dayOfMonth: IsoDayFloat;
}

// iso-time weekday float — the weekday a beach patrol runs
export interface PatrolShift {
  weekday: IsoWeekdayFloat;
}

// iso-time duration — how long a dive lasted; buddyTagIds proves array-of-ALIAS
export interface DiveLog {
  diveDuration: IsoDuration;
  buddyTagIds: Uuid[];
}

// iso-time duration words — 'PT30M' rest between dives
export interface RestInterval {
  restSpan: IsoDurationWords;
}

// ---
// deliberately out of scope: object-shaped types stay REFERENCE (they model
// structure, not one branded value). these lock the in-scope/out-of-scope boundary.
// ---

// iso-price object shape — { amount, currency } stays REFERENCE
export interface ReefCleanupQuote {
  priceShape: IsoPriceShape;
}

// iso-time timestamp range — { since, until } stays REFERENCE
export interface DiveSession {
  window: IsoTimeStampRange;
}

// iso-time date range — { since, until } stays REFERENCE
export interface ClutchWatch {
  span: IsoDateStampRange;
}

// iso-time duration object shape — structured duration stays REFERENCE
export interface FastCurrentDrift {
  durationShape: IsoDurationShape;
}
