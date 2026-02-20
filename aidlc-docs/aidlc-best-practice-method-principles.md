## AI-DLC best-practice methodology and principles

### Expert panel viewpoints (to anchor the synthesis)

**1) Software engineering (control-systems view)**

* AI is a high-gain actuator: it can generate plans, code, and docs fast, but it is noisy. You stabilize it with tight feedback loops (tests, linting, reviews), small batches (units), and explicit gates (approval to proceed).
* The “unit of work” must be redesigned: the real accelerator is decomposition + verification, not “more tokens per prompt”.

**2) DevSecOps / reliability**

* Treat AI output as untrusted until verified. Default every “done” claim to “needs proof” (tests, scans, runtime checks, observability).
* If AI increases change volume, your bottleneck shifts to review, integration, and deployment safety. You must upgrade gates and automation, or quality collapses.

**3) Product / discovery**

* AI-DLC only works when intent is made explicit (outcomes, constraints, acceptance criteria). Vague intent creates rework at machine speed.
* Strong requirements capture is not bureaucracy; it is context compression that reduces hallucination and churn.

**4) Change leadership**

* Adoption is a cultural refactor: new rituals, new role expectations (“humans as approvers and system designers”), and deliberate practice. Trust rises through repeated, visible proof, not policy.

### Synthesis: an AI-DLC reference method (portable, AWS-aligned)

AI-DLC is not “SDLC + copilots”. It is a workflow where AI repeatedly (a) proposes a plan, (b) collects missing info, (c) executes, (d) proves results, and (e) persists artifacts so future work has durable context. This mirrors AWS’s framing: AI generates a plan, asks clarifying questions, implements only after validation, and repeats this for each SDLC activity.

---

## 1) Core principles (the “non-negotiables”)

1. **Human accountability is the loss function**

* Humans own decisions and outcomes; AI proposes and executes within bounds. This is the “plan-then-validate-then-implement” loop.

2. **Plan-first, stage-by-stage**

* Every meaningful step starts with an explicit plan (with checkpoints) and an approval gate before execution. (This is explicit in the AI-DLC workflows and sample usage: review plans, approve each stage.) ([GitHub][1])

3. **Small, coherent “units” over big batches**

* Decompose into units that can be built and verified independently (bounded contexts/components). AWS describes “units” and time-boxed “bolts” to keep delivery incremental.

4. **Persisted artifacts are first-class**

* AI-DLC relies on durable artifacts (requirements, plans, designs, decisions, audit trail) stored in-repo, not in chat history. ([GitHub][1])

5. **Adaptive depth: “exactly enough detail”**

* Execute only stages that add value for this request, and generate the level of detail needed (not a fixed ceremony). ([DeepWiki][2])

6. **Proof over prose**

* “Done” requires objective evidence: tests passing, checks green, runtime behavior validated, cost and security reviewed.

7. **Tooling is for truth, not vibes**

* Use authoritative retrieval (docs/pricing) and runtime inspection (browser/devtools) to reduce hallucinations and mis-implementation. ([awslabs.github.io][3])

8. **Separation of concerns in prompts and agents**

* Use explicit roles (PM, architect, engineer, QA, ops) and bounded tasks. Your attached prompts do this well (role-per-step + approval gate).

9. **Safety constraints are explicit**

* Define what data can be shared with tools/models, what tools are allowed, and where automation must stop for approval. AWS MCP servers explicitly note you are responsible for compliant use. ([GitHub][4])

10. **Continuous prompt/rule improvement**

* Treat prompts, rules, and guardrails as code: version, review, and tune them based on failure modes (a key theme in Ralph-style “add signs where the agent falls off the slide”). ([Geoffrey Huntley][5])

---

## 2) Reference lifecycle: phases, stages, gates, and outputs

AWS frames AI-DLC as a three-phase lifecycle: **Inception (what/why), Construction (how), Operations (run/monitor)**. ([GitHub][1])

A practical reference model (merge of AWS workflows + your greenfield/brownfield/frontend prompts):

### Phase A: Inception (WHAT + WHY)

**Goal:** Convert intent into testable, decomposed work.

**Typical stages (adaptive, but with mandatory core):**

* Workspace/project detection (greenfield vs brownfield)
* Requirements analysis and validation (mandatory)
* Workflow planning (mandatory)
* Optional as needed: reverse engineering (brownfield), user stories, application design, unit generation

**Primary artifacts (persisted):**

* `intent.md` (one paragraph + success metrics)
* `requirements.md` (functional + constraints)
* `nfr.md` (security, performance, availability, compliance)
* `execution-plan.md` (stage sequence + rationale)
* `units/` (each unit: scope, acceptance criteria, dependencies)

