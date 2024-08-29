# Timezone Package TS

A TypeScript package for handling timezone data, including functionalities to get timezone information by country code(s), group timezones by country code, and more.

## Installation

You can install this package via npm or yarn:

```bash
npm install timezone-package-ts

yarn add timezone-package-ts
```

Importing the Package
To use the functions provided by the package, first import them:

import { getTimezoneByCountry, getTimezoneGroupByCountryCode, getTimezoneList, getUTC } from 'timezone-package-ts';


Functions
1. getTimezoneByCountry(cn: string | string[]): FormattedResponse[]
Fetches timezone information based on a single country code or an array of country codes.

const timezones = getTimezoneByCountry('US');
console.log(timezones);


2. getTimezoneGroupByCountryCode(): { [key: string]: CountryTimezoneGroup }
Groups timezones by country code.

const groupedTimezones = getTimezoneGroupByCountryCode();
console.log(groupedTimezones);


3. getTimezoneList(): FormattedResponse[]
Returns a list of all available timezones.

const timezoneList = getTimezoneList();
console.log(timezoneList);

4. getUTC(): FormattedResponse
Returns the UTC timezone information.

const utcInfo = getUTC();
console.log(utcInfo);

Author
Monu Choudhary - monuchoudhary660@gmail.com
