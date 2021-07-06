import ts from 'typescript';
import { getFileOverview } from './getFileOverview';

describe('getFileOverview', () => {
  it('should be possible to see an overview of a program', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/Address.ts`], {});
    const rootFile = program.getSourceFiles().filter((file) => file.fileName.includes('/Address.ts'))[0];
    const overview = getFileOverview(rootFile);
    // console.log(JSON.stringify(overview, null, 2));
  });
});
