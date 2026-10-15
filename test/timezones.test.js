const test = require('node:test');
const assert = require('node:assert/strict');
const {
  formatOffset,
  formatResponse,
  formateResponse,
  getTimezoneByCountry,
  getTimezoneGroupByCountryCode,
  getTimezoneList,
  getUTC,
  getTimezoneByName,
  getTimezonesByContinent,
  getTimezonesByOffset,
  searchTimezones,
  isValidTimezone,
} = require('../lib');

test('formatOffset handles all fractional and standard offsets accurately', () => {
  // Standard whole hour offsets
  assert.equal(formatOffset(0), '+00:00');
  assert.equal(formatOffset(60), '+01:00');
  assert.equal(formatOffset(-300), '-05:00');

  // Half-hour offsets
  assert.equal(formatOffset(330), '+05:30'); // India/Sri Lanka
  assert.equal(formatOffset(-210), '-03:30'); // Newfoundland
  assert.equal(formatOffset(-570), '-09:30'); // Marquesas

  // 45-minute offsets (previously broken by 30-min hardcode)
  assert.equal(formatOffset(345), '+05:45'); // Nepal
  assert.equal(formatOffset(525), '+08:45'); // Eucla, Australia
  assert.equal(formatOffset(765), '+12:45'); // Chatham Islands, NZ
});

test('getTimezoneByCountry is case-insensitive and supports single and multiple codes', () => {
  const usLower = getTimezoneByCountry('us');
  const usUpper = getTimezoneByCountry('US');
  const usMixed1 = getTimezoneByCountry('Us');
  const usMixed2 = getTimezoneByCountry('uS');

  assert.ok(usLower.length > 0, 'lowercase country code should return timezones');
  assert.equal(usLower.length, usUpper.length);
  assert.equal(usLower.length, usMixed1.length);
  assert.equal(usLower.length, usMixed2.length);

  // Array of country codes with mixed casing and whitespace
  const multi = getTimezoneByCountry([' in ', 'NP', 'lk']);
  const countryCodes = new Set(multi.map((t) => t.countryCode));
  assert.ok(countryCodes.has('IN'));
  assert.ok(countryCodes.has('NP'));
  assert.ok(countryCodes.has('LK'));

  // Invalid or empty inputs
  assert.deepEqual(getTimezoneByCountry('XX'), []);
  assert.deepEqual(getTimezoneByCountry(''), []);
  assert.deepEqual(getTimezoneByCountry([]), []);
  assert.deepEqual(getTimezoneByCountry(null), []);
});

test('Nepal timezone has correct +05:45 offset', () => {
  const nepal = getTimezoneByCountry('NP');
  assert.equal(nepal.length, 1);
  assert.equal(nepal[0].name, 'Asia/Kathmandu');
  assert.equal(nepal[0].offset, '+05:45');
  assert.equal(nepal[0].fullName, '(UTC+05:45) Asia/Kathmandu');
  assert.equal(nepal[0].rawOffsetInMinutes, 345);
});

test('Chatham Islands timezone has correct +12:45 offset', () => {
  const chatham = getTimezoneByName('Pacific/Chatham');
  assert.ok(chatham);
  assert.equal(chatham.offset, '+12:45');
  assert.equal(chatham.fullName, '(UTC+12:45) Pacific/Chatham');
  assert.equal(chatham.rawOffsetInMinutes, 765);
});

test('Kazakhstan (Asia/Almaty) has updated UTC+5 offset', () => {
  const almaty = getTimezoneByName('Asia/Almaty');
  assert.ok(almaty);
  assert.equal(almaty.offset, '+05:00');
  assert.equal(almaty.rawOffsetInMinutes, 300);
});

