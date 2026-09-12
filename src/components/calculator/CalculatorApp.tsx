import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  Calculator as CalcIcon,
  Gift,
  Lock,
  Mail,
  MessageSquare,
  Percent,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Display, Reveal, SectionLabel } from "@/components/site/primitives";
import BackendPanel from "./BackendPanel";
import { compute, type Inputs } from "@/lib/calc-engine";
import {
  COUNTRIES,
  DEFAULT_SETTINGS,
  loadSettings,
  type CalcKind,
  type CalcSettings,
} from "@/lib/calc-settings";
import { cn } from "@/lib/utils";

const WEBHOOK =
  "https://ziabusinesssolutions11.app.n8n.cloud/webhook/5da7f52c-789b-4805-be64-fab73916ca28";

const TABS: { id: CalcKind; label: string; icon: typeof Mail }[] = [
  { id: "email", label: "Cold Email", icon: Mail },
  { id: "sms", label: "Cold SMS", icon: MessageSquare },
  { id: "meta", label: "Meta Ads", icon: Target },
  { id: "call", label: "Call Center", icon: Phone },
];

const field =
  "w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
const labelCls = "mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground";

function money(currency: string, n: number) {
  return `${currency}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function CalculatorApp() {
  const [settings, setSettings] = useState<CalcSettings>(DEFAULT_SETTINGS);
  const [backendOpen, setBackendOpen] = useState(false);
  const [kind, setKind] = useState<CalcKind>("sms");
  const [client, setClient] = useState({ name: "", company: "", email: "", country: "Pakistan" });
  const [showResults, setShowResults] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [revenuePerClose, setRevenuePerClose] = useState(1500);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState<Omit<Inputs, "kind" | "country">>({
    leadQty: 10000,
    mailboxes: 10,
    smsQty: 10000,
    phoneNumbers: 20,
    adSpend: 3000,
    costPerLead: 12,
    metaApptRate: 35,
    metaCloseRate: 25,
    calls: 10000,
    costPerCall: 0.35,
    connectRate: 25,
    callApptRate: 15,
    callCloseRate: 20,
    agents: 5,
    hoursPerAgent: 40,
  });

  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    setInputs((p) => ({
      ...p,
      phoneNumbers: s.minPhoneNumbers,
      mailboxes: s.minMailboxes,
      costPerLead: s.metaCostPerLead,
      metaApptRate: s.metaApptRate,
      metaCloseRate: s.metaCloseRate,
      costPerCall: s.callCostPerCall,
      connectRate: s.callConnectRate,
      callApptRate: s.callApptRate,
      callCloseRate: s.callCloseRate,
        agents: 5,
        hoursPerAgent: 40,
    }));
  }, []);

  const full: Inputs = useMemo(
    () => ({ ...inputs, kind, country: client.country }),
    [inputs, kind, client.country],
  );
  const result = useMemo(() => compute(full, settings), [full, settings]);

  const clientComplete =
    client.name.trim() !== "" &&
    client.company.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email) &&
    client.country !== "";

  const companyLabel = client.company.trim() || "your company";
  const nameLabel = client.name.trim() || "there";

  function onCalculate() {
    setShowResults(true);
    setSendState("idle");
    requestAnimationFrame(() => {
      const el = resultsRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 96; // sticky header offset
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  async function sendProposal() {
    if (!clientComplete || sendState === "sending") return;
    setSendState("sending");
    const payload = {
      submittedAt: new Date().toISOString(),
      client: {
        name: client.name,
        companyName: client.company,
        email: client.email,
        country: client.country,
      },
      calculatorSelected: kind,
      calculatorLabel: TABS.find((t) => t.id === kind)?.label,
      inputs: {
        leadQuantity: inputs.leadQty,
        mailboxes: inputs.mailboxes,
        smsQuantity: inputs.smsQty,
        phoneNumbers: inputs.phoneNumbers,
        adSpend: inputs.adSpend,
        costPerLead: inputs.costPerLead,
        metaAppointmentRate: inputs.metaApptRate,
        metaCloseRate: inputs.metaCloseRate,
        calls: inputs.calls,
        costPerCall: inputs.costPerCall,
        connectionRate: inputs.connectRate,
        callAppointmentRate: inputs.callApptRate,
        callCloseRate: inputs.callCloseRate,
        agents: inputs.agents,
        hoursPerAgent: inputs.hoursPerAgent,
      },
      pricing: {
        currency: result.currency,
        leadPricePer10k: settings.leadPricePer10k,
        validationPricePer10k: settings.validationPricePer10k,
        smsSendPricePer10k: settings.smsSendPricePer10k,
        personalizationPricePer10k: settings.personalizationPricePer10k,
        phoneNumberPrice: settings.phoneNumberPrice,
        phoneNumbersMonthlyCost:
          Math.round(inputs.phoneNumbers * settings.phoneNumberPrice * 100) / 100,
        monthlyRecurringFee: settings.monthlyRecurring,
        mailboxPrice: settings.mailboxPrice,
        mailboxMonthlyCost: Math.round(inputs.mailboxes * settings.mailboxPrice * 100) / 100,
        domainPrice: settings.domainPrice,
        domainCost: Math.round(inputs.mailboxes * settings.domainPrice * 100) / 100,
        instantlyPlanPrice: settings.instantlyPlanPrice,
        emailPersonalizationPricePer10k: settings.emailPersonalizationPricePer10k,
        callAgentHourlyRate: settings.callAgentHourlyRate,
        callAgentLaborCost:
          Math.round(inputs.agents * inputs.hoursPerAgent * settings.callAgentHourlyRate * 100) / 100,
        setupFee: result.oneTimeTotal,
      },
      investment: {
        oneTimeCosts: result.oneTime,
        campaignCosts: result.campaign,
        monthlyCosts: result.monthly,
        includedFree: result.free,
        oneTimeInvestment: result.oneTimeTotal,
        campaignInvestment: result.campaignTotal,
        monthlyInvestment: result.monthlyTotal,
        totalInvestment: result.total,
      },
      guarantees: {
        guaranteedAppointments: result.appointments,
        guaranteedClients: result.clients,
        roiGuarantee: result.roi > 0 ? `${result.roi}x` : "Configurable — not finalised",
        timelineDays: result.timeline,
      },
      revenuePerClosedClient: revenuePerClose,
      expectedRevenueRange: { low: expectedRevenueLow, high: expectedRevenue },
      funnel: result.funnel,
      capacity: result.capacity,
      warnings: result.warnings,
      commissionPercentage: settings.commissionPct,
      smsAccountIncludedFreeValue: settings.smsAccountValue,
      settingsSnapshot: settings,
    };
    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSendState(res.ok ? "sent" : "error");
    } catch {
      setSendState("error");
    }
  }

  const numSet = (k: keyof typeof inputs) => (v: number) =>
    setInputs((p) => ({ ...p, [k]: v }));

  const expectedRevenue = Math.round(result.clients * revenuePerClose);
  const expectedRevenueLow = Math.round(Math.max(0, result.clients - 1) * revenuePerClose);

  const chips: { value: string; label: string }[] =
    kind === "email"
      ? [
          { value: `${settings.emailsPerMailboxPerDay}/day`, label: "Per mailbox" },
          { value: `${settings.emailApptsPer10k}`, label: "Appts / 10k" },
          { value: `${settings.emailRoi}x`, label: "Min ROI" },
        ]
      : kind === "sms"
        ? [
            { value: `${settings.smsPerNumberPerDay}/day`, label: "Per number" },
            { value: `${settings.smsApptsPer10k}`, label: "Appts / 10k" },
            { value: `${settings.smsRoi}x`, label: "Min ROI" },
          ]
        : kind === "meta"
          ? [
              { value: `${inputs.metaApptRate}%`, label: "Appt rate" },
              { value: `${inputs.metaCloseRate}%`, label: "Close rate" },
              { value: settings.metaRoi > 0 ? `${settings.metaRoi}x` : "TBC", label: "Min ROI" },
            ]
          : [
              { value: `${inputs.connectRate}%`, label: "Connect rate" },
              { value: `${inputs.callCloseRate}%`, label: "Close rate" },
              { value: `${settings.callRoi}x`, label: "Min ROI" },
            ];

  return (
    <>
      <section className="relative pt-32 pb-10 lg:pt-40">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionLabel>Calculator</SectionLabel>
            <Display as="h1" className="mt-6">
              Build Your
              <br />
              Growth Plan.
            </Display>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Pick a channel, set your volume and see the exact investment, guaranteed appointments
              and ROI — then send the proposal.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setKind(t.id);
                  setShowResults(false);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300",
                  kind === t.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setBackendOpen(true)}
              className="ml-auto inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-foreground"
            >
              <Lock className="h-3.5 w-3.5" /> Backend
            </button>
          </div>
        </div>
      </section>

      {/* Inputs + client info */}
      <section className="pb-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[1.75rem] border border-border bg-surface/60 p-7 backdrop-blur-xl">
            <h2 className="text-lg font-semibold">
              {TABS.find((t) => t.id === kind)?.label} inputs
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {chips.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-border bg-background/50 px-3 py-4 text-center"
                >
                  <p className="font-display text-2xl leading-none text-primary">{c.value}</p>
                  <p className="mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {c.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-1">
              {kind === "email" && (
                <>
                  <SliderRow label="Number of mailboxes" value={inputs.mailboxes} min={1} max={100} step={1} onChange={numSet("mailboxes")} format={(v) => `${v}`} hint={`Recommended minimum: ${settings.minMailboxes}`} />
                  <SliderRow label="Leads / emails" value={inputs.leadQty} min={1000} max={200000} step={1000} onChange={numSet("leadQty")} format={(v) => v.toLocaleString()} hint="Scraping, verification and personalization scale per 10,000" />
                </>
              )}
              {kind === "sms" && (
                <>
                  <SliderRow label="Mobile phone numbers" value={inputs.phoneNumbers} min={1} max={200} step={1} onChange={numSet("phoneNumbers")} format={(v) => `${v}`} hint={`Recommended minimum: ${settings.minPhoneNumbers}`} />
                  <SliderRow label="SMS / leads" value={inputs.smsQty} min={1000} max={200000} step={1000} onChange={numSet("smsQty")} format={(v) => v.toLocaleString()} hint="All sending costs scale per 10,000" />
                </>
              )}
              {kind === "meta" && (
                <>
                  <SliderRow label="Ad spend" value={inputs.adSpend} min={100} max={100000} step={100} onChange={numSet("adSpend")} format={(v) => `${result.currency}${v.toLocaleString()}`} />
                  <SliderRow label="Cost per lead" value={inputs.costPerLead} min={0.5} max={100} step={0.5} onChange={numSet("costPerLead")} format={(v) => `${result.currency}${v}`} />
                  <SliderRow label="Appointment rate" value={inputs.metaApptRate} min={1} max={100} step={1} onChange={numSet("metaApptRate")} format={(v) => `${v}%`} />
                  <SliderRow label="Close rate" value={inputs.metaCloseRate} min={1} max={100} step={1} onChange={numSet("metaCloseRate")} format={(v) => `${v}%`} />
                </>
              )}
              {kind === "call" && (
                <>
                  <SliderRow label="Number of agents" value={inputs.agents} min={1} max={50} step={1} onChange={numSet("agents")} format={(v) => `${v}`} />
                  <SliderRow label="Hours per agent" value={inputs.hoursPerAgent} min={1} max={200} step={1} onChange={numSet("hoursPerAgent")} format={(v) => `${v} hours`} hint={`${result.currency}${settings.callAgentHourlyRate} per agent-hour`} />
                  <SliderRow label="Number of calls" value={inputs.calls} min={100} max={200000} step={100} onChange={numSet("calls")} format={(v) => v.toLocaleString()} />
                  <SliderRow label="Cost per call" value={inputs.costPerCall} min={0.05} max={5} step={0.05} onChange={numSet("costPerCall")} format={(v) => `${result.currency}${v.toFixed(2)}`} />
                  <SliderRow label="Connection rate" value={inputs.connectRate} min={1} max={100} step={1} onChange={numSet("connectRate")} format={(v) => `${v}%`} />
                  <SliderRow label="Appointment rate (of connections)" value={inputs.callApptRate} min={1} max={100} step={1} onChange={numSet("callApptRate")} format={(v) => `${v}%`} />
                  <SliderRow label="Close rate" value={inputs.callCloseRate} min={1} max={100} step={1} onChange={numSet("callCloseRate")} format={(v) => `${v}%`} />
                </>
              )}
              <SliderRow
                label="Revenue per closed client"
                value={revenuePerClose}
                min={100}
                max={50000}
                step={100}
                onChange={setRevenuePerClose}
                format={(v) => `${result.currency}${v.toLocaleString()}`}
                hint="Used to project your expected revenue"
              />
            </div>

            {/* Live funnel readout */}
            <div className="mt-6 rounded-2xl border border-border bg-background/50 p-5">
              <div className="space-y-2.5">
                {result.funnel.map((f) => (
                  <div key={f.label} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-semibold text-foreground">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total investment</span>
                <span className="font-semibold text-foreground">
                  {money(result.currency, result.total)}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <span className="text-sm font-semibold">Expected revenue</span>
                <span className="font-display text-3xl leading-none text-primary">
                  {money(result.currency, expectedRevenueLow)} –{" "}
                  {money(result.currency, expectedRevenue)}
                </span>
              </div>
            </div>


            {result.capacity.length > 0 && (
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {result.capacity.map((c) => (
                  <li key={c} className="flex gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            )}

            {result.warnings.map((w) => (
              <p key={w} className="mt-4 flex gap-2 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm text-foreground">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {w}
              </p>
            ))}

            {kind === "sms" && (
              <p className="mt-4 flex gap-2 text-sm text-muted-foreground">
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Tools: SMS Account (10DLC Verified) — {money("$", settings.smsAccountValue)} value with
                LLC, included FREE.
              </p>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-border bg-surface/60 p-7 backdrop-blur-xl">
            <h2 className="text-lg font-semibold">Client information</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Country means where you are based — not the country you want to target.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="cname">Client name</label>
                <input id="cname" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} placeholder="Jane Doe" className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="ccomp">Company name</label>
                <input id="ccomp" value={client.company} onChange={(e) => setClient({ ...client, company: e.target.value })} placeholder="Acme Ltd" className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="cemail">Email</label>
                <input id="cemail" type="email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} placeholder="jane@acme.com" className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="ccountry">Country</label>
                <select id="ccountry" value={client.country} onChange={(e) => setClient({ ...client, country: e.target.value })} className={field}>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {client.country === "United States" &&
                `United States: ${money("$", settings.usSetupFee)} one-time setup fee.`}
              {client.country === "United Kingdom" &&
                `United Kingdom: ${money("£", settings.ukSetupFee)} one-time setup fee.`}
              {client.country !== "United States" &&
                client.country !== "United Kingdom" &&
                `${client.country}: no setup or service charge.`}
            </p>

            <button
              type="button"
              onClick={onCalculate}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--glow-brand)]"
            >
              <CalcIcon className="h-4 w-4" /> Calculate
            </button>
          </div>
        </div>
      </section>

      {showResults && (
        <>
          {/* Investment */}
          <section ref={resultsRef} className="scroll-mt-28 py-16">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <SectionLabel>Your Investment</SectionLabel>
                <Display className="mt-6">Investment Breakdown.</Display>
                <p className="mt-5 max-w-xl text-base text-muted-foreground">
                  {nameLabel}, here is the full plan for {companyLabel} — every cost, clearly split.
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {result.funnel.map((f) => (
                    <div key={f.label} className="rounded-3xl border border-border bg-surface/60 p-6">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{f.label}</p>
                      <p className="display-xl mt-3 text-4xl">{f.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  <Bucket title="One-Time Costs" lines={result.oneTime} total={result.oneTimeTotal} currency={result.currency} empty="No setup or service charge for your country." />
                   <Bucket title="Tools Stack Investment" lines={result.campaign} total={result.campaignTotal} currency={result.currency} />
                   <Bucket title="Monthly Costs" lines={result.monthly} total={result.monthlyTotal} currency={result.currency} informational={kind === "email"} />
                  <div className="rounded-3xl border border-primary/40 bg-primary/10 p-7">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Included Free</h3>
                    <ul className="mt-5 space-y-3 text-sm">
                      {result.free.length === 0 && (
                        <li className="text-muted-foreground">Onboarding, campaign build and reporting included.</li>
                      )}
                      {result.free.map((f) => (
                        <li key={f.label} className="flex items-start justify-between gap-4">
                          <span>
                            {f.label}
                            {f.note && <span className="block text-xs text-muted-foreground">{f.note}</span>}
                          </span>
                           <span className="shrink-0 font-semibold">
                             {f.amount > 0 ? `${money(result.currency, f.amount)} value — FREE` : "Included FREE"}
                           </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-xs text-muted-foreground">
                      Included free items are never added to your investment total.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-border bg-surface/60 p-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total investment</p>
                    <p className="display-xl mt-3 text-6xl">{money(result.currency, result.total)}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                       One-time {money(result.currency, result.oneTimeTotal)} · Tools stack{" "}
                      {money(result.currency, result.campaignTotal)} · Monthly{" "}
                      {money(result.currency, result.monthlyTotal)}
                    </p>
                  </div>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    The {settings.commissionPct}% performance commission is not part of this total and
                    is never charged on ad spend, sending, data or tools.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Guarantee */}
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <SectionLabel>Guarantee</SectionLabel>
              <Display className="mt-6">Our Guarantee To {companyLabel}.</Display>
              <div className="mt-10 grid gap-5 lg:grid-cols-3">
                <GuaranteeCard icon={CalendarClock} title="Guarantee #1 — Booked Appointments"
                  body={`We guarantee a minimum of ${result.appointments} qualified appointments scheduled to your calendar.`} />
                <GuaranteeCard icon={Users} title="Guarantee #2 — Clients Converted"
                  body={`We guarantee ${result.clients} converted client${result.clients === 1 ? "" : "s"} from those appointments.`} />
                <GuaranteeCard icon={TrendingUp} title="Guarantee #3 — Minimum ROI"
                  body={
                    result.roi > 0
                      ? `Minimum ${result.roi}x ROI — for every ${result.currency}100 invested, you'll see at least ${result.currency}${result.roi * 100} back in closed revenue.`
                      : "Meta Ads ROI guarantee is configurable and will be confirmed with you before launch."
                  } />
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-3xl border border-border bg-surface/60 p-7 text-sm text-muted-foreground">
                <CalendarClock className="h-5 w-5 shrink-0 text-primary" />
                Campaign timeline: {result.timeline} days.
              </div>
            </div>
          </section>

          {/* Why we're different */}
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <SectionLabel>Why We&apos;re Different</SectionLabel>
              <Display className="mt-6">Built For {companyLabel}.</Display>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: BadgeCheck, title: "Guarantees in writing", body: `Every number in this proposal is calculated from your own inputs, ${nameLabel} — not a generic brochure figure.` },
                  { icon: Percent, title: "We only win when you win", body: `Our ${settings.commissionPct}% commission is charged on closed deals only, never on ${companyLabel}'s campaign spend.` },
                  { icon: ShieldCheck, title: "Full exclusivity", body: `Every appointment we generate belongs to ${companyLabel} alone.` },
                  { icon: Sparkles, title: "Done-for-you infrastructure", body: "Numbers, mailboxes, data, validation, copy and automations are all handled by our team." },
                  { icon: Target, title: "One proven system", body: "The same outreach framework, adapted to the channel that fits your market." },
                  { icon: TrendingUp, title: "Transparent reporting", body: "You see the sends, replies, appointments and revenue attributed to every campaign." },
                ].map((c) => (
                  <div key={c.title} className="rounded-3xl border border-border bg-surface/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold">{c.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Exclusivity */}
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="rounded-[1.75rem] border border-border bg-surface/60 p-8 sm:p-10">
                <SectionLabel>Exclusivity</SectionLabel>
                <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">Appointment Exclusivity Policy</h2>
                <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <li>All appointments belong exclusively to {companyLabel}.</li>
                  <li>
                    No appointment, lead, or prospect data generated during this engagement will be
                    shared with, sold to, transferred to, or used by Appoint Funnels or any third
                    party under any circumstances.
                  </li>
                  <li>Every booked appointment is delivered directly and solely to {companyLabel}.</li>
                  <li>
                    Appoint Funnels will not use any generated leads for its own outreach or for
                    another client.
                  </li>
                  <li>
                    All prospect data collected remains the intellectual property of {companyLabel}{" "}
                    upon project completion.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Commission */}
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="rounded-[1.75rem] border border-primary/40 bg-primary/10 p-8 sm:p-10">
                <SectionLabel>Commission</SectionLabel>
                <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">
                  Performance Commission — {settings.commissionPct}%
                </h2>
                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  Our commission is performance-based and is charged only after {companyLabel}{" "}
                  receives payment from the customer generated through the campaign. Appoint Funnels
                  charges a flat {settings.commissionPct}% commission on the original deal value
                  generated from leads produced through the campaign.
                </p>
                <h3 className="mt-8 text-base font-semibold">What We Don&apos;t Charge Commission On</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <li>No commission on referral-generated revenue from that customer.</li>
                  <li>No commission on later upsells or cross-sells to that customer.</li>
                  <li>
                    Commission applies only to the original deal generated from the original Appoint
                    Funnels opportunity.
                  </li>
                  <li>
                    Commission is calculated only on the original deal value from leads generated by
                    Appoint Funnels.
                  </li>
                  <li>Commission is due within 24 hours of payment confirmation.</li>
                  <li>
                    Late payment may result in active outreach being paused until the balance is
                    settled.
                  </li>
                  <li>
                    {kind === "email"
                      ? `${money(result.currency, settings.instantlyPlanPrice)}/month Instantly Cold Emailing Software is included in the tools stack investment.`
                      : `${money(result.currency, settings.monthlyRecurring)}/month recurring cost begins from Month 2 onward.`}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Timeline + Send */}
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="rounded-[1.75rem] border border-border bg-surface/60 p-8 sm:p-10">
                <SectionLabel>Timeline</SectionLabel>
                <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">
                  {result.timeline}-day campaign for {companyLabel}
                </h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  Guaranteed {result.appointments} appointments and {result.clients} clients inside{" "}
                  {result.timeline} days.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={sendProposal}
                    disabled={!clientComplete || sendState === "sending"}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--glow-brand)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {sendState === "sending"
                      ? "Sending…"
                      : sendState === "sent"
                        ? "Proposal Sent"
                        : sendState === "error"
                          ? "Failed — Try Again"
                          : "Send Proposal"}
                  </button>
                  {!clientComplete && (
                    <span className="text-sm text-muted-foreground">
                      Complete the client information form first.
                    </span>
                  )}
                  {sendState === "sent" && (
                    <span className="text-sm text-primary">Proposal Sent</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {backendOpen && (
        <BackendPanel settings={settings} onChange={setSettings} onClose={() => setBackendOpen(false)} />
      )}
    </>
  );
}

function Bucket({
  title,
  lines,
  total,
  currency,
  empty,
  informational = false,
}: {
  title: string;
  lines: { label: string; amount: number; note?: string }[];
  total: number;
  currency: string;
  empty?: string;
  informational?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-7">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {lines.length === 0 && <li className="text-muted-foreground">{empty ?? "—"}</li>}
        {lines.map((l) => (
          <li key={l.label} className="flex items-start justify-between gap-4">
            <span>
              {l.label}
              {l.note && <span className="block text-xs text-muted-foreground">{l.note}</span>}
            </span>
            <span className="shrink-0 font-semibold">{money(currency, l.amount)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 flex justify-between border-t border-border pt-4 text-sm font-semibold">
        <span>Subtotal</span>
         <span>{informational ? "Included above" : money(currency, total)}</span>
      </p>
    </div>
  );
}

function GuaranteeCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof CalendarClock;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-base font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  hint?: string;
}) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="py-4">
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        <span className="font-display text-2xl leading-none text-primary">{format(value)}</span>
      </div>
      <div className="relative mt-3 h-2">
        <div className="absolute inset-0 rounded-full bg-border" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-[var(--glow-brand)] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background"
        />
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
