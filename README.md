# timezone-package-ts

[![NPM Version](https://img.shields.io/npm/v/timezone-package-ts.svg?style=flat-square)](https://www.npmjs.com/package/timezone-package-ts)
[![CI Status](https://github.com/monujat/timezone-package-ts/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/monujat/timezone-package-ts/actions/workflows/ci.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg?style=flat-square)](https://www.npmjs.com/package/timezone-package-ts)
[![Bundle Size](https://img.shields.io/badge/packed%20size-<30%20kB-success.svg?style=flat-square)](https://www.npmjs.com/package/timezone-package-ts)

A lightweight, **zero-dependency** TypeScript package for timezone data, country groupings, UTC offsets, continent filtering, and intelligent timezone search.

---

## ✨ Features

- **⚡ Zero Runtime Dependencies:** Extremely fast with an unpacked size under 160 kB.
- **🎯 Accurate Offsets:** Handles all standard, 30-minute, and 45-minute fractional offsets accurately (Nepal `+05:45`, Chatham Islands `+12:45`, Eucla `+08:45`).
- **🔍 Rich Search & Lookup:** Search by city name, country name, continent, abbreviation, or UTC offset.
- **🔤 Case-Insensitive:** Query country codes in any casing (`'US'`, `'us'`, `'Us'`, or arrays like `['in', 'US', 'gb']`).
- **🛡️ 100% TypeScript:** First-class TypeScript definitions included out of the box.
- **🔄 Modern Data:** Includes recent global timezone reforms (e.g. Kazakhstan unified UTC+05:00 zone).

---

## 📦 Installation

```bash
# Using npm
npm install timezone-package-ts

# Using yarn
yarn add timezone-package-ts

# Using pnpm
pnpm add timezone-package-ts
```

---

## 🚀 Quick Start

```typescript
import {
  getTimezoneByCountry,
  getTimezoneByName,
  getTimezonesByContinent,
  getTimezonesByOffset,
  searchTimezones,
  getTimezoneGroupByCountryCode,
  getTimezoneList,
  getUTC,
  isValidTimezone,
} from 'timezone-package-ts';

// 1. Get timezones by country code (case-insensitive)
const usTimezones = getTimezoneByCountry('us');
console.log(usTimezones);

// Multiple countries
const multi = getTimezoneByCountry(['US', 'IN', 'NP']);

// 2. Lookup by IANA name or alias
const kolkata = getTimezoneByName('Asia/Kolkata');
const boise = getTimezoneByName('America/Boise'); // Group alias under America/Denver

// 3. Search timezones by city, country, or keyword
const results = searchTimezones('Kathmandu');

// 4. Filter by continent
const asiaTimezones = getTimezonesByContinent('Asia'); // or 'AS'

// 5. Filter by UTC offset
const plusFiveThirty = getTimezonesByOffset('+05:30'); // or 330
```

---

## 📖 API Reference

### 1. `getTimezoneByCountry(cn: string | string[]): FormattedResponse[]`
Fetches timezone details for one or more 2-letter ISO country codes. Case-insensitive and trims surrounding whitespace.

```typescript
const timezones = getTimezoneByCountry('US');
// or multiple:
const results = getTimezoneByCountry(['US', 'in', 'np']);
```

### 2. `getTimezoneByName(name: string): FormattedResponse | undefined`
Retrieves timezone details by canonical IANA timezone identifier (e.g., `'America/New_York'`) or recognized group aliases (e.g., `'America/Boise'`).

```typescript
const tz = getTimezoneByName('Asia/Tokyo');
console.log(tz?.offset); // "+09:00"
```

### 3. `searchTimezones(query: string): FormattedResponse[]`
Performs a case-insensitive search across timezone name, country name, alternative name, abbreviation, main cities, and alias groups.

```typescript
const matches = searchTimezones('Berlin');
console.log(matches[0].name); // "Europe/Berlin"
```

### 4. `getTimezonesByContinent(continent: string): FormattedResponse[]`
Returns all timezones located within a specific continent. Accepts 2-letter continent codes (`'AF'`, `'AN'`, `'AS'`, `'EU'`, `'NA'`, `'OC'`, `'SA'`) or full names (e.g., `'Europe'`, `'North America'`).

```typescript
const europeanZones = getTimezonesByContinent('EU');
```

### 5. `getTimezonesByOffset(offset: number | string): FormattedResponse[]`
Filters timezones by raw offset in minutes (e.g. `345`) or string format (e.g. `'+05:45'`, `'-05:00'`).

```typescript
const nepalAndOthers = getTimezonesByOffset('+05:45');
console.log(nepalAndOthers[0].name); // "Asia/Kathmandu"
```

### 6. `isValidTimezone(name: string): boolean`
Validates whether a given timezone identifier or alias is valid and recognized.

```typescript
isValidTimezone('America/New_York'); // true
isValidTimezone('Invalid/Zone');      // false
```

### 7. `getTimezoneGroupByCountryCode(): Record<string, TimezoneGroup>`
Returns all timezones grouped by their 2-letter uppercase country code.

```typescript
const grouped = getTimezoneGroupByCountryCode();
console.log(grouped['IN'].data);
```

### 8. `getTimezoneList(): FormattedResponse[]`
Returns the full array of all 316 curated timezones with formatted properties.

```typescript
const allZones = getTimezoneList();
console.log(allZones.length); // 316
```

### 9. `getUTC(): FormattedResponse`
Returns standardized UTC timezone details.

```typescript
const utc = getUTC();
console.log(utc.fullName); // "(UTC+00:00) UTC"
```

### 10. `formatOffset(rawOffsetInMinutes: number): string`
Utility function to format minute offsets into standardized strings.

```typescript
formatOffset(345);  // "+05:45"
formatOffset(-300); // "-05:00"
```

---

## 🏷️ TypeScript Interfaces

```typescript
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

// Alias for TimezoneGroup
export type CountryTimezoneGroup = TimezoneGroup;
```

---

## 🛠️ Development & Testing

```bash
# Clone the repository
git clone https://github.com/monujat/timezone-package-ts.git
cd timezone-package-ts

# Install dependencies (Node 20+)
yarn install

# Run type-check & lint
yarn lint

# Build TypeScript to lib/
yarn build

# Run unit tests
yarn test
```

---

## 🚢 CI/CD & Automated NPM Publishing

This repository includes automated GitHub Actions workflows:

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Triggers on every pull request and push to `master`.
   - Runs linting and unit tests across Node.js `18.x`, `20.x`, and `22.x`.

2. **Automated NPM Publishing (`.github/workflows/publish.yml`)**:
   - Publishes to npm automatically with [npm provenance](https://docs.npmjs.com/generating-provenance-statements) whenever a GitHub Release is created, or manually via **Actions > Publish to NPM > Run workflow**.

### Setup Instructions for Publishing:

1. **Generate an NPM Access Token**:
   - Log in to [npmjs.com](https://www.npmjs.com/).
   - Go to **Access Tokens** > **Generate New Token** > Select **Automation** or **Granular Access Token** with Read and Write permissions for `timezone-package-ts`.
   - Copy the generated token.

2. **Add Secret to GitHub**:
   - In your GitHub repository: Navigate to **Settings** > **Secrets and variables** > **Actions**.
   - Click **New repository secret**.
   - Name: `NPM_TOKEN`
   - Value: `<paste your npm token>`
   - Click **Add secret**.

3. **Release a New Version**:
   - Update `"version"` in `package.json` (e.g. `1.0.5`).
   - Push your commit:
     ```bash
     git commit -am "chore: release 1.0.5"
     git push origin master
     ```
   - Go to **Releases** > **Draft a new release** on GitHub.
   - Set tag version (e.g. `v1.0.5`), title, and click **Publish release**.
   - The workflow will automatically test, build, and publish the package to NPM!

---

## 📄 License

[ISC](file:///home/monu/testing/timezone-package-ts/package.json) © [Monu Choudhary](mailto:monuchoudhary660@gmail.com)
