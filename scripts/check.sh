#!/usr/bin/env bash
# The one command that says whether this repo is ready: every gate CI runs,
# in the same order. Stops at the first failure.
set -euo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n== %s\n' "$1"; }

step "Typecheck";       npm run --silent typecheck
step "Lint";            npm run --silent lint
step "Tokens current";  npm run --silent check:tokens
step "Contrast";        npm run --silent check:contrast
step "Public safety";   npm run --silent check:banned
step "Build Storybook"; npm run --silent build-storybook
step "Accessibility";   npm run --silent check:a11y

printf '\nAll checks passed.\n'
