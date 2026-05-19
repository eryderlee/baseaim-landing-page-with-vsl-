# Baseaim VSL vs Form A/B Test — Setup Notes

## How it works (90 seconds)

1. Both variants live in one repo, one Netlify deploy, one domain (`vsl.baseaim.co`):
   - **VSL** at `/` (root `index.html`)
   - **Form** at `/form/` (`form/index.html`)
2. Visitor lands on either URL. `ab-router.js` runs **first**, before any other script. On the very first visit:
   - Rolls a 50/50 coin → `variant = 'vsl'` or `'form'`.
   - Stores assignment in `localStorage.baseaim_page_variant` + a same-host cookie (30-day TTL).
3. If the visitor's variant doesn't match the path they hit → `location.replace(...)` to the matching variant. Query params (UTM, fbclid, gclid) preserved; internal `force`/`nosplit` stripped.
4. Subsequent visits reuse the assignment → sticky experience.
5. `ab-test.js` runs after the router and pushes every event to `dataLayer` tagged with `ab_test_name: 'vsl_vs_form'`, `ab_variant: 'vsl' | 'form'`, `ab_site: 'vsl' | 'form'`.

Since both variants share the same origin (`vsl.baseaim.co`), GA4 cookie scoping and the variant cookie work natively — no cross-domain plumbing needed.

## URL overrides (QA + ad campaigns)

| Param | Effect |
|---|---|
| `?force=vsl` | Pin variant to VSL + persist. Use for VSL-only ad campaigns. |
| `?force=form` | Pin variant to form + persist. Use for form-only ad campaigns. |
| `?nosplit=1` | Skip router on this single pageview (does NOT persist). Use for screenshots / QA. |

Reset for a fresh roll: `window.BASEAIM_AB.reset()` in console.

---

## GTM — what's already there vs. what to add

Your existing tags (`GA4 - AB Test Assigned`, `GA4 - Booking Section Viewed`, `GA4 - CTA Click`, `GA4 - Scroll Depth`, `GA4 - Section Viewed`, `GA4 - Time on Page`, `GA4 - Video Engagement`) **all transfer to both variants automatically**. They fire on whichever event name they're triggered by, and the new tracker emits those exact same event names on both VSL and form. The `ab_site` parameter on every event tells GA4 which variant it came from.

So you don't have to recreate anything. You just need to add a few new tags to capture:
1. Form-submit conversion (form variant only)
2. Cal.com booking confirmation (both variants)
3. (Optional) Modal opened on form variant — funnel diagnostic

### New data layer variables to create

Go to GTM → Variables → User-Defined Variables → New → **Data Layer Variable**:

| Variable name | Data Layer Variable Name |
|---|---|
| `dlv - ab_site` | `ab_site` |
| `dlv - revenue` | `revenue` |
| `dlv - firm_name` | `firm_name` |
| `dlv - has_phone` | `has_phone` |
| `dlv - booking_uid` | `booking_uid` |
| `dlv - event_type_slug` | `event_type_slug` |
| `dlv - cal_event_type` | `cal_event_type` |

You can also retrofit `ab_site` onto your existing tag event-parameter rows so every event in GA4 carries it — it's the column you'll segment by in every report.

### New triggers (Custom Event)

| Trigger name | Event name | Fires |
|---|---|---|
| `CE - Lead Submit` | `lead_submit` | Form variant: visitor submitted the modal lead form. |
| `CE - Cal Booking Confirmed` | `cal_booking_confirmed` | Either variant: visitor completed Cal.com booking. |
| `CE - Lead Modal Opened` (optional) | `lead_modal_opened` | Form variant: visitor clicked any CTA that opens the modal. Useful for modal-open → form-submit funnel. |

### New tags

**`GA4 - Lead Submit`** — the form variant's primary conversion.
- Tag type: Google Analytics: GA4 Event
- Configuration tag: your existing GA4 config (`G-6SBQ0EEMTC`)
- Event name: `lead_submit`
- Event Parameters:
  | Parameter | Value |
  |---|---|
  | `ab_variant` | `{{dlv - ab_test_variant}}` |
  | `ab_test_name` | `{{dlv - ab_test_name}}` |
  | `ab_site` | `{{dlv - ab_site}}` |
  | `revenue_band` | `{{dlv - revenue}}` |
  | `firm_name` | `{{dlv - firm_name}}` |
  | `has_phone` | `{{dlv - has_phone}}` |
- Trigger: `CE - Lead Submit`
- **In GA4 → Admin → Events, mark `lead_submit` as a Key Event.**

> Note on "how much" — the form captures revenue as a **band** (`under-250k`, `250k-1m`, `1m-3m`, `3m-plus`), not a dollar amount. GA4 can't compute a numeric mean from band values, but you can break down by `revenue_band` to see which bands convert (and segment by variant). If you later want a true numeric `value`, replace the dropdown with a number input.

