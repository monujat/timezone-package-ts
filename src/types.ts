export interface RawDataItem {
  name: string;
  alternativeName: string;
  countryName: string;
  countryCode: string;
  rawOffsetInMinutes: number;
  abbreviation?: string;
  continentCode?: string;
  continentName?: string;
  mainCities?: string[];
  group?: string[];
  rawFormat?: string;
}

export interface FormattedResponse {
  name: string;
  alternativeName: string;
  countryName: string;
  countryCode: string;
  abbreviation: string;
  offset: string;
  rawOffsetInMinutes: number;
  fullName: string;
  fullAlternativeName: string;
  continentCode?: string;
  continentName?: string;
  mainCities?: string[];
  group?: string[];
  rawFormat?: string;
}

export interface TimezoneGroup {
  name: string;
  code: string;
  data: FormattedResponse[];
}

/**
 * Backward compatibility alias for TimezoneGroup (as formerly documented in README)
 */
export type CountryTimezoneGroup = TimezoneGroup;