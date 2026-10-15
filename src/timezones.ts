import RawData from "./rawData.json";
import Abb from "./abbreviationList.json";
import { RawDataItem, FormattedResponse, TimezoneGroup } from "./types";

/**
 * Format raw offset in minutes into "+HH:MM" or "-HH:MM"
 */
export const formatOffset = (rawOffsetInMinutes: number): string => {
  const sign = rawOffsetInMinutes >= 0 ? "+" : "-";
  const totalMinutes = Math.abs(rawOffsetInMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

/**
 * Format the raw timezone data into a structured response object
 */
export const formatResponse = (data: RawDataItem): FormattedResponse => {
  const offset = formatOffset(data.rawOffsetInMinutes);
  const abbreviation =
    Abb[data.alternativeName as keyof typeof Abb] ??
    data.abbreviation ??
    "";

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
    continentCode: data.continentCode,
    continentName: data.continentName,
    mainCities: data.mainCities,
    group: data.group,
    rawFormat: data.rawFormat,
  };
};

/**
 * @deprecated Use `formatResponse` instead. Kept for backward compatibility.
 */
export const formateResponse = formatResponse;

/**
 * Get timezones for one or more country codes (case-insensitive, e.g. "US", "us", or ["US", "IN"])
 */
export const getTimezoneByCountry = (
  cn: string | string[]
): FormattedResponse[] => {
  if (!cn) return [];
  const rawList = Array.isArray(cn) ? cn : [cn];
  const targetCodes = new Set(
    rawList
      .filter((c): c is string => typeof c === "string")
      .map((c) => c.trim().toUpperCase())
  );

  return (RawData as RawDataItem[])
    .filter((item) => targetCodes.has(item.countryCode.toUpperCase()))
    .map(formatResponse);
};

/**
 * Get timezones grouped by uppercase country code
 */
export const getTimezoneGroupByCountryCode = (): Record<
  string,
  TimezoneGroup
> => {
  const result: Record<string, TimezoneGroup> = {};

  (RawData as RawDataItem[]).forEach((item) => {
    const code = item.countryCode.toUpperCase();
    if (!result[code]) {
      result[code] = {
        name: item.countryName,
        code,
        data: [],
      };
    }
    result[code].data.push(formatResponse(item));
  });

  return result;
};

/**
 * Get the complete list of timezones
 */
export const getTimezoneList = (): FormattedResponse[] => {
  return (RawData as RawDataItem[]).map(formatResponse);
};

/**
 * Get UTC timezone information
 */
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
    continentCode: "",
    continentName: "",
    mainCities: [],
    group: ["UTC", "Etc/UTC", "GMT", "Etc/GMT"],
    rawFormat: "+00:00 UTC",
  };
};

/**
 * Look up a timezone by IANA identifier or group alias (e.g. "America/New_York" or "America/Boise")
 */
export const getTimezoneByName = (
  name: string
): FormattedResponse | undefined => {
  if (!name || typeof name !== "string") return undefined;
  const trimmed = name.trim().toLowerCase();
  const found = (RawData as RawDataItem[]).find(
    (item) =>
      item.name.toLowerCase() === trimmed ||
      item.group?.some((g) => g.toLowerCase() === trimmed)
  );
  return found ? formatResponse(found) : undefined;
};

/**
 * Filter timezones by continent code or continent name (e.g. "AS", "Asia", "NA", "North America")
 */
export const getTimezonesByContinent = (
  continent: string
): FormattedResponse[] => {
  if (!continent || typeof continent !== "string") return [];
  const trimmed = continent.trim().toUpperCase();
  return (RawData as RawDataItem[])
    .filter(
      (item) =>
        item.continentCode?.toUpperCase() === trimmed ||
        item.continentName?.toUpperCase() === trimmed
    )
    .map(formatResponse);
};

/**
 * Filter timezones by offset in minutes (e.g. 330) or string format (e.g. "+05:30", "-04:00")
 */
export const getTimezonesByOffset = (
  offset: number | string
): FormattedResponse[] => {
  let targetMinutes: number | undefined;

  if (typeof offset === "number") {
    targetMinutes = offset;
  } else if (typeof offset === "string") {
    const clean = offset.trim();
    const match = clean.match(/^([+-])?(\d{1,2}):?(\d{2})?$/);
    if (match) {
      const sign = match[1] === "-" ? -1 : 1;
      const hours = parseInt(match[2], 10);
      const minutes = match[3] ? parseInt(match[3], 10) : 0;
      targetMinutes = sign * (hours * 60 + minutes);
    }
  }

  if (targetMinutes === undefined) return [];

  return (RawData as RawDataItem[])
    .filter((item) => item.rawOffsetInMinutes === targetMinutes)
    .map(formatResponse);
};

/**
 * Search timezones across name, alternative name, country, cities, and abbreviations
 */
export const searchTimezones = (query: string): FormattedResponse[] => {
  if (!query || typeof query !== "string") return [];
  const q = query.trim().toLowerCase();

  return (RawData as RawDataItem[])
    .filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.alternativeName.toLowerCase().includes(q) ||
        item.countryName.toLowerCase().includes(q) ||
        item.countryCode.toLowerCase().includes(q) ||
        (item.abbreviation && item.abbreviation.toLowerCase().includes(q)) ||
        item.mainCities?.some((city) => city.toLowerCase().includes(q)) ||
        item.group?.some((g) => g.toLowerCase().includes(q))
      );
    })
    .map(formatResponse);
};

/**
 * Check if a timezone identifier or alias exists
 */
export const isValidTimezone = (name: string): boolean => {
  return getTimezoneByName(name) !== undefined;
};
