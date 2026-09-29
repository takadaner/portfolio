# daner.app

Personal portfolio for Abdula Daner, built with Next.js 16, React, TypeScript, Tailwind CSS, Framer Motion, Three.js/OGL, and the Web Audio API.

## Local development

Requirements: Node.js 20.9+ and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Contact delivery

The contact form posts to `/api/contact`. The endpoint validates and bounds the request body, uses a honeypot, checks same-origin browser requests, and applies a best-effort in-process rate limit. In-process limits do not coordinate across serverless instances; configure a platform-level WAF rate limit for `/api/contact` before accepting public traffic.

Copy `.env.example` to `.env.local` and configure:

- `RESEND_API_KEY`: server-only Resend API key.
- `CONTACT_TO_EMAIL`: destination inbox.
- `CONTACT_FROM_EMAIL`: sender on a domain verified in Resend.

If delivery is not configured or the provider is unavailable, the form offers a pre-filled email-app fallback so the visitor does not lose their message. Never expose the Resend key through a `NEXT_PUBLIC_` variable. Configure real delivery credentials only in the hosting provider's secret environment settings; avoid sending live enquiries from preview deployments.

## Content rules

- Portfolio cards are public only when their locale entry has a non-empty `href`.
- MPC machines are public only after all 16 WAV files exist under `public/mpc/songs/<slug>/`.
- Do not invent projects, client outcomes, testimonials, certifications, or dates. Add them only after the underlying information can be verified.
- Romanian and English content live in `locales/ro.json` and `locales/en.json`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run test:coverage
npm run build
```

`npm run check` runs the complete release gate. The dependency-free Node test suite enforces at least 80% coverage for the contact, localization, and project-publication helpers. GitHub Actions runs the same gate for pushes and pull requests.

## Main routes

- `/` — homepage
- `/services` — services
- `/projects` — published portfolio work
- `/about` — profile and experience
- `/contact` — contact information and enquiry form
- `/mcp` — interactive Web Audio project

Language selection is represented by `?lang=ro` or `?lang=en`, persisted in the first-party `daner-language` preference cookie, and reflected in the document language, self-canonical URLs, and SEO alternate links. The cookie notice is available at `/cookies`.

## Deployment

The project is configured for Vercel-compatible deployment. GitHub Actions runs the release gate on pushes to `master` and pull requests. If the repository is connected to Vercel, confirm that `master` is the production branch and use preview deployments to test changes before production. Before publishing:

1. Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` to the hosting project's Production environment. Verify the sender domain with Resend first.
2. Add a platform WAF rate-limit rule for `POST /api/contact`; the in-process fallback is not shared across serverless instances.
3. Publish a reviewed privacy notice linked beside the form before collecting enquiries. Confirm the controller/contact, purpose and legal basis, collected fields, retention criteria, service providers/transfer locations, and individual rights; these details need owner confirmation.
4. Run `npm run check` and wait for the GitHub Actions release gate to pass.
5. Preview both language URLs, mobile layouts, the contact form fallback, and the Night Concierge concept.
6. After production deployment, submit one controlled test enquiry and confirm it arrives at the intended inbox. Do not use real customer data for smoke tests.
