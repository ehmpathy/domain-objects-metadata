/**
 * .what = environment utilities for stage detection
 * .why = enables acceptance tests to behave differently per stage
 */
export enum Stage {
  TEST = 'test',
  PREP = 'prep',
  PRODUCTION = 'prod',
}

/**
 * .what = current stage from CONFIG env var
 * .why = acceptance tests need to know which environment they run against
 */
export const stage: Stage = (process.env.CONFIG as Stage) ?? Stage.TEST;