**Gate:** “Inception exit” = requirements + units approved.

### Phase B: Construction (HOW)

**Goal:** Build units with proof.

**Stages (repeat per unit):**

* Functional design (conditional)
* NFR requirements + NFR design (conditional)
* Infrastructure design (conditional)
* Code generation (mandatory)
* Build-and-test loop (mandatory) ([DeepWiki][6])

**Primary artifacts:**

* For each unit:

  * `design.md` (domain model, APIs, data model, key tradeoffs)
  * `tasks-plan.md` (checkbox plan)
  * `validation-report.md` (what ran, results, gaps)
* Code in normal repo structure (recommended) with trace back to unit acceptance criteria.

**Gate:** unit done = tests + checks green, acceptance criteria met, review complete.

### Phase C: Operations (WHERE/WHEN to run it)

AWS’s public workflows note Operations is still a placeholder/future area in the rule set, but enterprise practice should treat it as real work now. ([DeepWiki][7])

**Goal:** Productionize with safety and observability.

**Artifacts:**

* IaC plan + IaC implementation
* CI/CD pipeline updates
* Runbooks + dashboards + alerts
* Cost model and scaling assumptions
* Security review evidence

**Gate:** production readiness = deployable, observable, rollbackable.

---

## 3) Artifact and state model (what to standardize in your org)

AWS AI-DLC workflows emphasize persistent state tracking and auditability:

* State file (phase/stage/completion)
* Immutable audit log
* Execution plan file
* Phase directories for artifacts ([DeepWiki][8])

Recommended canonical structure (portable across tools):

```
/aidlc-docs/                      # durable AI-DLC artifacts (versioned)
  aidlc-state.md                  # current phase/stage + completion
  execution-plan.md               # planned stages + rationale
  audit.md                        # append-only log (timestamped)
  inception/
    intent.md
    requirements.md
    nfr.md
    user-stories.md
    application-design.md
    units/
      unit-01.md
      unit-02.md
  construction/
    unit-01/
      design.md
      tasks-plan.md
      validation-report.md
    unit-02/...
  operations/
    deployment-plan.md
    runbooks.md
    observability.md
    cost.md
```

If you also want per-feature isolation (useful for parallel efforts), the unofficial AI-DLC MCP server demonstrates a `.aidlc/<feature>/...` approach with phase tracking in `current_phase.json`. ([GitHub][9])

Best-practice rule: **artifacts are immutable evidence; plans are editable until approved; code is always verified.**

---

## 4) Interaction model: how humans “steer” without micromanaging

Two patterns show up strongly in the AWS workflows:

### A) File-based, structured Q&A (recommended for enterprise)

AI-DLC uses a file-based interaction model with structured answer tags so responses persist, can be reviewed, and can be validated mechanically (vs fragile chat parsing). ([DeepWiki][10])

Use this when:

* requirements are complex
* multiple stakeholders must review
* you need auditability

### B) Chat-based clarifications (useful for speed, but less auditable)

The unofficial AI-DLC MCP server demonstrates chat-based clarifications and phase tracking, which is useful for “keep moving” flows, but you should still persist decisions into artifacts. ([GitHub][9])

---

## 5) Workflow variants (from your attached prompts)

### Greenfield (build new)

Best practice:

* Inception: user stories -> units (approve both) before design/coding
* Construction: per-unit design (DDD optional) -> implement -> validate
* Operations: deployment plan + validation report

This matches your greenfield prompt pattern: plan with checkboxes, ask for approval, execute stepwise, mark completion.

### Brownfield (enhance existing)

Add a mandatory “Discovery and Analysis” front-stage:

* Create an analysis plan
* Produce a current-state analysis (architecture, dependencies, integrations, infra, constraints)
* Then proceed with inception using that analysis as context

This mirrors both your brownfield prompt and the AWS idea of conditional reverse engineering for brownfield work. ([DeepWiki][2])

### Frontend (behavior must be proven in the browser)

Your frontend prompt correctly adds:

* “preserve existing working behavior” as a primary constraint
* runtime validation using Chrome DevTools MCP against a reference system
* bounded iteration loops per unit (max iterations) and a final completion report

This aligns with why Chrome built a DevTools MCP server: coding agents need visibility into what code does in the browser (DOM, network, performance) to debug/validate effectively. ([Chrome for Developers][11])

---

## 6) MCP integration as an AI-DLC “context supply chain”

MCP servers are a practical way to feed authoritative context and tooling into agent workflows. AWS MCP servers describe MCP as an open protocol connecting LLM applications to tools/data sources, with stdio transport emphasized in AWS’s servers. ([GitHub][4])

### Recommended MCP servers by phase

**Inception**

