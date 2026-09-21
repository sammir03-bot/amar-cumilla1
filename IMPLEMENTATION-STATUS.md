# Implementation checkpoint — 2026-09-21

## Implemented

- Next.js 16 / Node.js application with Bengali responsive public pages.
- Supabase cookie authentication, session refresh proxy and server-side staff authorization.
- Admin editors for news, events, leaders, galleries, documents, pages and campaign archive.
- Area editor with source, verification, publication, village, institution and service information.
- 24 provisional area records seeded as unpublished/unverified; only published verified records appear publicly.
- Private 2 MB image/PDF uploads with format checks and publication-based read policies.
- Draft preview, optimistic update conflict detection, audit trail, editor/publisher/admin permissions.
- Public lists, area search/filter, post details, about/contact content and pagination.
- Existing administrator confirmed and assigned admin in the approved Supabase project.

## Verification

- Production build passed; TypeScript passed; git diff whitespace check passed.
- SQL anonymous-role test returned zero draft areas, zero staff and zero unpublished posts.
- Transactional admin test saw 24 areas, inserted a publication and recorded one audit entry. All test writes rolled back.
- Local production HTTP requests returned rendered responses for home, areas, news, events, about, contact, admin and missing-post paths. HTTP status alone does not prove complete UI behavior because Next.js streams responses.
- Browser verification unavailable: agent-browser daemon exits during startup. Visual QA and real signed-in Admin form/upload testing remain pending; no real-user session was fabricated.

## Deployment and remaining setup

- No live Next.js URL yet. Vercel deployment was rejected by automatic approval review because Vercel had not been explicitly approved as the destination. Do not bypass that decision; obtain explicit hosting approval.
- Set the final SITE_URL and Supabase Auth allowed redirect URL before using password recovery.
- Review official identity, area records, leaders, contact information and publish actual content. No invented people or details were seeded.
- Public contact information is editable; no public message-collection form or inbox is implemented.
- Per-area staff assignments and staff-management UI are not implemented; staff roles are assigned by a trusted database administrator.
- Media upload returns a path to attach manually; a graphical media picker is not implemented.
- Pages remain noindex and carry a preparation notice pending content approval.
- SQL reference files are not a complete fresh-install Supabase migration history. Follow README order for a new database; do not replay on the configured project.
- Service-role secrets are not used by this app. Local configuration is ignored by git.
