import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { verifyBackendCode } from "@/lib/backend.functions";
import {
  DEFAULT_SETTINGS,
  saveSettings,
  type CalcSettings,
  type ExtraItem,
} from "@/lib/calc-settings";

const NUM_FIELDS: { key: keyof CalcSettings; label: string; group: string }[] = [
  { key: "leadPricePer10k", label: "Lead scraping price / 10K", group: "Data" },
  { key: "validationPricePer10k", label: "Validation price / 10K", group: "Data" },
  { key: "smsSendPricePer10k", label: "SMS sending price / 10K", group: "Data" },
  { key: "personalizationPricePer10k", label: "Personalization credits / 10K", group: "Data" },
  { key: "phoneNumberPrice", label: "Phone number price / month", group: "SMS" },
  { key: "minPhoneNumbers", label: "Minimum phone numbers", group: "SMS" },
  { key: "smsPerNumberPerDay", label: "SMS per number per day", group: "SMS" },
  { key: "smsAccountValue", label: "SMS account value (free)", group: "SMS" },
  { key: "mailboxPrice", label: "Mailbox price / month", group: "Email" },
  { key: "domainPrice", label: "Domain price / mailbox", group: "Email" },
  { key: "instantlyPlanPrice", label: "Instantly Hyper Growth Plan", group: "Email" },
  { key: "emailPersonalizationPricePer10k", label: "Email personalization / 10K", group: "Email" },
  { key: "ownServersValue", label: "Own servers included value", group: "Email" },
  { key: "noManagementFeeValue", label: "No management fee value", group: "Email" },
  { key: "minMailboxes", label: "Minimum mailboxes", group: "Email" },
  { key: "emailsPerMailboxPerDay", label: "Emails per mailbox per day", group: "Email" },
  { key: "usSetupFee", label: "US setup fee (one-time)", group: "Fees" },
  { key: "ukSetupFee", label: "UK setup fee (one-time, £)", group: "Fees" },
  { key: "monthlyRecurring", label: "Monthly recurring (from Month 2)", group: "Fees" },
  { key: "commissionPct", label: "Performance commission %", group: "Fees" },
  { key: "smsApptsPer10k", label: "SMS appointments / 10K", group: "Guarantees" },
  { key: "emailApptsPer10k", label: "Email appointments / 10K", group: "Guarantees" },
  { key: "apptsPerClient", label: "Appointments per guaranteed client", group: "Guarantees" },
  { key: "emailRoi", label: "Email minimum ROI (x)", group: "Guarantees" },
  { key: "smsRoi", label: "SMS minimum ROI (x)", group: "Guarantees" },
  { key: "callRoi", label: "Call centre minimum ROI (x)", group: "Guarantees" },
  { key: "metaRoi", label: "Meta Ads ROI (0 = not finalised)", group: "Guarantees" },
  { key: "timelineEmail", label: "Email timeline (days)", group: "Timelines" },
  { key: "timelineSms", label: "SMS timeline (days)", group: "Timelines" },
  { key: "timelineMeta", label: "Meta Ads timeline (days)", group: "Timelines" },
  { key: "timelineCall", label: "Call centre timeline (days)", group: "Timelines" },
  { key: "metaCostPerLead", label: "Meta cost per lead", group: "Meta Ads" },
  { key: "metaApptRate", label: "Meta appointment rate %", group: "Meta Ads" },
  { key: "metaCloseRate", label: "Meta close rate %", group: "Meta Ads" },
  { key: "callCostPerCall", label: "Cost per call", group: "Call Centre" },
  { key: "callAgentHourlyRate", label: "Agent hourly rate", group: "Call Centre" },
  { key: "callConnectRate", label: "Connection rate %", group: "Call Centre" },
  { key: "callApptRate", label: "Appointment rate % (of connections)", group: "Call Centre" },
  { key: "callCloseRate", label: "Close rate %", group: "Call Centre" },
];

const field =
  "w-full rounded-lg border border-input bg-background/70 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

