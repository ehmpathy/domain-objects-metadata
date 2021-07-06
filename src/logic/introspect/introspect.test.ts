import { introspect } from './introspect';

describe('introspect', () => {
  it('should run on the value object Address', () => {
    introspect(`${__dirname}/__test_assets__/Address.ts`);
  });
});
