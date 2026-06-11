/**
 * test asset for mixed literal union types (should throw)
 */
export interface MixedLiteralUnion {
  /**
   * mixed literal union — string and number — should throw
   */
  mixed: 'active' | 1;
}
