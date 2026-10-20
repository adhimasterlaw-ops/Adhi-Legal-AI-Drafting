export type TemplateCategory =
  "Somasi" | "Gugatan" | "Kontrak" | "Surat Kuasa" | "Perjanjian" | "Lainnya";

export type VariableDefinition = {
  name: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "textarea";
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type DocumentTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  templateContent: string;
  variablesSchema: VariableDefinition[];
  isPremium: boolean;
  usageCount: number;
  rating: number;
};

export type PartyData = {
  name: string;
  ktp: string;
  birthPlace: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
  occupation: string;
};

export type CustomDetail = {
  id: string;
  label: string;
  type: "text" | "date" | "number";
  value: string;
};

export type DraftFormData = {
  firstParty: PartyData;
  secondParty: PartyData;
  sameParty: boolean;
  documentType: string;
  subject: string;
  amount: string;
  currency: "IDR" | "USD" | "EUR";
  startDate: string;
  endDate: string;
  location: string;
  chronology: string;
  customDetails: CustomDetail[];
};

export type SavedLegalDocument = {
  id: string;
  title: string;
  status: "draft" | "final";
  content: string;
  variables: DraftFormData;
  wizardStep: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
};

export const emptyParty = (): PartyData => ({
  name: "",
  ktp: "",
  birthPlace: "",
  birthDate: "",
  address: "",
  phone: "",
  email: "",
  occupation: "",
});

export const createEmptyDraft = (): DraftFormData => ({
  firstParty: emptyParty(),
  secondParty: emptyParty(),
  sameParty: false,
  documentType: "",
  subject: "",
  amount: "",
  currency: "IDR",
  startDate: "",
  endDate: "",
  location: "",
  chronology: "",
  customDetails: [],
});
