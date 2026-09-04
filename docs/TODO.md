# TODO

## Resumes — deep-link each PDF to its zone page

Both resume PDFs (Google Docs export URLs in `src/data/resume.ts` → `resumes.software` / `resumes.marketing`) should link back to the matching zone page instead of the hub:

- Software resume → footer link to `/software`
- Marketing resume → footer link to `/marketing`

Recruiters who receive a PDF should land directly on the relevant track, not have to self-route from the homepage.

## Book a Call — scheduling backend

- `hub.appointmentUrl` in `src/data/resume.ts` is empty; `book_call.astro` currently falls back to `mailto:` and surfaces a placeholder helper line to visitors.
- Add a real scheduling link (Google Appointments / Cal.com) to `appointmentUrl`, or embed a scheduler, so the primary CTA actually books a call.