* **AWS Documentation MCP**: read/search docs and convert to markdown for citations and accurate constraints. ([awslabs.github.io][3])
* **AWS Pricing MCP**: get real-time pricing and cost analysis, but treat results as advisory (it explicitly warns filters may be wrong and “cheapest” may not be found). ([awslabs.github.io][12])
* **AWS Diagram MCP**: generate architecture diagrams (AWS, sequence, flow, etc.) as living artifacts. ([awslabs.github.io][13])

**Construction**

* Docs MCP: correct APIs and edge cases
* Diagram MCP: sequence/flow diagrams tied to unit designs
* Chrome DevTools MCP: validate UI behavior, debug regressions, check network/perf

**Operations**

* Pricing MCP: cost review and tradeoffs
* Docs MCP: IaC and service configuration correctness
* Diagram MCP: operational diagrams (deployment topology, incident flows)

### Enterprise guardrails for MCP

* Only enable servers you need for the current stage (context economy).
* Define a data policy: what can be sent to servers/tools and what cannot.
* For AWS MCP servers: note SSE removal (May 26, 2025) and stdio focus may affect client compatibility; standardize your client transport expectations. ([GitHub][4])

---

## 7) The “Ralph loop” and how to use it without breaking enterprise control

Ralph is, at core, looping an agent until completion. Huntley’s canonical example is literally a shell loop feeding a prompt file into the agent. ([Geoffrey Huntley][5])
In Claude Code’s ecosystem, the Ralph loop is exposed as a plugin workflow with explicit safety controls like `--max-iterations` and `--completion-promise`. ([Awesome Claude][14])

### Where Ralph-style looping fits AI-DLC

Use it **inside Construction**, within a unit, when:

* success criteria are objective (tests/linters)
* you are operating in an isolated branch/worktree
* you have an iteration cap and “stuck” behavior

This is conceptually the same as the AI-DLC “build-and-test” loop stage. ([DeepWiki][6])

### Where it does NOT fit

Avoid Ralph-style autonomy for:

* requirements and design decisions (needs human judgment and approvals)
* security-sensitive changes without review
* production debugging with unclear success criteria

Practical enterprise rule:

* **Ralph can execute; AI-DLC still governs.** Approval gates remain mandatory; looping cannot bypass them.

---

## 8) Operating model and rituals (cultural transformation that makes this stick)

AWS describes new team collaboration modes like “Mob Elaboration” (intent/requirements) and “Mob Construction” (building) where teams work together with AI generating and refining artifacts.

Recommended roles (minimal set):

* **Product/Domain**: owns intent, success metrics, scope boundaries
* **Tech lead / Architect**: owns unit boundaries, NFRs, integration decisions
* **Engineer(s)**: own implementation + tests + reviews
* **QA**: owns test strategy and acceptance evidence
* **Security**: owns threat modeling + controls evidence
* **Ops/SRE**: owns deployability and observability evidence
* **AI workflow maintainer**: owns prompts/rules/MCP configuration as “process code”

Rituals to standardize:

* **Mob Elaboration (30-60 min)**: answer structured questions, approve inception artifacts.
* **Bolt planning (15 min)**: pick next units, confirm dependencies, confirm gates.
* **Mob Construction (60-120 min)**: AI executes unit tasks; humans review decisions and proofs.
* **Guardrail retro (15 min)**: update prompts/rules/signs based on failure modes.

---

## 9) Metrics that won’t lie

If AI-DLC is working, you should see improvements in:

* Lead time from intent -> production (end-to-end)
* Deployment frequency and batch size (smaller, safer)
* Change failure rate and MTTR (quality under speed)
* Review throughput and “rework rate” (how often AI work is redone)
* Defect escape rate (post-release incidents/bugs)
* Cost-to-deliver per unit (including model/tool spend)

Key anti-metric:

* “Lines of code generated” (irrelevant; encourages bloat).

---

## Assumptions

* You want a methodology that is tool-agnostic but AWS-aligned (Amazon Q Rules + MCP are treated as one implementation path).
* Your teams can store AI-DLC artifacts in-repo (or an internal equivalent) and will enforce review/approval gates.
* You want brownfield, greenfield, and frontend patterns unified into one method with variants.

Limitations in source access:

* The “Method Definition Paper” at the Amplify link appears to be a JS app and was not retrievable in this environment; this synthesis therefore relies on AWS blog content, AWS workflow repositories/docs, MCP server docs, and your attached prompts and slide/transcript materials.

---

## Trade-offs and risks

