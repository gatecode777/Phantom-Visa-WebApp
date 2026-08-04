import React, { useState, useEffect, useRef } from "react";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";
import { API_V1_URL } from "../config/api";
import { lookupPostalAddress } from "../services/addressLookupService";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  Search,
  Globe,
  Check,
  Building,
  Navigation,
  ShieldCheck,
  Info
} from "lucide-react";

export interface RegisterApplicantProps {
  onClose?: () => void;
  onSuccessSubmit?: (applicantData: any) => void;
}

// ISO Country Configuration Interface
export interface ISOCountry {
  code: CountryCode; // e.g. "IN", "US", "GB", "CA", "AU", "DE", "JP"
  name: string;
  dialCode: string;
  flag: string;
  postalLabel: string; // "PIN Code", "ZIP Code", "Postcode", "Postal Code"
  stateLabel: string; // "State", "County", "Prefecture", "Province", "State / Region"
  cityLabel: string; // "City / District", "City", "Town / City", "Suburb / City", "City / Ward"
  postalPlaceholder: string;
  postalRegex: RegExp;
  postalErrorMsg: string;
  examplePhone: string;
  stateOptions?: string[];
}

// Default Base ISO Countries List (Used immediately and enriched via REST Countries API)
export const WORLD_COUNTRIES_LIST: ISOCountry[] = [
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    postalLabel: "PIN Code",
    stateLabel: "State",
    cityLabel: "City / District",
    postalPlaceholder: "302020",
    postalRegex: /^\d{6}$/,
    postalErrorMsg: "PIN Code must be exactly 6 digits (e.g. 302020 or 110001).",
    examplePhone: "9876543210",
    stateOptions: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
      "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
      "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
      "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh", "Jammu and Kashmir"
    ]
  },
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    postalLabel: "ZIP Code",
    stateLabel: "State",
    cityLabel: "City",
    postalPlaceholder: "90210",
    postalRegex: /^\d{5}(-\d{4})?$/,
    postalErrorMsg: "ZIP Code must be 5 digits or 5+4 format (e.g. 90210 or 12345-6789).",
    examplePhone: "2025550143",
    stateOptions: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida",
      "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
      "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
      "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
      "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
      "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ]
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    postalLabel: "Postcode",
    stateLabel: "County (Optional)",
    cityLabel: "Town / City",
    postalPlaceholder: "SW1A 1AA",
    postalRegex: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/,
    postalErrorMsg: "Please enter a valid UK postcode (e.g. SW1A 1AA or M1 1AE).",
    examplePhone: "7911123456"
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
    postalLabel: "Postal Code",
    stateLabel: "Province / Territory",
    cityLabel: "City",
    postalPlaceholder: "K1A 0B1",
    postalRegex: /^[A-Za-z]\d[A-Za-z]\s*\d[A-Za-z]\d$/,
    postalErrorMsg: "Postal Code must be in format A1A 1A1 (e.g. K1A 0B1).",
    examplePhone: "4165550123",
    stateOptions: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
      "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"
    ]
  },
  {
    code: "AU",
    name: "Australia",
    dialCode: "+61",
    flag: "🇦🇺",
    postalLabel: "Postcode",
    stateLabel: "State / Territory",
    cityLabel: "Suburb / City",
    postalPlaceholder: "2000",
    postalRegex: /^\d{4}$/,
    postalErrorMsg: "Postcode must be exactly 4 digits (e.g. 2000 or 3000).",
    examplePhone: "412345678",
    stateOptions: [
      "New South Wales", "Victoria", "Queensland", "Western Australia",
      "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"
    ]
  },
  {
    code: "JP",
    name: "Japan",
    dialCode: "+81",
    flag: "🇯🇵",
    postalLabel: "Postal Code",
    stateLabel: "Prefecture",
    cityLabel: "City / Ward",
    postalPlaceholder: "100-0001",
    postalRegex: /^\d{3}-\d{4}$|^\d{7}$/,
    postalErrorMsg: "Japan Postal Code must be 7 digits (e.g. 100-0001 or 1000001).",
    examplePhone: "9012345678"
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "+49",
    flag: "🇩🇪",
    postalLabel: "Postal Code",
    stateLabel: "State / Bundesland",
    cityLabel: "City",
    postalPlaceholder: "10115",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Germany Postal Code must be 5 digits (e.g. 10115).",
    examplePhone: "15112345678"
  },
  {
    code: "FR",
    name: "France",
    dialCode: "+33",
    flag: "🇫🇷",
    postalLabel: "Postal Code",
    stateLabel: "Region / Department",
    cityLabel: "City",
    postalPlaceholder: "75001",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "France Postal Code must be 5 digits (e.g. 75001).",
    examplePhone: "612345678"
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    dialCode: "+971",
    flag: "🇦🇪",
    postalLabel: "Postal Code (Optional)",
    stateLabel: "Emirate",
    cityLabel: "City",
    postalPlaceholder: "00000",
    postalRegex: /^.*$/,
    postalErrorMsg: "Valid postal code required.",
    examplePhone: "501234567",
    stateOptions: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]
  },
  {
    code: "SG",
    name: "Singapore",
    dialCode: "+65",
    flag: "🇸🇬",
    postalLabel: "Postal Code",
    stateLabel: "Region",
    cityLabel: "City",
    postalPlaceholder: "049318",
    postalRegex: /^\d{6}$/,
    postalErrorMsg: "Singapore Postal Code must be 6 digits (e.g. 049318).",
    examplePhone: "81234567"
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    dialCode: "+966",
    flag: "🇸🇦",
    postalLabel: "Postal Code",
    stateLabel: "Province / Region",
    cityLabel: "City",
    postalPlaceholder: "12211",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Saudi Postal Code must be 5 digits (e.g. 12211).",
    examplePhone: "512345678"
  },
  {
    code: "QA",
    name: "Qatar",
    dialCode: "+974",
    flag: "🇶🇦",
    postalLabel: "Postal Code",
    stateLabel: "Municipality",
    cityLabel: "City",
    postalPlaceholder: "00000",
    postalRegex: /^.*$/,
    postalErrorMsg: "Valid postal code required.",
    examplePhone: "55123456"
  },
  {
    code: "KW",
    name: "Kuwait",
    dialCode: "+965",
    flag: "🇰🇼",
    postalLabel: "Postal Code",
    stateLabel: "Governorate",
    cityLabel: "City",
    postalPlaceholder: "13001",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Kuwait Postal Code must be 5 digits (e.g. 13001).",
    examplePhone: "91234567"
  },
  {
    code: "MY",
    name: "Malaysia",
    dialCode: "+60",
    flag: "🇲🇾",
    postalLabel: "Postcode",
    stateLabel: "State",
    cityLabel: "City",
    postalPlaceholder: "50000",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Malaysia Postcode must be 5 digits (e.g. 50000).",
    examplePhone: "123456789"
  },
  {
    code: "ID",
    name: "Indonesia",
    dialCode: "+62",
    flag: "🇮🇩",
    postalLabel: "Postal Code",
    stateLabel: "Province",
    cityLabel: "City / Regency",
    postalPlaceholder: "10110",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Indonesia Postal Code must be 5 digits.",
    examplePhone: "8123456789"
  },
  {
    code: "TH",
    name: "Thailand",
    dialCode: "+66",
    flag: "🇹🇭",
    postalLabel: "Postal Code",
    stateLabel: "Province",
    cityLabel: "District / City",
    postalPlaceholder: "10100",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Thailand Postal Code must be 5 digits.",
    examplePhone: "812345678"
  },
  {
    code: "VN",
    name: "Vietnam",
    dialCode: "+84",
    flag: "🇻🇳",
    postalLabel: "Postal Code",
    stateLabel: "Province / Municipality",
    cityLabel: "City",
    postalPlaceholder: "700000",
    postalRegex: /^\d{5,6}$/,
    postalErrorMsg: "Vietnam Postal Code must be 5 or 6 digits.",
    examplePhone: "912345678"
  },
  {
    code: "PH",
    name: "Philippines",
    dialCode: "+63",
    flag: "🇵🇭",
    postalLabel: "ZIP Code",
    stateLabel: "Province / Region",
    cityLabel: "City / Municipality",
    postalPlaceholder: "1000",
    postalRegex: /^\d{4}$/,
    postalErrorMsg: "Philippines ZIP Code must be 4 digits.",
    examplePhone: "9171234567"
  },
  {
    code: "KR",
    name: "South Korea",
    dialCode: "+82",
    flag: "🇰🇷",
    postalLabel: "Postal Code",
    stateLabel: "Province / Special City",
    cityLabel: "City / District",
    postalPlaceholder: "03050",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "South Korea Postal Code must be 5 digits.",
    examplePhone: "1012345678"
  },
  {
    code: "CN",
    name: "China",
    dialCode: "+86",
    flag: "🇨🇳",
    postalLabel: "Postal Code",
    stateLabel: "Province",
    cityLabel: "City",
    postalPlaceholder: "100000",
    postalRegex: /^\d{6}$/,
    postalErrorMsg: "China Postal Code must be 6 digits.",
    examplePhone: "13800138000"
  },
  {
    code: "HK",
    name: "Hong Kong",
    dialCode: "+852",
    flag: "🇭🇰",
    postalLabel: "Postal Code (Optional)",
    stateLabel: "Territory",
    cityLabel: "District",
    postalPlaceholder: "999077",
    postalRegex: /^.*$/,
    postalErrorMsg: "Valid postal code required.",
    examplePhone: "91234567"
  },
  {
    code: "NZ",
    name: "New Zealand",
    dialCode: "+64",
    flag: "🇳🇿",
    postalLabel: "Postcode",
    stateLabel: "Region",
    cityLabel: "City / Suburb",
    postalPlaceholder: "1010",
    postalRegex: /^\d{4}$/,
    postalErrorMsg: "New Zealand Postcode must be 4 digits.",
    examplePhone: "211234567"
  },
  {
    code: "ZA",
    name: "South Africa",
    dialCode: "+27",
    flag: "🇿🇦",
    postalLabel: "Postal Code",
    stateLabel: "Province",
    cityLabel: "City",
    postalPlaceholder: "8001",
    postalRegex: /^\d{4}$/,
    postalErrorMsg: "South Africa Postal Code must be 4 digits.",
    examplePhone: "821234567"
  },
  {
    code: "BR",
    name: "Brazil",
    dialCode: "+55",
    flag: "🇧🇷",
    postalLabel: "CEP Code",
    stateLabel: "State (UF)",
    cityLabel: "City",
    postalPlaceholder: "01000-000",
    postalRegex: /^\d{5}-?\d{3}$/,
    postalErrorMsg: "Brazil CEP Code must be 8 digits (e.g. 01000-000).",
    examplePhone: "11912345678"
  },
  {
    code: "MX",
    name: "Mexico",
    dialCode: "+52",
    flag: "🇲🇽",
    postalLabel: "Postal Code",
    stateLabel: "State",
    cityLabel: "City / Municipality",
    postalPlaceholder: "01000",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Mexico Postal Code must be 5 digits.",
    examplePhone: "5512345678"
  },
  {
    code: "ES",
    name: "Spain",
    dialCode: "+34",
    flag: "🇪🇸",
    postalLabel: "Postal Code",
    stateLabel: "Province",
    cityLabel: "City",
    postalPlaceholder: "28001",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Spain Postal Code must be 5 digits.",
    examplePhone: "612345678"
  },
  {
    code: "IT",
    name: "Italy",
    dialCode: "+39",
    flag: "🇮🇹",
    postalLabel: "CAP Code",
    stateLabel: "Province",
    cityLabel: "City / Commune",
    postalPlaceholder: "00100",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Italy CAP Code must be 5 digits.",
    examplePhone: "3123456789"
  },
  {
    code: "CH",
    name: "Switzerland",
    dialCode: "+41",
    flag: "🇨🇭",
    postalLabel: "Postal Code",
    stateLabel: "Canton",
    cityLabel: "City",
    postalPlaceholder: "8000",
    postalRegex: /^\d{4}$/,
    postalErrorMsg: "Switzerland Postal Code must be 4 digits.",
    examplePhone: "791234567"
  },
  {
    code: "NL",
    name: "Netherlands",
    dialCode: "+31",
    flag: "🇳🇱",
    postalLabel: "Postcode",
    stateLabel: "Province",
    cityLabel: "City",
    postalPlaceholder: "1012 JS",
    postalRegex: /^\d{4}\s?[A-Za-z]{2}$/,
    postalErrorMsg: "Netherlands Postcode must be 4 digits + 2 letters (e.g. 1012 JS).",
    examplePhone: "612345678"
  },
  {
    code: "SE",
    name: "Sweden",
    dialCode: "+46",
    flag: "🇸🇪",
    postalLabel: "Postcode",
    stateLabel: "County",
    cityLabel: "City",
    postalPlaceholder: "111 22",
    postalRegex: /^\d{3}\s?\d{2}$/,
    postalErrorMsg: "Sweden Postcode must be 5 digits (e.g. 111 22).",
    examplePhone: "701234567"
  },
  {
    code: "NO",
    name: "Norway",
    dialCode: "+47",
    flag: "🇳🇴",
    postalLabel: "Postcode",
    stateLabel: "County",
    cityLabel: "City",
    postalPlaceholder: "0010",
    postalRegex: /^\d{4}$/,
    postalErrorMsg: "Norway Postcode must be 4 digits.",
    examplePhone: "40123456"
  },
  {
    code: "DK",
    name: "Denmark",
    dialCode: "+45",
    flag: "🇩🇰",
    postalLabel: "Postcode",
    stateLabel: "Region",
    cityLabel: "City",
    postalPlaceholder: "1000",
    postalRegex: /^\d{4}$/,
    postalErrorMsg: "Denmark Postcode must be 4 digits.",
    examplePhone: "20123456"
  },
  {
    code: "IE",
    name: "Ireland",
    dialCode: "+353",
    flag: "🇮🇪",
    postalLabel: "Eircode / Postcode",
    stateLabel: "County",
    cityLabel: "City / Town",
    postalPlaceholder: "D02 X285",
    postalRegex: /^[A-Za-z0-9]{3}\s?[A-Za-z0-9]{4}$|^.*$/,
    postalErrorMsg: "Valid Eircode required (e.g. D02 X285).",
    examplePhone: "871234567"
  },
  {
    code: "RU",
    name: "Russia",
    dialCode: "+7",
    flag: "🇷🇺",
    postalLabel: "Postal Code",
    stateLabel: "Region / Oblast",
    cityLabel: "City",
    postalPlaceholder: "101000",
    postalRegex: /^\d{6}$/,
    postalErrorMsg: "Russia Postal Code must be 6 digits.",
    examplePhone: "9123456789"
  },
  {
    code: "EG",
    name: "Egypt",
    dialCode: "+20",
    flag: "🇪🇬",
    postalLabel: "Postal Code",
    stateLabel: "Governorate",
    cityLabel: "City",
    postalPlaceholder: "11511",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Egypt Postal Code must be 5 digits.",
    examplePhone: "1012345678"
  },
  {
    code: "LK",
    name: "Sri Lanka",
    dialCode: "+94",
    flag: "🇱🇰",
    postalLabel: "Postal Code",
    stateLabel: "Province / District",
    cityLabel: "City",
    postalPlaceholder: "00100",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Sri Lanka Postal Code must be 5 digits.",
    examplePhone: "712345678"
  },
  {
    code: "NP",
    name: "Nepal",
    dialCode: "+977",
    flag: "🇳🇵",
    postalLabel: "Postal Code",
    stateLabel: "Province",
    cityLabel: "City / District",
    postalPlaceholder: "44600",
    postalRegex: /^\d{5}$/,
    postalErrorMsg: "Nepal Postal Code must be 5 digits.",
    examplePhone: "9841234567"
  }
];

