# BidSure AI

AI-assisted procurement bid verification prototype, built around a fictional CPCL (Chennai
Petroleum Corporation Limited) tender scenario. A procurement officer reviews bids against
tender requirements, sees AI-surfaced discrepancies backed by evidence, and records the final
decision — the AI is advisory only.

This is a **frontend-only prototype**: all tender, bid, and officer data is mock data defined in
`src/data/mockData.ts`. There is no backend, database, or connection to any real government
system (GeM, GSTN, MSME, etc.).

## Running locally

```bash
npm install
npm run dev
```

Then sign in with the demo credentials shown on the login screen (Employee Code:
`CPCL-PROC-0841`, Password: `Cpcl@2026`).

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

## Stack

React 19, TypeScript, React Router, Tailwind CSS, Vite.