* **Speed shifts the bottleneck**: faster generation can overload review, CI, and integration. Mitigation: smaller units, stronger automation, explicit gates.
* **Context debt**: if artifacts are not maintained, the system regresses to chat-vibes and hallucinations. Mitigation: enforce artifact persistence and audits.
* **Security and data leakage**: MCP/tools may touch sensitive data. Mitigation: least-privilege credentials, tool allowlists, redaction rules, sandboxing.
* **Over-automation** (Ralph-style): loops can create large, hard-to-review diffs. Mitigation: max iterations, small scoped prompts, isolated branches, mandatory PR review.
* **Process theater**: too many artifacts if not adaptive. Mitigation: “exactly enough detail” principle and stage skipping when justified. ([DeepWiki][2])

---

## Next actions

1. **Standardize the artifact model**

* Pick `aidlc-docs/` (AWS workflow-aligned) vs `.aidlc/` (per-feature) and define mandatory files: state, execution plan, audit, requirements, units.

2. **Codify gates**

* Define hard stops: inception approval, per-unit plan approval, PR approval, production readiness approval.

3. **Package prompt sets**

* Convert your greenfield/brownfield/frontend prompts into versioned templates:

  * “Role-per-step”
  * “Plan with checkboxes”
  * “Evidence required”
  * “Max iteration caps”

4. **Define an MCP baseline**

* Start with 3 servers: Documentation, Diagram, Chrome DevTools (for UI teams). Add Pricing when cost modeling is required. ([awslabs.github.io][3])

5. **Run one pilot end-to-end**

* Pick one bounded feature (1-3 units) with clear acceptance criteria and automated tests.
* Capture: cycle time, rework, defect escape, and “where did humans still spend time”.

6. **Institutionalize practice**

* Run recurring “Mob Elaboration” and “Mob Construction” sessions.
* Maintain a shared “guardrail backlog” (prompt/rule improvements based on failures).

---

## Sources (clean URLs)

```text
https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/
https://aws.amazon.com/blogs/devops/building-with-ai-driven-development-life-cycle-ai-dlc-using-amazon-q-developer/
https://github.com/aws-samples/sample-aidlc-workflows
https://deepwiki.com/awslabs/aidlc-workflows
https://github.com/awslabs/mcp
https://awslabs.github.io/mcp/servers/aws-documentation-mcp-server
https://awslabs.github.io/mcp/servers/aws-pricing-mcp-server
https://awslabs.github.io/mcp/servers/aws-diagram-mcp-server
https://github.com/ChromeDevTools/chrome-devtools-mcp
https://developer.chrome.com/blog/chrome-devtools-mcp
https://github.com/j-thurston/aidlc-mcp
https://ghuntley.com/ralph/
https://awesomeclaude.ai/ralph-wiggum
```

[1]: https://github.com/aws-samples/sample-aidlc-workflows "https://github.com/aws-samples/sample-aidlc-workflows"
[2]: https://deepwiki.com/awslabs/aidlc-workflows/3.2-adaptive-intelligence "https://deepwiki.com/awslabs/aidlc-workflows/3.2-adaptive-intelligence"
[3]: https://awslabs.github.io/mcp/servers/aws-documentation-mcp-server "https://awslabs.github.io/mcp/servers/aws-documentation-mcp-server"
[4]: https://github.com/awslabs/mcp "https://github.com/awslabs/mcp"
[5]: https://ghuntley.com/ralph/ "https://ghuntley.com/ralph/"
[6]: https://deepwiki.com/awslabs/aidlc-workflows/8-generated-artifacts "https://deepwiki.com/awslabs/aidlc-workflows/8-generated-artifacts"
[7]: https://deepwiki.com/awslabs/aidlc-workflows/4-workflow-phases "https://deepwiki.com/awslabs/aidlc-workflows/4-workflow-phases"
[8]: https://deepwiki.com/awslabs/aidlc-workflows "https://deepwiki.com/awslabs/aidlc-workflows"
[9]: https://github.com/j-thurston/aidlc-mcp "https://github.com/j-thurston/aidlc-mcp"
[10]: https://deepwiki.com/awslabs/aidlc-workflows/7-user-interaction-model "https://deepwiki.com/awslabs/aidlc-workflows/7-user-interaction-model"
[11]: https://developer.chrome.com/blog/chrome-devtools-mcp "https://developer.chrome.com/blog/chrome-devtools-mcp"
[12]: https://awslabs.github.io/mcp/servers/aws-pricing-mcp-server "https://awslabs.github.io/mcp/servers/aws-pricing-mcp-server"
[13]: https://awslabs.github.io/mcp/servers/aws-diagram-mcp-server "https://awslabs.github.io/mcp/servers/aws-diagram-mcp-server"
[14]: https://awesomeclaude.ai/ralph-wiggum "https://awesomeclaude.ai/ralph-wiggum"