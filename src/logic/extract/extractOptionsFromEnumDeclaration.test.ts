import ts, { isEnumDeclaration } from 'typescript';
import { extractOptionsFromEnumDeclaration } from './extractOptionsFromEnumDeclaration';

describe('extractOptionsFromEnumDeclaration', () => {
  it('should be able to get the options of an enum', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/Payment.ts`], {});
    const file = program.getSourceFiles().find((thisFile) => thisFile.fileName.includes('/Payment.ts'))!; // grab the right file
    const enumDeclaration = file.statements.find(isEnumDeclaration)!;
    const options = extractOptionsFromEnumDeclaration(enumDeclaration);
    // console.log(options);

    expect(options).toEqual(['PENDING', 'COMPLETED', 'CANCELED']);
  });
});
