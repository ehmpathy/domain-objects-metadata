import { DomainLiteral } from 'domain-objects';

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
   * optional string literal union — should extract as STRING, required false
   */
  sortBy?: 'date' | 'relevance';

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
export class ClaimSearch
  extends DomainLiteral<ClaimSearch>
  implements ClaimSearch {}
