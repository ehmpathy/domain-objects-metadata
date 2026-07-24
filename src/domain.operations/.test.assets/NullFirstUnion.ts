/**
 * test asset for unions where `null` is written before the primary type
 */
export interface NullFirstUnion {
  /**
   * null written before a Date reference — should extract as DATE, nullable
   */
  scheduledAt: null | Date;
}