// Nationalities List
export const NATIONALITIES_LIST = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Argentine", "Armenian", "Australian",
  "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Belarusian", "Belgian",
  "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian",
  "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African",
  "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban",
  "Cypriot", "Czech", "Danish", "Djiboutian", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian",
  "Emirati", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French",
  "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinean",
  "Guyanese", "Haitian", "Honduran", "Hungarian", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish",
  "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kuwaiti",
  "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger",
  "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivian", "Malian", "Maltese", "Mauritanian", "Mauritian",
  "Mexican", "Moldovan", "Monacan", "Mongolian", "Montenegrin", "Moroccan", "Mozambican", "Namibian", "Nepalese",
  "New Zealander", "Nicaraguan", "Nigerian", "North Korean", "Norwegian", "Omani", "Pakistani", "Panamanian",
  "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saudi",
  "Senegalese", "Serbian", "Singaporean", "Slovak", "Slovenian", "Somali", "South African", "South Korean",
  "Spanish", "Sri Lankan", "Sudanese", "Surinamese", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik",
  "Tanzanian", "Thai", "Togolese", "Tongan", "Tunisian", "Turkish", "Turkmen", "Ugandan", "Ukrainian",
  "Uruguayan", "Uzbek", "Venezuelan", "Vietnamese", "Yemeni", "Zambian", "Zimbabwean"
];

