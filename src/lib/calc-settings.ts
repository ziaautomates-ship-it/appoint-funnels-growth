export type CalcKind = "email" | "sms" | "meta" | "call";

export type ExtraItem = {
  id: string;
  label: string;
  amount: number;
  bucket: "one-time" | "campaign" | "monthly" | "free";
  appliesTo: "all" | CalcKind;
};

export type CalcSettings = {
  // Data / outreach pricing
  leadPricePer10k: number;
  validationPricePer10k: number;
  smsSendPricePer10k: number;
  personalizationPricePer10k: number;
  // Phone numbers
  phoneNumberPrice: number;
  minPhoneNumbers: number;
  smsPerNumberPerDay: number;
  smsAccountValue: number;
  // Email infrastructure
  mailboxPrice: number;
  domainPrice: number;
  instantlyPlanPrice: number;
  emailPersonalizationPricePer10k: number;
  ownServersValue: number;
  noManagementFeeValue: number;
  minMailboxes: number;
  emailsPerMailboxPerDay: number;
  // Setup fees
  usSetupFee: number;
  ukSetupFee: number;
  // Recurring + commission
  monthlyRecurring: number;
  commissionPct: number;
  // Guarantees
  smsApptsPer10k: number;
  emailApptsPer10k: number;
  apptsPerClient: number;
  emailRoi: number;
  smsRoi: number;
  callRoi: number;
  metaRoi: number; // 0 = not finalised / configurable
  // Timelines (days)
  timelineEmail: number;
  timelineSms: number;
  timelineMeta: number;
  timelineCall: number;
  // Meta Ads assumptions
  metaCostPerLead: number;
  metaApptRate: number; // %
  metaCloseRate: number; // %
  // Call centre pricing / assumptions
  callCostPerCall: number;
  callAgentHourlyRate: number;
  callConnectRate: number; // %
  callApptRate: number; // % of connections
  callCloseRate: number; // % of appointments
  callApptsPerClientRatio: number;
  // Custom tools / services added from the backend
  extras: ExtraItem[];
};

export const DEFAULT_SETTINGS: CalcSettings = {
  leadPricePer10k: 25,
  validationPricePer10k: 25,
  smsSendPricePer10k: 120,
  personalizationPricePer10k: 10,
  phoneNumberPrice: 1.15,
  minPhoneNumbers: 20,
  smsPerNumberPerDay: 30,
  smsAccountValue: 800,
  mailboxPrice: 3,
  domainPrice: 10,
  instantlyPlanPrice: 50,
  emailPersonalizationPricePer10k: 10,
  ownServersValue: 0,
  noManagementFeeValue: 1000,
  minMailboxes: 10,
  emailsPerMailboxPerDay: 30,
  usSetupFee: 2500,
  ukSetupFee: 2000,
  monthlyRecurring: 45,
  commissionPct: 15,
  smsApptsPer10k: 30,
  emailApptsPer10k: 20,
  apptsPerClient: 10,
  emailRoi: 6,
  smsRoi: 9,
  callRoi: 5,
  metaRoi: 0,
  timelineEmail: 45,
  timelineSms: 45,
  timelineMeta: 45,
  timelineCall: 45,
  metaCostPerLead: 12,
  metaApptRate: 35,
  metaCloseRate: 25,
  callCostPerCall: 0.35,
  callAgentHourlyRate: 10,
  callConnectRate: 25,
  callApptRate: 15,
  callCloseRate: 20,
  callApptsPerClientRatio: 10,
  extras: [],
};

const KEY = "af-calc-settings-v1";

export function loadSettings(): CalcSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<CalcSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed, extras: parsed.extras ?? [] };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: CalcSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export const COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "United Arab Emirates",
  "Other",
] as const;

export function currencyFor(country: string) {
  return country === "United Kingdom" ? "£" : "$";
}

export function setupFeeFor(country: string, s: CalcSettings) {
  if (country === "United States") return s.usSetupFee;
  if (country === "United Kingdom") return s.ukSetupFee;
  return 0;
}