test('getTimezoneByName supports primary IANA names and group aliases', () => {
  // Primary name
  const ny = getTimezoneByName('America/New_York');
  assert.ok(ny);
  assert.equal(ny.name, 'America/New_York');
  assert.equal(ny.countryCode, 'US');

  // Case-insensitive lookup
  const kolkata = getTimezoneByName('asia/kolkata');
  assert.ok(kolkata);
  assert.equal(kolkata.name, 'Asia/Kolkata');

  // Group alias lookup (e.g. America/Boise is grouped under America/Denver)
  const boise = getTimezoneByName('America/Boise');
  assert.ok(boise);
  assert.equal(boise.name, 'America/Denver');

  // Unknown timezone
  assert.equal(getTimezoneByName('Mars/Unknown'), undefined);
  assert.equal(getTimezoneByName(''), undefined);
});

test('isValidTimezone correctly verifies timezone names and aliases', () => {
  assert.equal(isValidTimezone('America/New_York'), true);
  assert.equal(isValidTimezone('asia/tokyo'), true);
  assert.equal(isValidTimezone('America/Boise'), true);
  assert.equal(isValidTimezone('Invalid/Zone'), false);
  assert.equal(isValidTimezone(''), false);
});

test('getTimezonesByContinent filters by code and name', () => {
  const asiaByCode = getTimezonesByContinent('AS');
  const asiaByName = getTimezonesByContinent('Asia');
  const asiaLower = getTimezonesByContinent('asia');

  assert.ok(asiaByCode.length > 0);
  assert.equal(asiaByCode.length, asiaByName.length);
  assert.equal(asiaByCode.length, asiaLower.length);

  assert.deepEqual(getTimezonesByContinent('UNKNOWN'), []);
  assert.deepEqual(getTimezonesByContinent(''), []);
});

test('getTimezonesByOffset filters by numeric minutes and string offset', () => {
  const byMinutes = getTimezonesByOffset(345);
  const byString = getTimezonesByOffset('+05:45');
  assert.ok(byMinutes.length > 0);
  assert.equal(byMinutes.length, byString.length);
  assert.equal(byMinutes[0].name, 'Asia/Kathmandu');

  const negative = getTimezonesByOffset('-05:00');
  assert.ok(negative.length > 0);
  assert.ok(negative.some((t) => t.name === 'America/New_York'));

  assert.deepEqual(getTimezonesByOffset('invalid'), []);
});

test('searchTimezones searches across cities, country, names, and abbreviations', () => {
  const byCity = searchTimezones('Kathmandu');
  assert.ok(byCity.some((t) => t.name === 'Asia/Kathmandu'));

  const byCountry = searchTimezones('Nepal');
  assert.ok(byCountry.some((t) => t.countryName === 'Nepal'));

  const byAbbr = searchTimezones('IST');
  assert.ok(byAbbr.some((t) => t.countryCode === 'IN'));

  assert.deepEqual(searchTimezones('nonexistentxyzcity'), []);
  assert.deepEqual(searchTimezones(''), []);
});

test('getTimezoneGroupByCountryCode groups by uppercase country code', () => {
  const groups = getTimezoneGroupByCountryCode();
  assert.ok(groups.US);
  assert.equal(groups.US.code, 'US');
  assert.equal(groups.US.name, 'United States');
  assert.ok(groups.US.data.length > 0);

  assert.ok(groups.IN);
  assert.equal(groups.IN.code, 'IN');
  assert.equal(groups.IN.name, 'India');
});

test('getTimezoneList returns full list of timezones', () => {
  const list = getTimezoneList();
  assert.equal(list.length, 316);
  list.forEach((item) => {
    assert.ok(item.name);
    assert.ok(item.offset);
    assert.ok(item.fullName);
    assert.notEqual(item.rawOffsetInMinutes, undefined);
  });
});

test('getUTC returns standardized UTC timezone', () => {
  const utc = getUTC();
  assert.equal(utc.name, 'UTC');
  assert.equal(utc.offset, '+00:00');
  assert.equal(utc.abbreviation, 'UTC');
  assert.equal(utc.rawOffsetInMinutes, 0);
  assert.equal(utc.fullName, '(UTC+00:00) UTC');
});

test('backward compatibility: formateResponse is exported as an alias of formatResponse', () => {
  assert.equal(typeof formateResponse, 'function');
  assert.equal(formateResponse, formatResponse);
});
