import { DomainEntity } from 'domain-objects';
import { AsyncTask, AsyncTaskStatus } from 'simple-async-tasks';

export interface AsyncTaskRideWaves extends AsyncTask {
  uuid?: string;
  createdAt?: string;
  updatedAt?: string;
  status: AsyncTaskStatus;

  /**
   * the wave to ride
   */
  targetExid: string;
}
export class AsyncTaskRideWaves
  extends DomainEntity<AsyncTaskRideWaves>
  implements AsyncTaskRideWaves
{
  public static alias = 'task' as const;
  public static unique = ['targetExid'];
}
