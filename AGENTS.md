# Repository Guidelines

## Project Structure & Module Organization
- `src/` — React source (JSX). Components in `PascalCase` (e.g., `Matches.jsx`, `Filepath.jsx`).
- `index.html` — Vite entry; mounts `src/main.jsx`.
- `public/` — Static assets served as‑is.
- `docs/` — Project docs and screenshots.
- `dist/` — Build output (generated).
- Config: `vite.config.js`, `tailwind.config.js`, `eslint.config.js`, `.editorconfig`.

## Build, Test, and Development Commands
- `npm run dev` — Start Vite at `http://localhost:5173/`.
- `npm run build` — Production build to `dist/`.
- `npm run preview` — Serve the production build locally.
- `npm run lint` — Run ESLint (flat config) on the repo.

## Coding Style & Naming Conventions
- Language: React + JSX (ESM), always use line-ending semicolons
- Files: Components `PascalCase.jsx`; utilities `camelCase.js`.
- Imports use relative paths and ESM.
- Linting: ESLint with React, Hooks, and Refresh plugins; fix warnings before PR.
- Styling: TailwindCSS; prefer utility classes over ad‑hoc CSS.
- Prefer double quotes over single quotes.
- Don't add any comments, use descriptive variable names instead
- In variable names don't shorten term length name (e.g. "description" instead of "desc", "index instead of "idx"). In arrow functions shorthands may be use.
- Prefer creating a new component instead of adding a bunch of JSX to an existing component. Only do this if the new component is actually a distinct unit.

## Testing Guidelines
- No unit test suite yet. Validate via:
  - `npm run lint` clean.
  - Manual run: start dev server, search sample queries, verify highlights and links render correctly.
- If adding logic, include small, isolated modules to ease future tests.

## Commit & Pull Request Guidelines
- Commits: Short, imperative messages (e.g., "Add Makefile and deploy command"). Group related changes.
- PRs: Clear description, rationale, steps to verify, and screenshots for UI changes. Link issues where applicable.
- Keep diffs focused; avoid unrelated refactors.

## Security & Configuration Tips
- Elasticsearch endpoint lives in `src/queryElasticsearch.js`. For local ES, update the URL and ensure CORS allows `http://localhost:5173/` (see `README.md`).
- Do not commit secrets or private indices. `make deploy` is for maintainers.

## Colorscheme
Prefer these colors.
- Grey — #1c1c1c
- White — #d0d0d0
- Blue — #005fd7
- Bright Green — #00ff5f
- Light Red — #ff5f5f
- Bright Red — #d70000
- Yellow — #ffd700
- Magenta — #ff005f
