import {
  currencyFor,
  setupFeeFor,
  type CalcKind,
  type CalcSettings,
} from "./calc-settings";

export type Line = { label: string; amount: number; note?: string };

export type Inputs = {
  kind: CalcKind;
  country: string;
  // email + sms volume
  leadQty: number;
  mailboxes: number;
  smsQty: number;
  phoneNumbers: number;
  // meta
  adSpend: number;
  costPerLead: number;
  metaApptRate: number;
  metaCloseRate: number;
  // call centre
  calls: number;
  costPerCall: number;
  connectRate: number;
  callApptRate: number;
  callCloseRate: number;
};

export type CalcResult = {
  currency: string;
  oneTime: Line[];
  campaign: Line[];
  monthly: Line[];
  free: Line[];
  oneTimeTotal: number;
  campaignTotal: number;
  monthlyTotal: number;
  total: number;
  funnel: { label: string; value: string }[];
  capacity: string[];
  appointments: number;
  clients: number;
  roi: number; // 0 = configurable / not finalised
  timeline: number;
  warnings: string[];
};

const r2 = (n: number) => Math.round(n * 100) / 100;

export function compute(inputs: Inputs, s: CalcSettings): CalcResult {
  const currency = currencyFor(inputs.country);
  const oneTime: Line[] = [];
  const campaign: Line[] = [];
  const monthly: Line[] = [];
  const free: Line[] = [];
  const funnel: { label: string; value: string }[] = [];
  const capacity: string[] = [];
  const warnings: string[] = [];

  const setup = setupFeeFor(inputs.country, s);
  if (setup > 0) {
    oneTime.push({
      label: `${inputs.country} setup & onboarding`,
      amount: setup,
      note: "One-time cost",
    });
  }

  let appointments = 0;
  let clients = 0;
  let roi = 0;
  let timeline = s.timelineSms;

  if (inputs.kind === "email") {
    const k = inputs.leadQty / 10000;
    campaign.push({ label: `Lead scraping (${inputs.leadQty.toLocaleString()} leads)`, amount: r2(k * s.leadPricePer10k), note: `${currency}${s.leadPricePer10k} per 10,000` });
    campaign.push({ label: `Email validation (${inputs.leadQty.toLocaleString()})`, amount: r2(k * s.validationPricePer10k), note: `${currency}${s.validationPricePer10k} per 10,000` });
    monthly.push({ label: `Mailboxes (${inputs.mailboxes})`, amount: r2(inputs.mailboxes * s.mailboxPrice), note: `${currency}${s.mailboxPrice} per mailbox / month` });
    if (inputs.mailboxes < s.minMailboxes) {
      warnings.push(`${inputs.mailboxes} mailboxes may not provide enough sending capacity for this campaign (recommended minimum ${s.minMailboxes}).`);
    }
    const perDay = inputs.mailboxes * s.emailsPerMailboxPerDay;
    capacity.push(`${inputs.mailboxes} mailboxes × ${s.emailsPerMailboxPerDay} emails/day = ${perDay.toLocaleString()} emails/day`);
    if (perDay > 0) capacity.push(`${inputs.leadQty.toLocaleString()} emails ≈ ${Math.ceil(inputs.leadQty / perDay)} sending days`);
    appointments = Math.round(k * s.emailApptsPer10k);
    clients = Math.floor(appointments / s.apptsPerClient);
    roi = s.emailRoi;
    timeline = s.timelineEmail;
    funnel.push({ label: "Leads contacted", value: inputs.leadQty.toLocaleString() });
    funnel.push({ label: "Guaranteed appointments", value: String(appointments) });
    funnel.push({ label: "Guaranteed clients", value: String(clients) });
  }

  if (inputs.kind === "sms") {
    const k = inputs.smsQty / 10000;
    campaign.push({ label: `Lead scraping (${inputs.smsQty.toLocaleString()} leads)`, amount: r2(k * s.leadPricePer10k), note: `${currency}${s.leadPricePer10k} per 10,000` });
    campaign.push({ label: `Number validation (${inputs.smsQty.toLocaleString()})`, amount: r2(k * s.validationPricePer10k), note: `${currency}${s.validationPricePer10k} per 10,000` });
    campaign.push({ label: `SMS sending (${inputs.smsQty.toLocaleString()} SMS)`, amount: r2(k * s.smsSendPricePer10k), note: `${currency}${s.smsSendPricePer10k} per 10,000` });
    campaign.push({ label: "Personalization credits", amount: r2(k * s.personalizationPricePer10k), note: `${currency}${s.personalizationPricePer10k} per 10,000` });
    monthly.push({ label: `Mobile phone numbers (${inputs.phoneNumbers})`, amount: r2(inputs.phoneNumbers * s.phoneNumberPrice), note: `${currency}${s.phoneNumberPrice} per number / month` });
    free.push({ label: "SMS Account (10DLC Verified)", amount: s.smsAccountValue, note: `${currency}${s.smsAccountValue.toLocaleString()} value with LLC — Included FREE` });
    if (inputs.phoneNumbers < s.minPhoneNumbers) {
      warnings.push(`${inputs.phoneNumbers} phone numbers may not provide enough sending capacity for the projected campaign (recommended minimum ${s.minPhoneNumbers}).`);
    }
    const perDay = inputs.phoneNumbers * s.smsPerNumberPerDay;
    capacity.push(`${inputs.phoneNumbers} numbers × ${s.smsPerNumberPerDay} SMS/day = ${perDay.toLocaleString()} SMS/day`);
    if (perDay > 0) capacity.push(`${inputs.smsQty.toLocaleString()} SMS ≈ ${Math.ceil(inputs.smsQty / perDay)} sending days`);
    appointments = Math.round(k * s.smsApptsPer10k);
    clients = Math.floor(appointments / s.apptsPerClient);
    roi = s.smsRoi;
    timeline = s.timelineSms;
    funnel.push({ label: "SMS sent", value: inputs.smsQty.toLocaleString() });
    funnel.push({ label: "Daily sending capacity", value: `${perDay.toLocaleString()} SMS/day` });
    funnel.push({ label: "Guaranteed appointments", value: String(appointments) });
    funnel.push({ label: "Guaranteed clients", value: String(clients) });
  }

  if (inputs.kind === "meta") {
    campaign.push({ label: "Meta ad spend", amount: r2(inputs.adSpend), note: "Paid directly to Meta — no commission applied" });
    const leads = inputs.costPerLead > 0 ? Math.floor(inputs.adSpend / inputs.costPerLead) : 0;
    appointments = Math.round((leads * inputs.metaApptRate) / 100);
    clients = Math.round((appointments * inputs.metaCloseRate) / 100);
    roi = s.metaRoi;
    timeline = s.timelineMeta;
    funnel.push({ label: "Ad spend", value: `${currency}${inputs.adSpend.toLocaleString()}` });
    funnel.push({ label: "Cost per lead", value: `${currency}${inputs.costPerLead}` });
    funnel.push({ label: "Expected leads", value: leads.toLocaleString() });
    funnel.push({ label: `Appointment rate (${inputs.metaApptRate}%)`, value: String(appointments) });
    funnel.push({ label: `Close rate (${inputs.metaCloseRate}%)`, value: String(clients) });
  }

  if (inputs.kind === "call") {
    campaign.push({ label: `Calling cost (${inputs.calls.toLocaleString()} calls)`, amount: r2(inputs.calls * inputs.costPerCall), note: `${currency}${inputs.costPerCall} per call` });
    const connections = Math.round((inputs.calls * inputs.connectRate) / 100);
    appointments = Math.round((connections * inputs.callApptRate) / 100);
    clients = Math.round((appointments * inputs.callCloseRate) / 100);
    roi = s.callRoi;
    timeline = s.timelineCall;
    funnel.push({ label: "Calls", value: inputs.calls.toLocaleString() });
    funnel.push({ label: `Connections (${inputs.connectRate}%)`, value: connections.toLocaleString() });
    funnel.push({ label: `Appointments (${inputs.callApptRate}% of connections)`, value: String(appointments) });
    funnel.push({ label: `Clients (${inputs.callCloseRate}% close rate)`, value: String(clients) });
  }

  monthly.push({
    label: `Platform & management retainer`,
    amount: s.monthlyRecurring,
    note: `${currency}${s.monthlyRecurring}/month from Month 2 onward`,
  });

  for (const e of s.extras) {
    if (e.appliesTo !== "all" && e.appliesTo !== inputs.kind) continue;
    const line = { label: e.label, amount: r2(e.amount) };
    if (e.bucket === "one-time") oneTime.push(line);
    else if (e.bucket === "campaign") campaign.push(line);
    else if (e.bucket === "monthly") monthly.push(line);
    else free.push({ ...line, note: "Included FREE" });
  }

  const sum = (l: Line[]) => r2(l.reduce((a, b) => a + b.amount, 0));
  const oneTimeTotal = sum(oneTime);
  const campaignTotal = sum(campaign);
  const monthlyTotal = sum(monthly);

  return {
    currency,
    oneTime,
    campaign,
    monthly,
    free,
    oneTimeTotal,
    campaignTotal,
    monthlyTotal,
    total: r2(oneTimeTotal + campaignTotal + monthlyTotal),
    funnel,
    capacity,
    appointments,
    clients,
    roi,
    timeline,
    warnings,
  };
}
