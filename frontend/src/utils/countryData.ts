import { CountryCode } from "libphonenumber-js";

export interface CountryInfo {
  code: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
  examplePhone: string;
  minPhoneDigits: number;
  maxPhoneDigits: number;
  phoneRegex?: RegExp;
  phoneErrorMsg?: string;
}

export const COUNTRY_DIAL_CODES: CountryInfo[] = [
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    examplePhone: "9876543210",
    minPhoneDigits: 10,
    maxPhoneDigits: 10,
    phoneRegex: /^[6-9]\d{9}$/,
    phoneErrorMsg: "Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9."
  },
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    examplePhone: "2025550143",
    minPhoneDigits: 10,
    maxPhoneDigits: 10,
    phoneRegex: /^[2-9]\d{9}$/,
    phoneErrorMsg: "US phone numbers must be 10 digits (area code starting with 2-9)."
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    examplePhone: "7911123456",
    minPhoneDigits: 10,
    maxPhoneDigits: 10,
    phoneRegex: /^7\d{9}$/,
    phoneErrorMsg: "UK mobile numbers must be 10 digits starting with 7 (e.g. 7911123456)."
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
    examplePhone: "4165550143",
    minPhoneDigits: 10,
    maxPhoneDigits: 10,
    phoneRegex: /^[2-9]\d{9}$/,
    phoneErrorMsg: "Canadian phone numbers must be 10 digits."
  },
  {
    code: "AU",
    name: "Australia",
    dialCode: "+61",
    flag: "🇦🇺",
    examplePhone: "412345678",
    minPhoneDigits: 9,
    maxPhoneDigits: 9,
    phoneRegex: /^4\d{8}$/,
    phoneErrorMsg: "Australian mobile numbers must be 9 digits starting with 4 (e.g. 412345678)."
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "+49",
    flag: "🇩🇪",
    examplePhone: "15112345678",
    minPhoneDigits: 10,
    maxPhoneDigits: 11,
    phoneRegex: /^1[5-7]\d{8,9}$/,
    phoneErrorMsg: "German mobile numbers must be 10 to 11 digits starting with 15, 16, or 17."
  },
  {
    code: "JP",
    name: "Japan",
    dialCode: "+81",
    flag: "🇯🇵",
    examplePhone: "9012345678",
    minPhoneDigits: 10,
    maxPhoneDigits: 10,
    phoneRegex: /^[789]0\d{8}$/,
    phoneErrorMsg: "Japanese mobile numbers must be 10 digits starting with 70, 80, or 90."
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    dialCode: "+971",
    flag: "🇦🇪",
    examplePhone: "501234567",
    minPhoneDigits: 9,
    maxPhoneDigits: 9,
    phoneRegex: /^5[024568]\d{7}$/,
    phoneErrorMsg: "UAE mobile numbers must be 9 digits starting with 50, 52, 54, 55, 56, or 58."
  },
  {
    code: "SG",
    name: "Singapore",
    dialCode: "+65",
    flag: "🇸🇬",
    examplePhone: "81234567",
    minPhoneDigits: 8,
    maxPhoneDigits: 8,
    phoneRegex: /^[89]\d{7}$/,
    phoneErrorMsg: "Singapore mobile numbers must be 8 digits starting with 8 or 9."
  },
  {
    code: "FR",
    name: "France",
    dialCode: "+33",
    flag: "🇫🇷",
    examplePhone: "612345678",
    minPhoneDigits: 9,
    maxPhoneDigits: 9,
    phoneRegex: /^[67]\d{8}$/,
    phoneErrorMsg: "French mobile numbers must be 9 digits starting with 6 or 7."
  }
];

export const getCountryByCodeOrName = (val: string): CountryInfo => {
  const normalized = val.trim().toLowerCase();
  return (
    COUNTRY_DIAL_CODES.find(
      (c) =>
        c.name.toLowerCase() === normalized ||
        c.code.toLowerCase() === normalized ||
        c.dialCode === val
    ) || COUNTRY_DIAL_CODES[0]
  );
};