export default function BackendPanel({
  settings,
  onChange,
  onClose,
}: {
  settings: CalcSettings;
  onChange: (s: CalcSettings) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [draft, setDraft] = useState<CalcSettings>(settings);

  async function unlock() {
    setChecking(true);
    try {
      const res = await verifyBackendCode({ data: { code } });
      if (res.ok) {
        setUnlocked(true);
      } else {
        toast.error("Incorrect access code");
      }
    } catch {
      toast.error("Could not verify the access code");
    } finally {
      setChecking(false);
    }
  }

  function setNum(key: keyof CalcSettings, value: string) {
    setDraft({ ...draft, [key]: Number(value) || 0 });
  }

  function addExtra() {
    const item: ExtraItem = {
      id: `x-${Date.now()}`,
      label: "New tool or service",
      amount: 0,
      bucket: "monthly",
      appliesTo: "all",
    };
    setDraft({ ...draft, extras: [...draft.extras, item] });
  }

  function updateExtra(id: string, patch: Partial<ExtraItem>) {
    setDraft({
      ...draft,
      extras: draft.extras.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  }

  const groups = Array.from(new Set(NUM_FIELDS.map((f) => f.group)));

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-8 w-full max-w-4xl rounded-3xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Calculator Backend</h2>
          <button
            type="button"
            aria-label="Close backend"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!unlocked ? (
          <div className="mt-6 max-w-sm">
            <p className="text-sm text-muted-foreground">
              Enter the access code to edit pricing, guarantees and services.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && unlock()}
                placeholder="Access code"
                className={field}
              />
              <button
                type="button"
                disabled={checking}
                onClick={unlock}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                <Lock className="h-4 w-4" />
                {checking ? "Checking…" : "Unlock"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {groups.map((g) => (
              <div key={g}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{g}</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {NUM_FIELDS.filter((f) => f.group === g).map((f) => (
                    <label key={String(f.key)} className="block">
                      <span className="mb-1 block text-xs text-muted-foreground">{f.label}</span>
                      <input
                        type="number"
                        step="0.01"
                        value={String(draft[f.key] as number)}
                        onChange={(e) => setNum(f.key, e.target.value)}
                        className={field}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Extra tools & services
                </h3>
                <button
                  type="button"
                  onClick={addExtra}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:border-primary"
                >
                  <Plus className="h-3.5 w-3.5" /> Add item
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {draft.extras.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No extra items yet. Add tools or services and they will appear in the investment
                    breakdown.
                  </p>
                )}
                {draft.extras.map((e) => (
                  <div key={e.id} className="grid gap-2 sm:grid-cols-[1fr_120px_140px_140px_auto]">
                    <input
                      value={e.label}
                      onChange={(ev) => updateExtra(e.id, { label: ev.target.value })}
                      className={field}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={String(e.amount)}
                      onChange={(ev) => updateExtra(e.id, { amount: Number(ev.target.value) || 0 })}
                      className={field}
                    />
                    <select
                      value={e.bucket}
                      onChange={(ev) =>
                        updateExtra(e.id, { bucket: ev.target.value as ExtraItem["bucket"] })
                      }
                      className={field}
                    >
                      <option value="one-time">One-time</option>
                      <option value="campaign">Campaign</option>
                      <option value="monthly">Monthly</option>
                      <option value="free">Included free</option>
                    </select>
                    <select
                      value={e.appliesTo}
                      onChange={(ev) =>
                        updateExtra(e.id, { appliesTo: ev.target.value as ExtraItem["appliesTo"] })
                      }
                      className={field}
                    >
                      <option value="all">All calculators</option>
                      <option value="email">Cold Email</option>
                      <option value="sms">Cold SMS</option>
                      <option value="meta">Meta Ads</option>
                      <option value="call">Call Centre</option>
                    </select>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() =>
                        setDraft({ ...draft, extras: draft.extras.filter((x) => x.id !== e.id) })
                      }
                      className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-border pt-5">
              <button
                type="button"
                onClick={() => {
                  saveSettings(draft);
                  onChange(draft);
                  toast.success("Calculator settings saved");
                  onClose();
                }}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Save settings
              </button>
              <button
                type="button"
                onClick={() => setDraft(DEFAULT_SETTINGS)}
                className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:border-primary"
              >
                Reset to defaults
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
