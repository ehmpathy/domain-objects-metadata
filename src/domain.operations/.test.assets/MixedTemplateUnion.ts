/**
 * test asset for mixed template literal union types (should throw)
 */
export interface MixedTemplateUnion {
  /**
   * mixed union — template literal (string) and number — should throw
   */
  mixed: `v${number}` | number;
}
