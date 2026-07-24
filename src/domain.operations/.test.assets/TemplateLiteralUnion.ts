/**
 * test asset for template literal types combined in unions
 */
export interface TemplateLiteralUnion {
  /**
   * template literal unioned with a string literal — should extract as STRING
   */
  version: `v${number}.${number}.${number}` | 'latest';

  /**
   * nullable template literal union — should extract as STRING, nullable
   */
  tag: `v${number}` | 'latest' | null;

  /**
   * array of template literal — should extract as ARRAY of STRING
   */
  history: `v${number}`[];
}
