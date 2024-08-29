import RawData from "./rawData.json";
import Abb from "./abbreviationList.json";
import { RawDataItem, FormattedResponse, TimezoneGroup } from "./types";

// Utility function to zero-pad numbers
const zeroPad = (num: number, places: number): string => {
  const str = num.toString();
  let _place = 0;

  // Check for a sign at the start of the string
  if (str[0] === "-" || str[0] === "+") _place = 1;

  // Calculate the number of leading zeros needed
  const zeroCount = places - (str.length - _place);

  // Construct the padded string
  const zeros = zeroCount > 0 ? "0".repeat(zeroCount) : "";
  return str.slice(0, _place) + zeros + str.slice(_place);
};

// Format the response data
export const formateResponse = (data: RawDataItem): FormattedResponse => {
  const _offset = data.rawOffsetInMinutes;
  let offset = _offset >= 0 ? "+" : "-";

  const _divide = Math.abs(_offset) / 60;
  const _remainder = Math.abs(_offset) % 60;

  const _h = zeroPad(Math.floor(_divide), 2);
  const _i = _remainder > 0 ? "30" : "00";

  offset = `${offset}${_h}:${_i}`;

  // Safely access the abbreviation or fallback to the offset
  const abbreviation = Abb[data.alternativeName as keyof typeof Abb] ?? offset;

  return {
    name: data.name,
    alternativeName: data.alternativeName,
    countryName: data.countryName,
    countryCode: data.countryCode,
    abbreviation,
    offset,
    rawOffsetInMinutes: data.rawOffsetInMinutes,
    fullName: `(UTC${offset}) ${data.name}`,
    fullAlternativeName: `(UTC${offset}) ${data.alternativeName}`,
  };
};

// Get timezone by country code(s)
export const getTimezoneByCountry = (
  cn: string | string[]
): FormattedResponse[] => {
  const result: FormattedResponse[] = [];
  let countryCode = Array.isArray(cn) ? cn : [cn];

  RawData.forEach((item: RawDataItem) => {
    if (
      countryCode.includes(item.countryCode.toLowerCase()) ||
      countryCode.includes(item.countryCode.toUpperCase())
    ) {
      result.push(formateResponse(item));
    }
  });

  return result;
};

// Get timezones grouped by country code
export const getTimezoneGroupByCountryCode = (): Record<
  string,
  TimezoneGroup
> => {
  const result: Record<string, TimezoneGroup> = {};

  RawData.forEach((item: RawDataItem) => {
    if (!result[item.countryCode]) {
      result[item.countryCode] = {
        name: item.countryName,
        code: item.countryCode,
        data: [],
      };
    }

    result[item.countryCode].data.push(formateResponse(item));
  });

  return result;
};

// Get the complete list of timezones
export const getTimezoneList = (): FormattedResponse[] => {
  const result: FormattedResponse[] = [];
  RawData.forEach((item: RawDataItem) => result.push(formateResponse(item)));
  return result;
};

// Get UTC information
export const getUTC = (): FormattedResponse => {
  return {
    name: "UTC",
    alternativeName: "UTC",
    countryName: "",
    countryCode: "",
    abbreviation: "UTC",
    offset: "+00:00",
    rawOffsetInMinutes: 0,
    fullName: "(UTC+00:00) UTC",
    fullAlternativeName: "(UTC+00:00) UTC",
  };
};
