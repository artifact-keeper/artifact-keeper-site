// Site-wide constants for the landing pages (/, /cloud/, /privacy/).

/** Release shown in the hero eyebrow, the proof row, the footer and the OG image. */
export const release = { version: 'v1.11.10', date: '2026-10-29' };

/**
 * Contact points.
 * - `support`: community and product contact (footer, Cloud fallback card, privacy page).
 * - `enterprise`: address for enterprise support and services. Not decided yet: while it is
 *   null, enterprise calls to action show only the OpenTeams link. Set it to a string to
 *   render the address (selectable text, copy button, mailto) next to that link.
 * - `openteams`: enterprise support, migration and managed hosting are delivered by OpenTeams.
 */
export const contacts = {
  support: 'support@artifactkeeper.com',
  enterprise: null as string | null,
  openteams: 'https://openteams.com/artifact-keeper/',
};

/**
 * Artifact Keeper Cloud waitlist form (/cloud/). Switching provider means editing this one object.
 *
 * Provider: GetWaitlist (https://getwaitlist.com), with FormSubmit as the safety net.
 * - `getwaitlistId`: the waitlist ID from the waitlist's settings page on getwaitlist.com.
 *   While it still contains REPLACE_WITH_WAITLIST_ID, GetWaitlist is skipped and the form runs on
 *   FormSubmit alone (below).
 * - With JS and an ID set: the page POSTs JSON to https://api.getwaitlist.com/api/v1/signup
 *   ({ email, waitlist_id, metadata: { company, source } }) and shows "You're on the list. Check
 *   your inbox to confirm your spot." (GetWaitlist email verification is on; referrals are off).
 *   On any failure it falls back to FormSubmit, so a signup is never lost.
 * - FormSubmit (https://formsubmit.co, no account): the first submission sends a one-time
 *   activation email to the target address; after that every signup is forwarded to it.
 *   Without JS the form always POSTs here and FormSubmit redirects to `_next` (/cloud/?joined=1),
 *   which shows the success state. With JS and no GetWaitlist ID, the page POSTs to the
 *   /ajax/ endpoint with Accept: application/json; on error it does the plain POST instead.
 *   `_honey` is FormSubmit's honeypot, rendered visually hidden and empty.
 *
 * Self-hosted alternative, for reference:
 *
 *   listmonk
 *     provider: 'listmonk'
 *     formsubmit → replace with action 'https://<host>/subscription/form'
 *     fields: { email: 'email', company: 'name' }, plus a hidden list input l=<list uuid>
 */
export type WaitlistProvider = 'getwaitlist' | 'formsubmit' | 'listmonk';

export const waitlist = {
  provider: 'getwaitlist' as WaitlistProvider,
  getwaitlistId: '33151',
  formsubmit: `https://formsubmit.co/${contacts.support}`,
  fields: { email: 'email', company: 'company' },
};

const getwaitlistReady = waitlist.provider === 'getwaitlist' && !waitlist.getwaitlistId.includes('REPLACE_WITH_WAITLIST_ID');

/** Derived settings the /cloud/ page renders. Edit `waitlist` above, not this. */
export const waitlistForm = {
  /** No-JS action: always FormSubmit. */
  action: waitlist.formsubmit,
  method: 'POST' as const,
  /** JS fallback endpoint (FormSubmit's JSON API). */
  ajaxAction: waitlist.formsubmit.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/'),
  /** Set only when a GetWaitlist ID is configured. */
  getwaitlist: getwaitlistReady
    ? { endpoint: 'https://api.getwaitlist.com/api/v1/signup', id: waitlist.getwaitlistId, source: 'artifactkeeper.com/cloud' }
    : null,
  fields: waitlist.fields,
  hidden: {
    _subject: 'Cloud waitlist signup',
    _template: 'table',
    _captcha: 'false',
    _next: 'https://artifactkeeper.com/cloud/?joined=1',
  } as Record<string, string>,
  honeypot: '_honey',
  successParam: 'joined',
};
