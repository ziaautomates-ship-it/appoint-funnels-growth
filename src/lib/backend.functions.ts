import { createServerFn } from "@tanstack/react-start";

export const verifyBackendCode = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) => {
    const code = typeof input?.code === "string" ? input.code.trim().slice(0, 120) : "";
    return { code };
  })
  .handler(async ({ data }) => {
    const expected = process.env["CALCULATOR_BACKEND_CODE"] ?? "";
    if (!expected) return { ok: false as const, reason: "not-configured" };
    const ok = data.code === expected;
    return { ok, reason: ok ? "ok" : "invalid" } as const;
  });
