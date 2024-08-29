import { getTimezoneByCountry } from './index'; // Adjust the import path as needed

test('getTimezoneByCountry should return an array', () => {
  const result = getTimezoneByCountry('US');
  expect(Array.isArray(result)).toBe(true);
});
