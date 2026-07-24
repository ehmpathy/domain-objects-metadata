import { isObjectShapedAs } from './isObjectShapedAs';

describe('isObjectShapedAs', () => {
  it('should return true when the value holds every named key', () => {
    expect(
      isObjectShapedAs({ name: 'Uuid', primitive: 'STRING' }, [
        'name',
        'primitive',
      ]),
    ).toEqual(true);
  });
  it('should return false when a named key is absent', () => {
    expect(isObjectShapedAs({ name: 'Uuid' }, ['name', 'primitive'])).toEqual(
      false,
    );
  });
  it('should return false for a bare string (not an object)', () => {
    expect(isObjectShapedAs('Uuid', ['name'])).toEqual(false);
  });
  it('should return false for null', () => {
    expect(isObjectShapedAs(null, ['name'])).toEqual(false);
  });
  it('should return false for undefined (an absent `of`)', () => {
    expect(isObjectShapedAs(undefined, ['name'])).toEqual(false);
  });
});
