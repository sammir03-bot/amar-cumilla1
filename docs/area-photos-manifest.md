# Area photos — sourcing manifest (checked 2026-11-12)

Purpose: give every area page a real, correctly credited photo **without ever
labelling a photo as a place it does not depict**. This file records what was
searched, what was verified, and exactly how a verified photo gets applied.

## How area photos are stored and applied

- Photos live in **Supabase**, not in this repo: columns `image_url`,
  `image_credit`, `image_license`, `image_source_url` on `public.cumilla_areas`.
- `db/seed-areas.sql` inserts areas with **no** images; the images currently on
  the live site were set afterwards through the database / admin.
- The admin area editor (`/admin/areas/[id]`) already has fields for the photo
  URL, credit, licence and source, with the guidance "নিজস্ব ছবি বা Wikimedia
  Commons-এর মতো বৈধ উৎসের ছবি ব্যবহার করুন" — so applying a photo below is an
  Admin Panel paste-in, or one SQL `UPDATE` (pattern in
  `db/area-photos-update.sql`). No code change is needed.
- Credit format already used on the live Biteshwar hero, keep the same shape:
  `ছবি: <Author> / Wikimedia Commons · <Licence> · উৎস`.

## Honesty rules applied

1. A photo is assigned to an area only if it genuinely depicts that area, its
   upazila, or a verified landmark in it.
2. A district/upazila-level photo may be used for an area in that upazila only
   with a credit/caption that says what it actually shows.
3. News posts are **not** covered by this manifest: no unrelated or generic
   photo may be attached to a specific real news event.

## Per-area status (all 24 areas)

Current live state for every area below: a photo exists in the database, but
the same few pond/sunset photos repeat across areas (per the 2026-11-12 UI
audit) and they are **not** in this repo, so they cannot be re-credited or
verified from here. Replacement candidates found online are listed where a
*verified* one exists; "—" means no openly-licensed photo of that union could
be verified in this pass.

| Upazila | Area (slug) | Verified replacement candidate | Status |
|---|---|---|---|
| Daudkandi | municipality | — | No verified union/municipality-specific open photo found |
| Daudkandi | daudkandi-north | Meghna–Gumti bridge is a genuine landmark here (Uttar Daudkandi), but no openly-licensed *scenic* photo of the bridge could be verified — see "Sources checked" #2 | Pending a verifiable bridge photo |
| Daudkandi | biteshwar | **Keep existing hero** — Wikimedia Commons, credit on the live page: "Mayaseer 14 / Wikimedia Commons · CC BY-SA 4.0" | Already applied in DB; do not replace |
| Daudkandi | sundalpur, barpara, gouripur, jinglatoli, eliotganj-north, eliotganj-south, maligaon, mohammadpur-west, maruka, goalmari, padua, panchgachia-west, daulatpur | — | No verified union-specific open photo found |
| Meghna | chandanpur, chalibhanga, radhangar, manikarchar, barakanda, govindapur, luterchar, bhaorkhola | — | No verified union-specific open photo found; Meghna River photos exist but the verified ones are the wrong stretch/era — see "Sources checked" #3 |

## Sources checked (2026-11-12)

1. **Existing Biteshwar hero (Wikimedia Commons)** — credited on the live page
   as "Mayaseer 14 / Wikimedia Commons · CC BY-SA 4.0 · উৎস". Verdict: **keep**.
2. **Press Information Department (PID) photos of the 2nd Meghna Bridge &
   2nd Gomti Bridge inauguration, 25 May 2019** — Wikimedia Commons files
   `File:Meghna Bridge 2, Gomti Bridge, Konabari and Chandra Flyovers Inauguration, Dhaka-Chittagong Highway, 2019-05-25 (PID-0038553).jpg` and
   `File:2019-05-25 Inauguration of Meghna Gomti bridges … (PID-0038552).jpg`.
   Licence: **public domain** (work of a PID employee in official duties —
   stated on the Commons file pages). Credit: "Press Information Department /
   Wikimedia Commons". Verdict: **not assigned** — the photos show the
   inauguration ceremony (video conference from Ganabhaban), not the bridges
   themselves, so they would mislead as area hero images.
3. **CDC Public Health Image Library Meghna photos on Commons** —
   `File:Country boats on the Meghna River.jpg` and
   `File:Overcrowded ferry boat on Meghna River, Bangladesh.jpg`.
   Licence: **public domain** (CDC/PHIL, Dr. Michael Schwartz, Dec 1975).
   Verdict: **rejected** — they depict the Meghna in *southern* Bangladesh in
   1975, not the Cumilla-1 stretch, and would look wrong on this site.
4. **`File:Meghna setu.jpg` (Taposhi Rabeya, 3 Sep 2018, own work, Commons)** —
   depicts "মেঘনা সেতু" (WLM monument ID BD-C-35-139). Verdict: **not
   assigned** — the well-known Meghna Bridge is at Sonargaon, Narayanganj,
   not Daudkandi, and the file's licence text could not be verified from the
   accessible page text in this pass. Do not use until both points are
   manually verified on the Commons file page.
5. **Daudkandi Upazila map (Bangladesh Bureau of Statistics, Commons)** — a
   map, not a photo; licence note is ambiguous. Not used.

Access note: the Wikimedia Commons API returned 403 to this environment and
several Commons file pages would not load, so verification was done from
Commons category listings and search-indexed file-page text. That is why
several candidates are marked *pending verification* instead of being
applied — the licence must be read on the file page itself before use.

## What remains (owner / local contributors)

- Union-specific photos genuinely do not exist in openly-licensed libraries
  for these unions as of this check. The realistic source is local
  contributors' own photos of each union (as the admin editor anticipates:
  "নিজস্ব ছবি").
- For each new photo: Admin Panel → এলাকা → edit the area → paste
  `image_url`, and fill credit as `<Photographer>`, licence (e.g.
  `CC BY-SA 4.0` or `সর্বস্বত্ব সংরক্ষিত — অনুমতিক্রমে` for own photos), and
  the source URL. Or run the SQL pattern in `db/area-photos-update.sql`.
- Two verifications would unlock real photos quickly: (a) read the licence
  on the `Meghna setu.jpg` file page and confirm which bridge it shows;
  (b) find a Commons/PID scenic photo of the Meghna–Gumti bridge at
  Daudkandi (a genuine Daudkandi landmark) with a readable licence.
