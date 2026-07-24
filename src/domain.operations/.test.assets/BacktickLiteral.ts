/**
 * test asset for non-interpolated backtick (template) literal types
 */
export interface BacktickLiteral {
  /**
   * non-interpolated backtick literal — should extract as STRING
   */
  status: `draft`;

  /**
   * union of non-interpolated backtick literals — should extract as STRING
   */
  stage: `draft` | `published`;

  /**
   * optional and nullable interpolated template literal — should extract as STRING, optional, nullable
   */
  slug?: `${string}` | null;
}