**`GA4 - Cal Booking Confirmed`** — the deepest conversion signal on both variants.
- Tag type: GA4 Event
- Configuration tag: existing GA4 config
- Event name: `cal_booking_confirmed`
- Event Parameters:
  | Parameter | Value |
  |---|---|
  | `ab_variant` | `{{dlv - ab_test_variant}}` |
  | `ab_test_name` | `{{dlv - ab_test_name}}` |
  | `ab_site` | `{{dlv - ab_site}}` |
  | `booking_uid` | `{{dlv - booking_uid}}` |
  | `event_type_slug` | `{{dlv - event_type_slug}}` |
  | `cal_event_type` | `{{dlv - cal_event_type}}` |
- Trigger: `CE - Cal Booking Confirmed`
- **Mark as Key Event in GA4.**

**`GA4 - Lead Modal Opened`** (optional, for funnel analysis) — fires when a CTA opens the modal on the form site.
- Event name: `lead_modal_opened`
- Trigger: `CE - Lead Modal Opened`
- Same `ab_variant`/`ab_test_name`/`ab_site` parameters.

### Cal.com booking detection — caveat

The booking-confirmation event is captured via `window.postMessage` from the Cal.com iframe. Cal's embed protocol does emit booking events, but the exact event name has varied across Cal versions; the tracker matches defensively (any message whose `type`/`action` contains `booking` + `success`/`complete`/`confirmed`). **Verify this fires in production:**

1. Open `vsl.baseaim.co` (or `/form/`) in browser.
2. Open DevTools → Console → run: `window.addEventListener('message', e => console.log('MSG', e.origin, e.data))`
3. Complete a test booking inside the Cal.com iframe.
4. Inspect the messages logged. Find the one Cal.com fires on completion.
5. If our matcher doesn't catch it, paste the exact event shape to me and I'll tighten the listener.

If the postMessage approach turns out to be unreliable, the bulletproof alternative is:
- Set up a Cal.com webhook → existing n8n endpoint → POST to GA4 Measurement Protocol.
- The Cal.com URL is already tagged with `metadata[ab_variant]` (VSL embed + form-modal Cal URL both do this), so the webhook payload carries the variant. Server-side fire is 100% reliable.

Tell me when you want that — it's a one-hour n8n + GA4 Measurement Protocol wire-up.

### Verifying it all in GTM Preview

After publishing, GTM Preview mode → load `vsl.baseaim.co/?force=form` → you should see:
- `ab_test_assigned` (with `ab_variant=form`, `ab_site=form`)
- `ab_time_on_page`, `ab_section_viewed`, `ab_scroll_depth`, `ab_cta_click` as visitor scrolls
- Click "Book My Free Strategy Call" → `lead_modal_opened`
- Fill + submit form → `lead_submit` with `revenue` populated
- Complete booking → `cal_booking_confirmed`

Repeat with `?force=vsl` → same events except `lead_*` is replaced by `booking_section_viewed`, and you also get `ab_video_engagement` events as the VSL plays.

---

## GA4 custom dimensions

If you haven't already, in GA4 → Admin → Custom Definitions → Custom Dimensions, register:

| Dimension name | Event parameter | Scope |
|---|---|---|
| `ab_variant` | `ab_variant` | Event |
| `ab_test_name` | `ab_test_name` | Event |
| `ab_site` | `ab_site` | Event |
| `revenue_band` | `revenue_band` | Event |
| `booking_uid` | `booking_uid` | Event |

Takes ~24h for GA4 to make these available as filters/breakdowns in reports.

---

## Meta Pixel side

`fbq` events fired by the tracker now all carry `ab_variant` + `ab_test_name` + `ab_site` as custom properties. The form submission also fires the standard `fbq('track', 'Lead', ...)` with those tags, and a Cal.com booking fires `fbq('track', 'Schedule', ...)` — both are standard Meta events you can optimize ad campaigns against in Ads Manager. Segment by the custom properties to compare VSL vs Form.

---

## Deploy checklist

- [ ] Push the VSL repo (single push, both variants ship). Netlify auto-deploys to `vsl.baseaim.co`.
- [ ] Verify `vsl.baseaim.co/?force=vsl` stays on VSL.
- [ ] Verify `vsl.baseaim.co/?force=form` redirects to `vsl.baseaim.co/form/`.
- [ ] `window.BASEAIM_AB.reset()` → reload ~20 times → split is roughly even.
- [ ] In GTM Preview: `ab_test_assigned` fires with `ab_variant` populated.
- [ ] In GA4 Realtime: events show up; once dimensions are registered, `ab_variant` populates within 24h.
- [ ] Archive the now-orphan `baseaim-landing-page-with-form` GitHub repo (it's been merged in here).

---

## Where to change things

| Want to... | File | What to edit |
|---|---|---|
| Change the split ratio | `ab-router.js` (both copies) | `Math.random() < 0.5` line |
| Pause the test (force everyone to one variant) | `ab-router.js` (both copies) | Replace random roll with hardcoded `variant = 'vsl'` (or `'form'`) |
| Add a new tracked event | `ab-test.js` (relevant copy) | Call `track('event_name', { ...props })` |
| Tighten Cal.com booking matcher | `ab-test.js` (both copies) | The `window.addEventListener('message', ...)` block — adjust `label` matching |
