export interface RawDataItem {
    name: string;
    alternativeName: string;
    countryName: string;
    countryCode: string;
    rawOffsetInMinutes: number;
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
  }
  
  export interface TimezoneGroup {
    name: string;
    code: string;
    data: FormattedResponse[];
  }
  