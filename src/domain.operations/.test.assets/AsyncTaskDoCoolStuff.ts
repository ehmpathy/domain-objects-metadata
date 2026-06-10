import { DomainEntity } from 'domain-objects';
import { AsyncTask, AsyncTaskStatus } from 'simple-async-tasks';

export interface AsyncTaskDoCoolStuff extends AsyncTask {
  uuid?: string;
  createdAt?: string;
  updatedAt?: string;
  status: AsyncTaskStatus;

  /**
   * the target to do the cool thing for
   */
  targetExid: string;
}
export class AsyncTaskDoCoolStuff
  extends DomainEntity<AsyncTaskDoCoolStuff>
  implements AsyncTaskDoCoolStuff
{
  public static alias = 'task';
  public static unique = ['targetExid'];
}
