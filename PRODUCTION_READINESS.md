# Production Readiness - Phase 16

## Verified in CI-equivalent local checks

- TypeScript strict compilation, ESLint, unit tests, Firebase emulator security-rule tests, and production build must pass before release.
- Firebase configuration is loaded only from `VITE_FIREBASE_*` environment variables. No Firebase values are stored in source-controlled local environment files.
- Firestore and Storage default to deny. Project access is membership and role based; immutable approvals and audit logs cannot be updated or deleted by clients.
- The production site is deployed through the configured private Sites project.

## Release boundaries

- This application is a calculation-support system, not an autonomous design authority.
- A licensed engineer must review inputs, assumptions, results, standards, report status, and construction details.
- Before enabling real project data, configure production Firebase values, Authentication providers, App Check, backups, monitoring, and least-privilege IAM in the Firebase/Cloud console.
- Keep the deployed site private unless access review explicitly approves a broader policy.
