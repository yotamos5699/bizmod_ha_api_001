# Render runtime troubleshooting guideline

Use this guide when the app works locally but fails on Render after upgrading dependencies such as `mongoose`.

## What this guide is for

This repository has already hit **two different deployment failures caused by Node.js version mismatches**:

1. **Node too old** for newer MongoDB / Mongoose code
2. **Node too new** for older JWT transitive dependencies

The goal is to help another GPT instance diagnose the problem quickly instead of treating it like a database or code bug.

## Known-good deployment settings for this repo

- `mongoose`: `^9.4.1`
- `mongodb` transitively via Mongoose: `7.1.1`
- `jsonwebtoken`: `^8.5.1`
- Production start command: `node index.js`
- Dev start command: `nodemon index.js`
- Safe Node range on Render: `>=20.19.0 <23.0.0`

## Known failure patterns

### 1) Error: `SyntaxError: Unexpected token '??='`

Example:

- file path contains `node_modules/mongodb/...`
- crash happens before app startup completes

Meaning:

- Render is using a **too-old Node.js version** for the installed MongoDB driver
- In this repo, that happened when deployment was effectively pinned to Node 14

Fix:

- raise the lower bound in `package.json -> engines.node`
- for this repo, use `>=20.19.0 <23.0.0`

### 2) Error in `buffer-equal-constant-time` / `SlowBuffer.prototype.equal`

Example:

- stack mentions:
  - `buffer-equal-constant-time`
  - `jwa`
  - `jws`
  - `jsonwebtoken`
- error looks like:
  - `TypeError: Cannot read properties of undefined (reading 'prototype')`

Meaning:

- Render is using a **too-new Node.js version**
- In this repo, Node 25 caused this because `jsonwebtoken@8.5.1` depends on an older stack that is not happy there

Fix:

- add an **upper bound** to `package.json -> engines.node`
- for this repo, use `>=20.19.0 <23.0.0`

## Why this happens on Render but not locally

Usually local development runs on a different Node version than Render.

Render can also select a different version than expected if:

- `package.json` has a broad or wrong `engines.node`
- a `NODE_VERSION` environment variable is set in the Render dashboard
- `.node-version` or `.nvmrc` exists and overrides expectations
- lockfiles are stale and the deployed dependency graph differs from local

## Render version precedence to check

From highest priority downward:

1. `NODE_VERSION` environment variable in Render
2. `.node-version`
3. `.nvmrc`
4. `package.json -> engines.node`

If a deployment still uses the wrong Node version, check for overrides in that order.

## Required investigation steps for another GPT instance

When troubleshooting this class of issue, do the following in order:

1. Read `package.json`
2. Read `package-lock.json` and `pnpm-lock.yaml` if both exist
3. Check the Render logs for the **exact Node version selected**
4. Inspect the failing package in the stack trace
5. Inspect the installed package metadata in `node_modules/<package>/package.json`
6. Compare dependency engine requirements with the runtime version in Render
7. Decide whether the fix is:
   - increasing the minimum Node version
   - adding an upper bound to avoid a too-new Node version
   - or both
8. Sync the lockfile after changing `package.json`
9. Recommend redeploying with **Clear build cache**
10. Tell the user to verify there is no overriding `NODE_VERSION` env var in Render

## Repo-specific facts already verified

- `mongoose@9.4.1` requires Node `>=20.19.0`
- `mongodb@7.1.1` requires Node `>=20.19.0`
- `jsonwebtoken@8.5.1` can fail on Node 25 because of older transitive dependencies
- This repo should deploy on **Node 20 or 22**, not 14 and not 25
- `package-lock.json` must be kept in sync with `package.json`
- This repo currently uses `npm i` on Render, so `package-lock.json` matters

## Recommended remediation for this repo

Use this exact `engines` value:

- `>=20.19.0 <23.0.0`

Keep these scripts:

- `start`: `node index.js`
- `dev`: `nodemon index.js`

After changing versions:

1. commit both `package.json` and `package-lock.json`
2. push to GitHub
3. in Render, redeploy with **Clear build cache**
4. confirm logs show a Node 20.x or 22.x runtime

## Things not to assume too early

Do **not** assume the problem is:

- MongoDB credentials
- Mongoose connection code
- Linux-only app code bugs
- broken business logic

If the stack trace dies inside `node_modules` before app startup, suspect a runtime/dependency mismatch first.

## Prompt template for a separate GPT instance

Use the following prompt:

---

You are debugging a Node.js deployment issue on Render for a repository that works locally but fails in production.

Your job:

1. Read `package.json`, `package-lock.json`, and `pnpm-lock.yaml` if present.
2. Read the deployment logs and identify the exact Node.js version Render selected.
3. Match the stack trace to the package that is crashing.
4. Inspect `node_modules/<package>/package.json` for engine requirements when relevant.
5. Determine whether the root cause is:
   - Node too old for the installed package versions
   - Node too new for an older dependency chain
   - stale lockfiles causing dependency drift
6. Prefer a minimal fix:
   - correct `package.json -> engines.node`
   - keep an upper bound
   - sync `package-lock.json`
7. For this repo, treat `>=20.19.0 <23.0.0` as the current safe deployment range unless evidence proves otherwise.
8. Explicitly check for Render overrides in this order:
   - `NODE_VERSION` env var
   - `.node-version`
   - `.nvmrc`
   - `package.json`
9. Recommend redeploying with cleared build cache after the fix.

Known repo-specific facts:

- `mongoose@9.4.1` and `mongodb@7.1.1` need modern Node
- `jsonwebtoken@8.5.1` may fail on Node 25 because of older transitive dependencies (`jwa`, `jws`, `buffer-equal-constant-time`)
- safe deployment range currently: `>=20.19.0 <23.0.0`

Output expected:

- root cause
- exact minimal fix
- files to change
- redeploy instructions for Render
- anything that could still override the fix

---

## Short version

If Render shows Node 14 and MongoDB driver syntax errors, raise the minimum Node version.

If Render shows Node 25 and JWT / `buffer-equal-constant-time` crashes, add an upper bound.

For this repo, the safe answer is:

- `"engines": { "node": ">=20.19.0 <23.0.0" }`
