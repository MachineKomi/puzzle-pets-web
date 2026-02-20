# AI-DLC Docs Package Overview

## Preamble
I have created these tightened, cleaned, refined, reusable artefacts that can be dropped into existing or greenfield repositories. This set was assembled after I discovered gaps and sequencing errors in the materials shared by AWS following the Toronto workshop. The goal is to provide a clearer, more reliable, and more reusable AI-DLC asset pack for teams to adopt quickly.

## Repository structure
```
.
├── aidlc-best-practice-method-principles.md
├── aidlc-method-definition.md
└── prompts
    ├── brownfield-backend.md
    ├── brownfield-frontend.md
    ├── greenfield-backend.md
    ├── greenfield-frontend.md
    └── sys-prompt-aidlc-agent.md
```

## File-by-file summary
- `aidlc-best-practice-method-principles.md`: Synthesizes AI-DLC principles and a reference lifecycle (inception, construction, operations), clarifies gates and artifacts, and aligns the method with AWS AI-DLC and MCP practices. Includes guidance on units, evidence, and organizational operating model.
- `aidlc-method-definition.md`: A full AI-DLC method definition paper covering principles, artifacts, phases/rituals, workflows, and example scenarios for greenfield and brownfield work, plus an appendix of practice prompts.
- `prompts/brownfield-backend.md`: A structured prompt for safe backend enhancements with mandatory discovery, semantic modeling, regression baselines, and staged approval gates.
- `prompts/brownfield-frontend.md`: A structured prompt for safe frontend enhancements emphasizing discovery, regression protection, runtime browser validation, and explicit change impact controls.
- `prompts/greenfield-backend.md`: A structured prompt for building new backends with plans, approvals, unit decomposition, design, verification evidence, and operations readiness.
- `prompts/greenfield-frontend.md`: A structured prompt for building new frontends with explicit inception artifacts, unitized construction, runtime validation, and production readiness gates.
- `prompts/sys-prompt-aidlc-agent.md`: A system prompt that encodes the AI-DLC operating rules, artifact model, phases, gates, and MCP tooling baseline for consistent agent behavior.

## Highlighted resource for R&D teams
A highly relevant reference implementation to complement these artefacts:
- `https://github.com/awslabs/aidlc-workflows`
