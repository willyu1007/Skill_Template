# Key operations record

This file summarizes the high-impact changes made while refactoring the directory into a provider-agnostic Agent Skills structure.

## 1) Provider-specific content removed
- Removed provider/model-specific frontmatter keys (e.g., `model`, `color`, `allowed-tools`, command-only hints) and rewrote content to be provider-agnostic.
- Replaced references to provider-specific caches and environment variables with generic “project/tooling” language.

## 2) Repo-specific paths/scripts generalized (dev-docs exception)
- For all non-dev-docs skills:
  - Removed hard-coded repository paths and script names.
  - Kept guidance focused on *capabilities* and *verification behavior* (what to run/observe), rather than exact project commands.
- For dev-docs skills:
  - Kept an explicit `dev/active/<task-name>/` style layout as an allowed exception.

## 3) Skills structure normalized
- Every skill now lives in its own directory and exposes **exactly one** `SKILL.md`.
- Each `SKILL.md` uses a minimal YAML frontmatter with:
  - `name`: matches the skill directory name
  - `description`: concise trigger-oriented description
- Long code blocks and reusable scaffolds were moved into:
  - `./examples/`
  - `./templates/`

## 4) Complete-example documents converted into examples (per progressive disclosure)
The following documents were **removed as standalone skills** and their content was split into focused examples:

- `skills_backend/complete-examples/complete-examples.md`
  - Distributed into:
    - `backend/http/implement-backend-routing-and-controllers/examples/`
    - `backend/data/build-service-and-repository-layers/examples/`
    - `backend/validation/validate-backend-inputs/templates|examples/`

- `skills_frontend/complete-examples/complete-examples.md`
  - Distributed into:
    - `frontend/components/build-react-components/examples/`
    - `frontend/data/fetch-frontend-data/examples/`
    - `frontend/routing/implement-frontend-routing/examples/`
    - `frontend/organization/organize-frontend-codebase/examples/`

## 5) Cross-skill links removed
- Removed “See also / Related docs / References” style cross-linking between skills.
- Skills may reference their own `./examples/` and `./templates/` only.

## 6) Two-level classification applied
Skills were grouped by:
- Level 1: `backend/`, `frontend/`, `workflows/`
- Level 2: focused subcategories (including `common`)

## 7) Source-to-target mapping

### Agents (workflow-style documents)
- `agents/auth-route-debugger/auth-route-debugger.md`
  → `workflows/backend/debug-authenticated-routes/SKILL.md`
- `agents/auth-route-tester/auth-route-tester.md`
  → `workflows/backend/test-authenticated-routes/SKILL.md`
- `agents/auto-error-resolver/auto-error-resolver.md`
  → `workflows/common/resolve-typescript-build-errors/SKILL.md`
- `agents/code-architecture-reviewer/code-architecture-reviewer.md`
  → `workflows/common/review-code-architecture/SKILL.md`
- `agents/code-refactor-master/code-refactor-master.md`
  → `workflows/common/execute-code-refactor/SKILL.md`
- `agents/documentation-architect/documentation-architect.md`
  → `workflows/documentation/author-developer-documentation/SKILL.md`
- `agents/frontend-error-fixer/frontend-error-fixer.md`
  → `workflows/common/fix-frontend-runtime-errors/SKILL.md`
- `agents/plan-reviewer/plan-reviewer.md`
  → `workflows/planning/review-implementation-plans/SKILL.md`
- `agents/refactor-planner/refactor-planner.md`
  → `workflows/planning/plan-code-refactors/SKILL.md`
- `agents/web-research-specialist/web-research-specialist.md`
  → `workflows/research/perform-web-research/SKILL.md`

### Commands
- `commands/dev-docs/dev-docs.md`
  → `workflows/dev-docs/create-dev-docs-plan/SKILL.md`
- `commands/dev-docs-update/dev-docs-update.md`
  → `workflows/dev-docs/update-dev-docs-for-handoff/SKILL.md`
- `commands/route-research-for-testing/route-research-for-testing.md`
  → `workflows/backend/map-route-changes-for-testing/SKILL.md`

### Backend skills
- `skills_backend/backend_guideline/backend_guideline.md`
  → `backend/common/apply-backend-service-guidelines/SKILL.md`
- `skills_backend/architecture-overview/architecture-overview.md`
  → `backend/architecture/design-layered-backend-architecture/SKILL.md`
- `skills_backend/routing-and-controllers/routing-and-controllers.md`
  → `backend/http/implement-backend-routing-and-controllers/SKILL.md`
- `skills_backend/middleware-guide/middleware-guide.md`
  → `backend/middleware/build-backend-middleware/SKILL.md`
- `skills_backend/services-and-repositories/services-and-repositories.md`
  → `backend/data/build-service-and-repository-layers/SKILL.md`
- `skills_backend/database-patterns/database-patterns.md`
  → `backend/data/apply-backend-database-patterns/SKILL.md`
- `skills_backend/validation-patterns/validation-patterns.md`
  → `backend/validation/validate-backend-inputs/SKILL.md`
- `skills_backend/async-and-errors/async-and-errors.md`
  → `backend/errors/handle-backend-async-errors/SKILL.md`
- `skills_backend/configuration/configuration.md`
  → `backend/config/manage-backend-configuration/SKILL.md`
- `skills_backend/testing-guide/testing-guide.md`
  → `backend/testing/test-backend-services/SKILL.md`
- `skills_backend/sentry-and-monitoring/sentry-and-monitoring.md`
  → `backend/observability/instrument-backend-observability/SKILL.md`
- `route-tester/SKILL.md`
  → `backend/testing/smoke-test-authenticated-api-routes/SKILL.md`

### Frontend skills
- `skills_frontend/frontend_guideline/frontend_guideline.md`
  → `frontend/common/apply-frontend-ui-guidelines/SKILL.md`
- `skills_frontend/common-patterns/common-patterns.md`
  → `frontend/common/apply-frontend-common-patterns/SKILL.md`
- `skills_frontend/component-patterns/component-patterns.md`
  → `frontend/components/build-react-components/SKILL.md`
- `skills_frontend/data-fetching/data-fetching.md`
  → `frontend/data/fetch-frontend-data/SKILL.md`
- `skills_frontend/routing-guide/routing-guide.md`
  → `frontend/routing/implement-frontend-routing/SKILL.md`
- `skills_frontend/loading-and-error-states/loading-and-error-states.md`
  → `frontend/ux/handle-frontend-loading-and-errors/SKILL.md`
- `skills_frontend/styling-guide/styling-guide.md`
  → `frontend/styling/style-frontend-ui/SKILL.md`
- `skills_frontend/performance/performance.md`
  → `frontend/performance/optimize-frontend-performance/SKILL.md`
- `skills_frontend/typescript-standards/typescript-standards.md`
  → `frontend/typescript/apply-frontend-typescript-standards/SKILL.md`
- `skills_frontend/file-organization/file-organization.md`
  → `frontend/organization/organize-frontend-codebase/SKILL.md`
