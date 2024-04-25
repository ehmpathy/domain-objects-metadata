import { DomainEvent } from 'domain-objects';

type StandardDate = string;

export interface PerformanceReport {
  id?: number;
  uuid?: string;
  createdAt?: Date;

  /**
   * the date on which this performance occurred
   */
  onDate: StandardDate;

  /**
   * frequency of exposures on this date
   */
  exposures: number;

  /**
   * frequency of engagements on this date
   *
   * an engagement is someone interacting with the advertisement
   * - click
   * - call
   * - etc
   */
  engagements: number;

  /**
   * frequency of conversions on this date
   */
  conversions: number;

  /**
   * the total cost of this performance on this date
   */
  cost: number;
}
export class PerformanceReport
  extends DomainEvent<PerformanceReport>
  implements PerformanceReport
{
  public static unique = ['onDate'];
  public static updatable = [];
}
