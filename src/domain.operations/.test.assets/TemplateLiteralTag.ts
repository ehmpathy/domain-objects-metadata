/**
 * test asset for template literal types
 */
export interface TemplateLiteralTag {
  /**
   * required template literal — should extract as STRING
   */
  version: `v${number}.${number}.${number}`;

  /**
   * nullable template literal — should extract as STRING, nullable
   */
  slug: `${string}-${string}` | null;

  /**
   * optional template literal — should extract as STRING, optional
   */
  label?: `tag:${string}`;
}
