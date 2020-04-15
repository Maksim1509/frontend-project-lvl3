import check from '../src/index';

test('test', () => {
  const actual = check();
  expect(actual).toBe(100);
});
