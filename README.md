# BuildCore

BuildCore is a responsive construction-management demo designed around the information a builder or company owner needs first: portfolio progress, cost utilisation, schedule risk, approvals, site evidence, workforce, materials and reports.

## Demo experience

- Owner command centre with portfolio and project-level views
- Guided five-minute owner walkthrough
- Projects, employees, contractors, tasks and role-based access
- Daily site reports, attendance and timestamped photo evidence
- Inventory and material inward/outward records
- Expense review and approval evidence
- Owner-report preview and downloadable sample exports
- Search, filters, record cards/tables, forms and responsive detail drawers
- Mobile-first navigation and installable PWA metadata

All figures in the frontend are realistic sample data. No backend is connected yet. The API boundary is isolated in `app/services/api.ts` for later integration.

## Run locally

Use Node.js 22.22.0. The repository pins this version so local and Render builds use the same runtime.

```bash
npm install
npm run dev
```

## Release checks

```bash
npm run lint
npm test
```

The production build uses Vinext and Cloudflare-compatible ESM output.