// Helper to calculate Password Strength
export function getPasswordStrength(pwd: string) {
  const checks = {
    length: pwd.length >= 8,
    capital: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /\d/.test(pwd),
    special: /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
  };

  let score = 0;
  if (checks.length) score += 1;
  if (checks.capital && checks.lowercase) score += 1;
  if (checks.number) score += 1;
  if (checks.special) score += 1;

  let label = "Weak";
  let color = "bg-rose-500";
  let textColor = "text-rose-600";
  let width = "25%";

  if (score === 2) {
    label = "Fair";
    color = "bg-amber-500";
    textColor = "text-amber-600";
    width = "50%";
  } else if (score === 3) {
    label = "Good";
    color = "bg-blue-500";
    textColor = "text-blue-600";
    width = "75%";
  } else if (score === 4) {
    label = "Strong";
    color = "bg-emerald-500";
    textColor = "text-emerald-600";
    width = "100%";
  }

  return { score, checks, label, color, textColor, width };
}

export default function RegisterApplicant({ onClose, onSuccessSubmit }: RegisterApplicantProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isAutoFillingPin, setIsAutoFillingPin] = useState<boolean>(false);
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);

  // Live Rest Countries List State
  const [countriesList, setCountriesList] = useState<ISOCountry[]>(WORLD_COUNTRIES_LIST);

  // Searchable Country Dropdown State
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Searchable Nationality Dropdown State
  const [isNationalityDropdownOpen, setIsNationalityDropdownOpen] = useState<boolean>(false);
  const [nationalitySearch, setNationalitySearch] = useState<string>("");
  const nationalityDropdownRef = useRef<HTMLDivElement>(null);

  // Postal lookup debounce timer ref
  const postalDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Max DOB limit (yesterday)
  const maxDobDate = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Active Country Configuration
  const [selectedCountryConfig, setSelectedCountryConfig] = useState<ISOCountry>(WORLD_COUNTRIES_LIST[0]);

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "+91",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "Male",
    nationality: "Indian",
    country: "India",
    countryCode: "IN" as CountryCode,
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateOrProvince: "",
    postalCode: ""
  });

  // Validation Errors & Touched State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // UI Toast State
  const [toastConfig, setToastConfig] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  const triggerToast = (title: string, description?: string, type: "success" | "error" = "error") => {
    setToastConfig({ title, description, type });
    setTimeout(() => setToastConfig(null), 5000);
  };

  // 1. Fetch REST Countries API metadata on mount (with instant offline fallback)
  useEffect(() => {
    const fetchRESTCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const apiCountries: ISOCountry[] = data
              .filter((c: any) => c.cca2 && c.name?.common)
              .map((c: any) => {
                const code = c.cca2 as CountryCode;
                const existing = WORLD_COUNTRIES_LIST.find((base) => base.code === code);

                let rootDial = c.idd?.root || "";
                let suffix = c.idd?.suffixes && c.idd.suffixes.length === 1 ? c.idd.suffixes[0] : "";
                let dialCode = existing ? existing.dialCode : `${rootDial}${suffix}` || "+1";

                return {
                  code,
                  name: c.name.common,
                  dialCode,
                  flag: c.flags?.svg || c.flags?.png ? "🌐" : existing?.flag || "🌐",
                  postalLabel: existing?.postalLabel || "Postal Code",
                  stateLabel: existing?.stateLabel || "State / Province / Region",
                  cityLabel: existing?.cityLabel || "City",
                  postalPlaceholder: existing?.postalPlaceholder || "Postal Code",
                  postalRegex: existing?.postalRegex || /^[A-Za-z0-9\s-]{3,10}$/,
                  postalErrorMsg: existing?.postalErrorMsg || "Please enter a valid postal code.",
                  examplePhone: existing?.examplePhone || "123456789",
                  stateOptions: existing?.stateOptions
                };
              })
              .sort((a, b) => a.name.localeCompare(b.name));

            // Ensure India is at top of list
            const indiaIndex = apiCountries.findIndex((c) => c.code === "IN");
            if (indiaIndex > 0) {
              const india = apiCountries.splice(indiaIndex, 1)[0];
              apiCountries.unshift(india);
            }

            if (apiCountries.length > 0) {
              setCountriesList(apiCountries);
            }
          }
        }
      } catch (e) {
        console.warn("REST Countries API call skipped/offline:", e);
      }
    };

    fetchRESTCountries();
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (nationalityDropdownRef.current && !nationalityDropdownRef.current.contains(event.target as Node)) {
        setIsNationalityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update configuration when country changes
  const handleSelectCountry = (countryItem: ISOCountry) => {
    setSelectedCountryConfig(countryItem);
    setFormData((prev) => ({
      ...prev,
      country: countryItem.name,
      countryCode: countryItem.code,
      phoneCountryCode: countryItem.dialCode,
      postalCode: "",
      city: "",
      stateOrProvince: ""
    }));

    setErrors((prev) => ({ ...prev, country: "", phone: "", postalCode: "", city: "" }));
    setIsCountryDropdownOpen(false);
    setCountrySearch("");
    setLookupFeedback(null);
  };

  // Select Nationality
  const handleSelectNationality = (nat: string) => {
    setFormData((prev) => ({ ...prev, nationality: nat }));
    setIsNationalityDropdownOpen(false);
    setNationalitySearch("");
  };

  // Password Strength computation
  const pwdStrength = getPasswordStrength(formData.password);

  // Field validation rules
  const validateFieldRule = (field: string, value: any, currentData = formData): string => {
    switch (field) {
      case "firstName": {
        if (!value || !value.trim()) return "First name is required.";
        const nameVal = value.trim();
        if (!/^[A-Za-z\s'-]+$/.test(nameVal)) return "First name must contain letters, spaces, hyphens, or apostrophes only.";
        if (nameVal.length < 2 || nameVal.length > 50) return "First name must be between 2 and 50 characters.";
        return "";
      }

      case "lastName": {
        if (!value || !value.trim()) return "Last name is required.";
        const nameVal = value.trim();
        if (!/^[A-Za-z\s'-]+$/.test(nameVal)) return "Last name must contain letters, spaces, hyphens, or apostrophes only.";
        if (nameVal.length < 2 || nameVal.length > 50) return "Last name must be between 2 and 50 characters.";
        return "";
      }

      case "email": {
        if (!value || !value.trim()) return "Email address is required.";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) return "Please enter a valid RFC-compliant email address (e.g. name@domain.com).";
        return "";
      }

      case "phone": {
        if (!value || !value.trim()) return "Phone / Mobile number is required.";
        const cleanDigits = value.replace(/\D/g, "");
        if (!cleanDigits) return "Phone number must contain numbers only.";

        try {
          const fullPhone = `${currentData.phoneCountryCode}${cleanDigits}`;
          const phoneNumberObj = parsePhoneNumberFromString(fullPhone, currentData.countryCode);
          if (!phoneNumberObj || !phoneNumberObj.isValid()) {
            return `Invalid phone number for ${selectedCountryConfig.name}. Example: ${selectedCountryConfig.examplePhone}`;
          }
        } catch (e) {
          if (cleanDigits.length < 6 || cleanDigits.length > 15) {
            return "Phone number must be between 6 and 15 digits.";
          }
        }
        return "";
      }

      case "password": {
        if (!value) return "Account password is required.";
        if (value.length < 8) return "Password must be at least 8 characters long.";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter (A-Z).";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter (a-z).";
        if (!/\d/.test(value)) return "Password must contain at least one number (0-9).";
        if (!/[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return "Password must contain at least one special character (e.g. @$!%*?).";
        return "";
      }

      case "confirmPassword": {
        if (!value) return "Please confirm your password.";
        if (value !== currentData.password) return "Passwords do not match.";
        return "";
      }

      case "dob": {
        if (!value) return "Date of birth is required.";
        const dobDate = new Date(value);
        if (isNaN(dobDate.getTime())) return "Please enter a valid date of birth.";
        if (dobDate > new Date()) return "Date of birth cannot be in the future.";
        return "";
      }

      case "country": {
        if (!value) return "Country / Region of residence is required.";
        return "";
      }

      case "addressLine1": {
        if (!value || !value.trim()) return "Address Line 1 is required.";
        if (value.trim().length < 3) return "Address Line 1 must be at least 3 characters.";
        return "";
      }

      case "city": {
        if (!value || !value.trim()) return `${selectedCountryConfig.cityLabel} is required.`;
        return "";
      }

      case "postalCode": {
        if (!value || !value.trim()) return `${selectedCountryConfig.postalLabel} is required.`;
        const cleanPin = value.trim();
        if (selectedCountryConfig.postalRegex && !selectedCountryConfig.postalRegex.test(cleanPin)) {
          return selectedCountryConfig.postalErrorMsg || `Invalid ${selectedCountryConfig.postalLabel} format.`;
        }
        return "";
      }

      default:
        return "";
    }
  };

  // Perform International Postal Code Auto-Fill (500ms Debounced)
  const triggerDebouncedPostalLookup = (pincode: string, countryCode: string, countryName: string) => {
    if (postalDebounceRef.current) {
      clearTimeout(postalDebounceRef.current);
    }

    const cleanPin = pincode.trim().replace(/\s+/g, "");

    // Validate format regex first before calling API
    if (selectedCountryConfig.postalRegex && !selectedCountryConfig.postalRegex.test(cleanPin)) {
      setLookupFeedback(null);
      return;
    }

    postalDebounceRef.current = setTimeout(async () => {
      setIsAutoFillingPin(true);
      setLookupFeedback(null);

      const result = await lookupPostalAddress(cleanPin, countryCode, countryName);
      setIsAutoFillingPin(false);

      if (result && (result.city || result.state)) {
        setFormData((prev) => ({
          ...prev,
          city: result.city || prev.city,
          stateOrProvince: result.state || prev.stateOrProvince
        }));
        setLookupFeedback(`Auto-filled via ${result.source.toUpperCase()}`);
        setErrors((prev) => ({ ...prev, city: "", postalCode: "" }));
      } else {
        setLookupFeedback("Address not found automatically. Please enter City and State manually.");
      }
    }, 500);
  };

  const handleFieldChange = (field: string, value: any) => {
    const nextFormData = { ...formData, [field]: value };
    setFormData(nextFormData);

    if (field === "postalCode") {
      triggerDebouncedPostalLookup(value, formData.countryCode, formData.country);
    }

    if (touched[field]) {
      const fieldErr = validateFieldRule(field, value, nextFormData);
      setErrors((prev) => ({ ...prev, [field]: fieldErr }));

      if (field === "password" && touched.confirmPassword) {
        const confirmErr = validateFieldRule("confirmPassword", nextFormData.confirmPassword, nextFormData);
        setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateFieldRule(field, formData[field as keyof typeof formData], formData);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validateAllFields = (): boolean => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "dob",
      "country",
      "addressLine1",
      "city",
      "postalCode"
    ];
    const allTouched: Record<string, boolean> = {};
    const newErrors: Record<string, string> = {};

    requiredFields.forEach((f) => {
      allTouched[f] = true;
      const err = validateFieldRule(f, formData[f as keyof typeof formData], formData);
      if (err) newErrors[f] = err;
    });

    setTouched((prev) => ({ ...prev, ...allTouched }));
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateAllFields()) {
      triggerToast("Validation Warning", "Please fix all highlighted errors before submitting.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      const cleanPhone = formData.phone.replace(/\D/g, "");
      const fullPhone = cleanPhone ? `${formData.phoneCountryCode || "+91"}${cleanPhone}` : "";

      const textData = {
        ...formData,
        phone: fullPhone,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        address: `${formData.addressLine1}${formData.addressLine2 ? ", " + formData.addressLine2 : ""}`,
        state: formData.stateOrProvince
      };

      payload.append("formData", JSON.stringify(textData));

      const res = await fetch(`${API_V1_URL}/auth/register-applicant`, {
        method: "POST",
        body: payload
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || json.message || "Registration failed.");
      }

      triggerToast("Registration Complete!", `Applicant account registered successfully. Redirecting to login...`, "success");

      setTimeout(() => {
        if (onSuccessSubmit) {
          onSuccessSubmit(json.data);
        } else if (onClose) {
          onClose();
        } else {
          window.location.href = "/login";
        }
      }, 1500);
    } catch (err: any) {
      triggerToast("Registration Error", err.message || "Failed to register applicant.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (field: string, extraClasses: string = "") => {
    const hasError = !!errors[field];
    const isValid = touched[field] && !hasError && !!formData[field as keyof typeof formData];

    return `w-full text-xs px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 focus:outline-none ${
      hasError
        ? "bg-rose-50/70 border-2 border-rose-400 text-rose-900 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/15 shadow-xs placeholder:text-rose-300"
        : isValid
        ? "bg-emerald-50/40 border-2 border-emerald-400 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
        : "bg-white border border-slate-200 text-slate-900 focus:border-[#4848F7] focus:ring-4 focus:ring-[#4848F7]/15"
    } ${extraClasses}`;
  };

  // Filtered Country List for Search
  const filteredCountries = countriesList.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch)
  );

  // Filtered Nationality List for Search
  const filteredNationalities = NATIONALITIES_LIST.filter((n) =>
    n.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Dynamic Toast Notification */}
      {toastConfig && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-start gap-3 p-4 rounded-2xl shadow-xl max-w-md border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toastConfig.type === "success"
              ? "bg-emerald-900 text-white border-emerald-700"
              : "bg-rose-900 text-white border-rose-700"
          }`}
        >
          {toastConfig.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs">
            <h4 className="font-bold">{toastConfig.title}</h4>
            {toastConfig.description && (
              <p className="mt-1 opacity-90 leading-relaxed">{toastConfig.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#4848F7] to-indigo-700 text-white p-6 sm:p-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Applicant Registration</h1>
                <p className="text-xs text-indigo-100/90 mt-0.5 font-medium">
                  Global Single Sign-Up Node (Multi-Provider Address Validation Engine)
                </p>
              </div>
            </div>

            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Login
              </button>
            ) : (
              <a
                href="/login"
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Login
              </a>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Personal Credentials & Identity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-[#4848F7]" /> Personal Identity & Account Credentials
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">* Required Fields</span>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name (e.g. John)"
                  value={formData.firstName}
                  onChange={(e) => handleFieldChange("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  className={getInputClassName("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name (e.g. Smith)"
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  className={getInputClassName("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={getInputClassName("email")}
              />
              {errors.email && (
                <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Account Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 8 chars (Uppercase, Lowercase, Number, Symbol)"
                    value={formData.password}
                    onChange={(e) => handleFieldChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={getInputClassName("password", "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-600">Password Strength:</span>
                      <span className={pwdStrength.textColor}>{pwdStrength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                        style={{ width: pwdStrength.width }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-500 font-medium">
                      <div className={`flex items-center gap-1 ${pwdStrength.checks.length ? "text-emerald-600 font-bold" : ""}`}>
                        {pwdStrength.checks.length ? <Check className="w-3 h-3 text-emerald-500" /> : <span className="w-3 h-3">•</span>} 8+ characters
                      </div>
                      <div className={`flex items-center gap-1 ${pwdStrength.checks.capital && pwdStrength.checks.lowercase ? "text-emerald-600 font-bold" : ""}`}>
                        {pwdStrength.checks.capital && pwdStrength.checks.lowercase ? <Check className="w-3 h-3 text-emerald-500" /> : <span className="w-3 h-3">•</span>} Upper & lowercase
                      </div>
                      <div className={`flex items-center gap-1 ${pwdStrength.checks.number ? "text-emerald-600 font-bold" : ""}`}>
                        {pwdStrength.checks.number ? <Check className="w-3 h-3 text-emerald-500" /> : <span className="w-3 h-3">•</span>} One number (0-9)
                      </div>
                      <div className={`flex items-center gap-1 ${pwdStrength.checks.special ? "text-emerald-600 font-bold" : ""}`}>
                        {pwdStrength.checks.special ? <Check className="w-3 h-3 text-emerald-500" /> : <span className="w-3 h-3">•</span>} Special symbol (!@#$)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={getInputClassName("confirmPassword", "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Date of Birth, Gender, Nationality */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  max={maxDobDate}
                  value={formData.dob}
                  onChange={(e) => handleFieldChange("dob", e.target.value)}
                  onBlur={() => handleBlur("dob")}
                  className={getInputClassName("dob")}
                />
                {errors.dob && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.dob}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleFieldChange("gender", e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:border-[#4848F7] cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Searchable Nationality Dropdown */}
              <div className="relative" ref={nationalityDropdownRef}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nationality <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsNationalityDropdownOpen(!isNationalityDropdownOpen)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium text-left flex items-center justify-between focus:outline-none focus:border-[#4848F7] cursor-pointer"
                >
                  <span>{formData.nationality}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isNationalityDropdownOpen && (
                  <div className="absolute z-40 top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search nationality..."
                        value={nationalitySearch}
                        onChange={(e) => setNationalitySearch(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#4848F7]"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                      {filteredNationalities.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400">No nationality found</div>
                      ) : (
                        filteredNationalities.map((nat) => (
                          <button
                            key={nat}
                            type="button"
                            onClick={() => handleSelectNationality(nat)}
                            className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition ${
                              formData.nationality === nat
                                ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <span>{nat}</span>
                            {formData.nationality === nat && <Check className="w-3.5 h-3.5 text-[#4848F7]" />}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Residency, Phone & Dynamic Address */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#4848F7]" /> Country of Residence & Dynamic Address
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">REST Countries Metadata</span>
            </div>

            {/* Country / Region Dropdown (PLACED AT TOP OF ADDRESS & PHONE SECTION) */}
            <div className="relative" ref={countryDropdownRef}>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Country / Region of Residence <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className={`w-full text-xs px-3.5 py-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                  errors.country
                    ? "border-rose-400 bg-rose-50/40 text-rose-900"
                    : "border-slate-200 bg-slate-50/80 hover:bg-slate-100/70 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{selectedCountryConfig.flag}</span>
                  <span className="font-bold text-slate-900">{selectedCountryConfig.name}</span>
                  <span className="text-[11px] font-mono text-slate-400">({selectedCountryConfig.code})</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {isCountryDropdownOpen && (
                <div className="absolute z-40 top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search country name, ISO code, or dial code..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#4848F7]"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
                    {filteredCountries.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">No country matching search</div>
                    ) : (
                      filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleSelectCountry(c)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition ${
                            formData.countryCode === c.code
                              ? "bg-[#EEF2FF] text-[#4848F7] font-bold"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span>{c.flag}</span>
                            <span>{c.name}</span>
                          </div>
                          <span className="font-mono text-slate-400 text-[11px]">{c.dialCode}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Number Input (Auto-synced to Selected Country & Validated via libphonenumber-js) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone / Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.phoneCountryCode}
                  onChange={(e) => handleFieldChange("phoneCountryCode", e.target.value)}
                  className="w-32 text-xs px-2.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:outline-none focus:border-[#4848F7] cursor-pointer shrink-0"
                >
                  {countriesList.map((c) => (
                    <option key={c.code} value={c.dialCode}>
                      {c.flag} {c.code} ({c.dialCode})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder={`e.g. ${selectedCountryConfig.examplePhone}`}
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={getInputClassName("phone", "flex-1")}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Address Line 1 & Address Line 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Address Line 1 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="address-line1"
                  placeholder="Street address, P.O. box, building"
                  value={formData.addressLine1}
                  onChange={(e) => handleFieldChange("addressLine1", e.target.value)}
                  onBlur={() => handleBlur("addressLine1")}
                  className={getInputClassName("addressLine1")}
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.addressLine1}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  autoComplete="address-line2"
                  placeholder="Apt, suite, unit, floor"
                  value={formData.addressLine2}
                  onChange={(e) => handleFieldChange("addressLine2", e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:border-[#4848F7]"
                />
              </div>
            </div>

            {/* Dynamic Country Address Fields (Postal Code, City, State/Province) */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#4848F7]" /> Dynamic Format for {selectedCountryConfig.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Zippopotam & Nominatim Auto-Fill
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Dynamic Postal Code Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {selectedCountryConfig.postalLabel} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="postal-code"
                      placeholder={selectedCountryConfig.postalPlaceholder}
                      value={formData.postalCode}
                      onChange={(e) => handleFieldChange("postalCode", e.target.value)}
                      onBlur={() => handleBlur("postalCode")}
                      className={`w-full text-xs px-3 py-2 rounded-lg border font-mono text-slate-900 font-bold focus:outline-none ${
                        errors.postalCode
                          ? "border-rose-400 bg-rose-50/50 text-rose-900"
                          : touched.postalCode && formData.postalCode && !errors.postalCode
                          ? "border-emerald-400 bg-emerald-50/30"
                          : "border-slate-200 bg-white focus:border-[#4848F7]"
                      }`}
                    />
                    {isAutoFillingPin && (
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-[#4848F7] border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  {errors.postalCode && (
                    <p className="mt-1 text-[10px] font-medium text-rose-600 flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" /> <span>{errors.postalCode}</span>
                    </p>
                  )}
                </div>

                {/* Dynamic City Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {selectedCountryConfig.cityLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="address-level2"
                    placeholder={selectedCountryConfig.cityLabel}
                    value={formData.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    onBlur={() => handleBlur("city")}
                    className={`w-full text-xs px-3 py-2 rounded-lg border font-semibold text-slate-800 focus:outline-none ${
                      errors.city
                        ? "border-rose-400 bg-rose-50/50 text-rose-900"
                        : touched.city && formData.city && !errors.city
                        ? "border-emerald-400 bg-emerald-50/30"
                        : "border-slate-200 bg-white focus:border-[#4848F7]"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-[10px] font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.city}
                    </p>
                  )}
                </div>

                {/* Dynamic State / Province / County Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {selectedCountryConfig.stateLabel}
                  </label>

                  {selectedCountryConfig.stateOptions && selectedCountryConfig.stateOptions.length > 0 ? (
                    <select
                      value={formData.stateOrProvince}
                      onChange={(e) => handleFieldChange("stateOrProvince", e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
                    >
                      <option value="">Select {selectedCountryConfig.stateLabel}</option>
                      {selectedCountryConfig.stateOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      autoComplete="address-level1"
                      placeholder={selectedCountryConfig.stateLabel}
                      value={formData.stateOrProvince}
                      onChange={(e) => handleFieldChange("stateOrProvince", e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:border-[#4848F7]"
                    />
                  )}
                </div>
              </div>

              {/* Feedback Note on Postal Lookup */}
              {lookupFeedback && (
                <div className="p-2 text-[10px] font-medium text-slate-500 bg-slate-100 rounded-lg flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{lookupFeedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-medium">
              Already registered?{" "}
              {onClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="font-bold text-[#4848F7] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              ) : (
                <a href="/login" className="font-bold text-[#4848F7] hover:underline">
                  Sign In
                </a>
              )}
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#4848F7] hover:bg-[#3737d6] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#4848F7]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
