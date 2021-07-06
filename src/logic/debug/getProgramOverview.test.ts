import ts from 'typescript';
import { getProgramOverview } from './getProgramOverview';

describe('getProgramOverview', () => {
  it('should be possible to see an overview of a program', () => {
    const program = ts.createProgram([`${__dirname}/../../__test_assets__/Address.ts`], {});
    const overview = getProgramOverview(program);
    console.log(JSON.stringify(overview, null, 2));
  });
});
