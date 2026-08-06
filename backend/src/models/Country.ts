import mongoose, { Schema, Document } from "mongoose";

export interface ICountry extends Document {
  countryId: string;
  name: string;
  code: string;
  flag: string;
  continent: string;
  capital?: string;
  currency?: string;
  timeZone?: string;
  visaAvailable: boolean;
  processingTime: string;
  startingFee: number;
  availableCategories: string[];
  availableVisaTypes: string[];
  requiredDocuments: string[];
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema: Schema = new Schema(
  {
    countryId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    flag: { type: String, default: "🌐" },
    continent: { type: String, required: true, default: "Asia" },
    capital: { type: String, default: "" },
    currency: { type: String, default: "USD ($)" },
    timeZone: { type: String, default: "GMT+0" },
    visaAvailable: { type: Boolean, default: true },
    processingTime: { type: String, default: "15 Days" },
    startingFee: { type: Number, default: 8500 },
    availableCategories: { type: [String], default: ["Tourist Visa", "Business Visa", "Student & Study Visa", "Work & Employment Permit"] },
    availableVisaTypes: { type: [String], default: ["Schengen Tourist", "US B1/B2 Tourist"] },
    requiredDocuments: { type: [String], default: ["Passport", "Passport Photograph", "Bank Statement", "Travel Insurance"] },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.models.Country || mongoose.model<ICountry>("Country", CountrySchema);
