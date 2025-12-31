# Stage A - Requirements

## Goal

Produce a verifiable set of requirement documents under `init/stage-a-docs/`.

## Outputs

| File | Purpose |
|------|---------|
| `requirements.md` | Goals, non-goals, user journeys |
| `non-functional-requirements.md` | Performance, security, availability |
| `domain-glossary.md` | Key terms definitions |
| `risk-open-questions.md` | Unresolved decisions |

## Definition of Done

- [ ] `requirements.md` has explicit Goals (MUST) and Non-goals (OUT)
- [ ] User journeys have acceptance criteria
- [ ] `non-functional-requirements.md` has measurable targets or TBD items
- [ ] `domain-glossary.md` defines all domain terms
- [ ] `risk-open-questions.md` consolidates all TBD (owner + options + due)

## Commands

```bash
# Validate docs
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs check-docs

# Approve and advance to Stage B
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage A
```

## See also

- Templates: `init/skills/initialize-project-from-requirements/templates/`
- Full reference: `init/reference.md`
