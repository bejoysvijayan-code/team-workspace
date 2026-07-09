# Team workspace — Phase 1 (working model)

A React + Vite app for a small freelance creative team (Owner + designers).
This is Phase 1: functionality first, local state only (no backend yet),
minimal default styling. Design polish and Supabase/auth come in later phases —
see `freelance-crm-app-spec.md` in the parent folder for the full plan.

## Run it locally

    npm install
    npm run dev

Then open the printed local URL in your browser.

## Try it out

Use the "Viewing as" dropdown in the top bar to switch between the Owner
and each designer (Aravind, Nisha) — this simulates the role-based permissions
that a real login system will enforce later. As Owner you see the dashboard,
project boards, invoices, and client/team management. As a designer you only
see "My tasks" (just what's assigned to you) and the shared Learning space.

## Deploying to GitHub Pages later

1. Push this project to a new GitHub repo.
2. In `vite.config.js`, set `base: '/your-repo-name/'`.
3. Add the `gh-pages` package (or a GitHub Actions workflow) to publish `dist/`
   to the `gh-pages` branch, then enable Pages in the repo settings.

See the full spec doc for Phase 2 (design) and Phase 3 (bug fixing) plans.
