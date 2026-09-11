# Appoint Funnels brand, policy, chat, and calculator update

## What will change

- Use the uploaded mark as the site logo in the header and footer, and create a properly sized favicon from it.
- Add a dedicated Privacy Policy page stating that meeting/dashboard dates may be inaccurate and customer names are changed to protect privacy. Link it from the footer.
- Replace the floating colour picker with a compact chatbot. Because history options were skipped, use one temporary conversation with no saved history.
- Keep the existing colour-picker code available but inactive, and add `#010107` as its final swatch for future reactivation.
- Reorder Cold Email and Cold SMS controls so mailboxes/phone numbers appear before lead volume.
- Add Call Center agent and hours controls, calculated at $10 per agent-hour, before call volume.
- Expand Cold Email pricing and included services:
  - Domains: $10 per mailbox/domain
  - Instantly Hyper Growth Plan (Split): $50
  - Email verification: $25 per 10,000
  - Email personalization credits: $10 per 10,000
  - Own servers: included free
  - No management and service fee: $1,000 value, included free
- Remove the generic platform/management charge from Cold Email.
- Rename “Campaign Costs” to “Tools Stack Investment.”
- Show recurring email tools in both the tools-stack breakdown and the monthly breakdown without double-counting the total.
- Include all new calculator inputs and results in the proposal payload and make their prices editable in the protected settings panel.

## Technical details

- Store the uploaded logo through the project asset system; generate a small real favicon file in `public/` and update the document icon reference.
- Extend calculator inputs/settings and central calculation logic rather than adding display-only figures.
- Treat the Instantly plan, domains/mailboxes, call-center agent hours, and personalization as configurable settings.
- The chatbot will use a server-side AI request with the existing brand mark as its identity; no credentials will be exposed in the browser.
- Verify all four calculator modes, the privacy link/page, logo/favicon rendering, chatbot response, proposal data, and desktop/mobile layouts.

## Assumptions

- “Traditional marketing technique” is presented as an included Cold Email service, not a priced line item.
- Each selected mailbox uses one $10 domain and the existing mailbox price remains configurable.
- Call Center labor equals agents × hours per agent × $10/hour; calls still drive funnel estimates.
- Instantly’s $50 plan is a monthly cost displayed in both relevant breakdowns but counted once.
