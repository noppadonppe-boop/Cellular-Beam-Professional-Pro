# Cellular Beam Professional

Phases 1-10 establish the application, engineering quantity/section core, project security, deterministic straight cellular-beam geometry generation, verified 2D linear FEM analysis, straight and continuous beam load analysis, global gross-section member screening, cellular action extraction, and weld/stiffener/concentrated-load review schedules.

## Prerequisites

- Node.js 22.13 or newer
- npm 10 or newer
- A Firebase project for authentication and persistence work

## Installation

```bash
npm install
```

## Firebase setup

1. Create a Firebase project in the Firebase console.
2. Register a Web application.
3. Enable the required products only when their rules are ready: Authentication, Firestore, and Storage.
4. Copy `.env.example` to `.env.local`.
5. Add the Firebase Web configuration values to `.env.local`.

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Firebase Web API keys identify the Firebase project but must still be kept out of committed environment files. Security depends on Firebase Authentication, Firestore/Storage Security Rules, App Check where appropriate, and least-privilege IAM. `.env*` files are ignored; `.env.example` contains names only.

## Development

```bash
npm run dev
```

Vite prints the local URL. The root route redirects to `/dashboard`.

## Quality commands

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run build
```

Playwright may require a one-time local browser installation:

```bash
npx playwright install chromium
```

## Routes

- `/login`
- `/dashboard`
- `/projects`
- `/sections`
- `/projects/:projectId/criteria`
- `/projects/:projectId/settings`
- `/projects/:projectId/geometry`
- `/projects/:projectId/loads`
- `/projects/:projectId/analysis`
- `/projects/:projectId/design`
- `/projects/:projectId/report`
- `/settings`
- `/verification`

## Folder structure

```text
src/
  app/                  Application bootstrap, router, providers
  components/
    feedback/           Error boundary and notifications
    layout/             Application shell, sidebar, top bar, workflow
    pages/              Shared page compositions
    states/             Loading and empty states
    ui/                 shadcn/ui-compatible primitives
  features/             Feature-owned routes and UI
    auth/ projects/ criteria/ geometry/ loads/
    analysis/ design/ reports/ settings/ verification/
  core/                 Pure TypeScript engineering boundary
    quantities/ materials/ sections/ cellular/ loads/ design/ schemas/ fem/ standards/
  infrastructure/       Firebase repository adapters
  lib/                  Environment, Firebase, i18n, utilities
  stores/               Zustand application stores
  styles/               Tailwind and design tokens
  test/                 Test environment setup
  types/                Shared domain contracts
tests/e2e/              Playwright tests
```

As the product grows, feature folders may add `components`, `hooks`, `schemas`, `services`, and `tests` locally. Engineering calculations remain under `src/core` and cannot import React or Firebase.

## Architecture

- **Feature-based modular architecture:** Route-level business features own their UI and schemas.
- **Application layer:** Router, shell, providers, theme, locale, and notifications.
- **Infrastructure layer:** Firebase initialization from validated environment variables.
- **Engineering core boundary:** Deterministic pure TypeScript only; no UI or persistence imports.
- **2D FEM analysis engine:** Linear elastic Euler-Bernoulli frame elements with 3 DOF per node, dense matrix assembly, nodal loads, uniform local element loads, restraints, reactions, and local element end-force recovery.
- **Straight beam load diagrams:** Load case domain model, automatic self-weight, UDL and point load mapping, FEM-backed reactions, shear, moment, rotation, and deflection samples.
- **Global member screening:** Traceable gross-section flexural, shear, axial, axial-flexure, and supplied serviceability-limit calculations. Stability and local buckling are intentionally not evaluated without a selected standard.
- **Cellular action extraction:** Interpolated opening, tee, Vierendeel-demand, and web-post actions from the elastic beam analysis. No resistance, utilization, or PASS/FAIL is produced for cellular checks without a selected standard.
- **Connection action extraction:** Longitudinal weld demand schedule and concentrated-load proximity review for stiffener detailing. No weld or local web capacity is claimed without selected code equations.
- **Presentation layer:** Responsive React components and shadcn/ui-compatible primitives styled with Tailwind CSS.

## Coding conventions

- TypeScript strict mode is mandatory; avoid `any` and unsafe assertions.
- Calculation code must be pure, deterministic TypeScript.
- UI components must not contain engineering formulas.
- Firebase services must not perform engineering calculations.
- Use Zod at environment, form, API, and persistence boundaries.
- Store SI coherent canonical values internally when quantity work begins.
- Do not round intermediate engineering values.
- Do not display mock calculations as real results; demonstration content must be labeled.
- Every standards formula will require source document, edition, clause, assumptions, and applicability before implementation.
- Add unit tests beside domain behavior and Playwright coverage for critical user workflows.
- Run typecheck, lint, tests, and build before each phase is considered complete.

## Current limitations

Phase 8 produces cellular opening, tee, Vierendeel-demand, and web-post action schedules only; it is not a resistance check. Lateral-torsional buckling, local buckling, code-specific resistance factors, cellular opening stress resistance, Vierendeel capacity, web-post buckling, weld capacity, nonlinear effects, and report generation remain unimplemented. Phase 4 geometry limitations still apply: asymmetric parent sections, reinforcement, stiffeners, camber, exclusion zones, and fabrication-ready detailing are deferred. Run Firebase emulators before rule-integration development with `npm run test:rules`.
