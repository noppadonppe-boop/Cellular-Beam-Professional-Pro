# Cellular Beam Professional

Phases 1–2 establish a production-oriented Vite + React foundation and a verified engineering quantity, material, and symmetric I-section property core. Structural analysis has deliberately **not** started.

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
    quantities/ materials/ sections/ schemas/ fem/ standards/
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

Authentication actions, structural analysis, cellular-beam checks, design checks, and report generation remain intentionally unimplemented. Phase 2 supports unit-safe quantities, material contracts, custom symmetric I-sections, property calculations, verification benchmarks, and a Firestore section repository adapter.
