/**
 * test asset for string literal union types
 */
export interface ClaimSearch {
  /**
   * string literal union — should extract as STRING
   */
  status: 'active' | 'completed' | 'expired';

  /**
   * nullable string literal union — should extract as STRING, nullable
   */
  verdict: 'identical' | 'different' | 'ambiguous' | null;

  /**
   * single string literal — should extract as STRING
   */
  mode: 'search';

  /**
   * number literal union — should extract as NUMBER
   */
  priority: 1 | 2 | 3;

  /**
   * boolean literal — should extract as BOOLEAN
   */
  isActive: true | false;

  /**
   * regular string for comparison
   */
  name: string;

  /**
   * array of literal union — should extract as ARRAY of STRING
   */
  tags: ('featured' | 'promoted' | 'archived')[];
}
