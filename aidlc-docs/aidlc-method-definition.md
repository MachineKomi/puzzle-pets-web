[AI-DLC source PDF (uploaded)](sandbox:/mnt/data/AI-DLC.pdf) 

---

# AI-Driven Development Lifecycle (AI-DLC) Method Definition

## I. Context

Software engineering has continuously evolved to help developers focus on complex problem-solving by abstracting lower-level, undifferentiated tasks. Progression from machine code to high-level languages, then APIs and libraries, significantly increased productivity. Large Language Models (LLMs) represent the next shift: conversational natural language interactions for code generation, bug detection, and test generation define the **AI-Assisted** era.

As AI capabilities expand beyond code generation into requirements elaboration, planning, task decomposition, design, and real-time collaboration, we are entering an **AI-Driven** era where AI orchestrates development. However, existing SDLC and Agile methods were designed for human-driven, long-running processes. Their manual workflows and rigid roles limit the ability to leverage AI speed, flexibility, and emerging agentic behaviors. Retrofitting AI into these methods reinforces inefficiencies.

**AI-DLC** is proposed as an AI-native methodology that makes AI a central collaborator and redesigns workflows, roles, and iterations for faster decision-making, seamless task execution, and continuous adaptability.

---

## II. Key Principles

These principles underpin AI-DLC and shape its phases, roles, artifacts, and rituals.

### 1. Reimagine rather than retrofit

Traditional methods (SDLC, Agile/Scrum) assume long iterations (weeks/months) and rituals like daily standups and retrospectives. Effective AI use enables cycles measured in hours or days, requiring real-time validation and feedback. Estimation rituals (story points, velocity) may become less relevant as AI reduces boundaries between task complexities. AI can also automate planning, decomposition, requirements analysis, and design-technique application, shortening the path from intent to code. The method should be redesigned from first principles rather than patched.

### 2. Reverse the conversation direction

AI-DLC shifts initiation and direction of work conversations to AI. AI decomposes high-level intents into tasks, recommends options, and proposes trade-offs. Humans act as approvers and validators at critical decision points. This focuses humans on oversight, risk mitigation, and strategic alignment while AI executes decomposition and automation. Analogy: Google Maps (human sets destination; system guides; human moderates).

### 3. Integrate design techniques into the core

Frameworks like Scrum/Kanban typically leave design techniques (e.g., DDD) out of scope, contributing to quality gaps. AI-DLC makes design techniques core. Different “flavors” of AI-DLC can align to DDD, BDD, or TDD. This definition focuses on a **DDD flavor**, where AI applies DDD during planning and decomposition, producing right-sized bounded contexts for parallel delivery, while developers validate and adjust.

### 4. Align with current AI capability

AI-DLC is optimistic about AI potential but realistic: today’s AI is not reliably autonomous for end-to-end translation of high-level intent into safe, interpretable, executable systems without oversight. AI-Assisted (humans do most heavy lifting) also underutilizes AI. AI-DLC adopts AI-Driven with humans retaining responsibility for validation, decisions, and oversight.

### 5. Cater to building complex systems

AI-DLC is intended for complex systems requiring continuous functional adaptability, architectural complexity, trade-off management, scalability, integration, and customization, often in large and/or regulated organizations. Simpler systems suitable for low-code/no-code are out of scope.

### 6. Retain what enhances human symbiosis

Keep artifacts and touchpoints that enable validation and risk mitigation, optimized for real-time use. Example: **user stories** remain a contract between humans and AI; **risk registers** constrain AI-generated plans and code to organizational frameworks.

### 7. Facilitate transition through familiarity

The method should be learnable and usable in a day without extensive training. Preserve familiar relationships between concepts but update terminology to reflect faster cycles. Example: rename Scrum “Sprints” to **Bolts** to reflect hours/days cycles.

### 8. Streamline responsibilities for efficiency

AI task decomposition and decision support allow developers to transcend silos (infra, frontend, backend, DevOps, security). Convergence reduces need for many specialized roles, but Product Owners and Developers remain essential for oversight, validation, and strategic decisions. Roles should be minimal; add new roles only when necessary.

### 9. Minimise stages, maximise flow

Reduce handoffs and transitions via automation and responsibility convergence, enabling continuous flow. Human validation remains critical to avoid rigid “quick-cement” code. AI-DLC uses a minimal set of phases with explicit validation points acting like a “loss function” to prune waste early.

### 10. No hard-wired, opinionated SDLC workflows

AI-DLC does not prescribe rigid workflows for pathways (green-field, refactor, defects, scaling). Instead, AI recommends a Level 1 plan based on intent. Humans moderate and refine via dialogue. AI decomposes further into Level 2 and beyond. At execution, AI implements tasks while humans validate outcomes. This keeps the method adaptable as AI evolves.

---

## III. Core Framework

### 1. Artifacts

#### Intent

A high-level statement of purpose (business goal, feature, or technical outcome like scaling). Starting point for AI-driven decomposition into tasks.

#### Unit

A cohesive, self-contained work element derived from an Intent that delivers measurable value. Comparable to DDD subdomains or Scrum epics. Units contain tasks (user stories + acceptance criteria). AI proposes Units; developers/Product Owners validate and refine. Units are loosely coupled for autonomous build and independent deployment.

#### Bolt

The smallest iteration, designed to rapidly implement a Unit or subset of tasks within a Unit. Analogous to Scrum sprint, but measured in hours/days. A Unit may require one or more Bolts, parallel or sequential. AI plans Bolts; developers/Product Owners validate.

#### Domain Design artifact

Models the core business logic of a Unit independent of infrastructure. In v1, AI applies DDD strategic and tactical elements (aggregates, value objects, entities, domain events, repositories, factories).

#### Logical Design

Extends Domain Design to address non-functional requirements (NFRs) using architectural patterns (e.g., CQRS, circuit breakers). AI creates Architecture Decision Records (ADRs) for developer validation. From Logical Design, AI generates code and unit tests, mapping to appropriate AWS services/constructs and running unit tests, analyzing results, and recommending fixes.

#### Deployment Units

Operational artifacts including packaged executable code (e.g., containers, serverless functions), configurations (e.g., Helm charts), and infrastructure components (e.g., Terraform/CloudFormation stacks). AI generates functional tests, static/dynamic security tests, and load tests. Humans validate test scenarios; AI runs suites, analyzes results, correlates failures to code/config/dependencies, and supports readiness for deployment.

---

### 2. Phases and rituals

#### Inception Phase

Captures Intents and translates them into Units via **Mob Elaboration**:

* Conducted in a single room with shared screen and facilitator.
* AI proposes initial breakdown into user stories, acceptance criteria, and Units using domain knowledge and loose coupling/high cohesion principles.
* Product Owner, Developers, QA, and stakeholders review and refine.

Outputs:

* Units and their components:

  * PRFAQ
  * User stories
  * NFR definitions
  * Risk descriptions (mapped to organizational risk register where present)
  * Measurement criteria tracing to the business intent
  * Suggested Bolts to construct the Units

Mob Elaboration compresses weeks/months of sequential work into hours while maintaining alignment between humans and AI.

#### Construction Phase

Iterative execution transforming Units into tested, operations-ready Deployment Units:

* Domain Design -> Logical Design -> Code + Unit Tests -> Automated testing.
* Developers validate AI outputs and make key decisions at each step.
* For brown-field scenarios: first “elevate” existing code into semantically rich models:

  * Static models (components, responsibilities, relationships)
  * Dynamic models (interactions for key use cases)

Ritual: **Mob Construction**

* Teams collocated (like Mob Elaboration), exchanging integration specs, making decisions, delivering Bolts.

#### Operations Phase

Deployment, observability, and maintenance with AI-driven operational efficiency:

* AI analyzes telemetry (metrics/logs/traces), detects anomalies, predicts SLA risks.
* AI integrates with runbooks, proposes actions (scaling, tuning, isolation) and can execute when approved.
* Developers validate AI insights/actions for SLA and compliance alignment.

---

### 3. The workflow

* Start with a business intent (green-field, brown-field enhancement, modernization, defect fixing).
* AI proposes a **Level 1 Plan** (workflow outline).
* Humans review/validate/refine, ensuring business and engineering alignment.
* Each step produces richer artifacts that become context for the next step (progressive enrichment).
* Validation points act as an early “loss function” to catch errors before downstream compounding.
* AI decomposes steps recursively into finer tasks (Level 2, etc.) under oversight.
* All artifacts are persisted as “context memory” and are linked for traceability (e.g., domain model elements linked to user stories).

---

## IV. AI-DLC in action: Green-field development

Example intent: “Develop a recommendation engine for cross-selling products.”

### 1. Inception Phase (Mob Elaboration)

a. AI asks clarifying questions (primary users, business outcomes) to reduce ambiguity.
b. AI elaborates into user stories, NFRs, and risks; team validates and corrects.
c. AI groups stories into Units (e.g., User Data Collection, Recommendation Algorithm Selection, API Integration).
d. Product Owner refines outputs (e.g., add GDPR considerations).
e. AI generates PRFAQ (optional).
f. Developers/Product Owners validate PRFAQ and risks.

### 2. Construction Phase (Mob Programming and Mob Testing)

a. Developer initiates session; AI prompts to start with assigned Unit.
b. AI creates domain model using DDD (e.g., Product, Customer, Purchase History).
c. Developers validate/refine domain model (e.g., missing purchase history handling).
d. AI produces logical design applying NFRs and patterns (e.g., event-driven, AWS Lambda).
e. Developers approve trade-offs and override choices where needed (e.g., use DynamoDB).
f. AI generates code mapped to AWS services.
g. AI auto-generates functional/security/performance tests.

Testing and validation:
a. AI executes tests, analyzes results, highlights issues.
b. AI proposes fixes (e.g., optimize query logic).
c. Developers validate fixes and rerun tests.

### 3. Operations Phase

Deployment:
a. AI packages into Deployment Units (containers, serverless).
b. Developers approve config and roll out to staging/prod.

Observability and monitoring:
a. AI detects anomalies and predicts SLA violations (e.g., latency spike) and proposes scaling.
b. AI suggests runbook actions (e.g., increase DynamoDB throughput, rebalance API Gateway).
c. Developers validate and monitor outcomes.

---

## V. AI-DLC in action: Brown-field development

Brown-field includes adding features, NFR optimization, technical debt, refactoring, defect fixes.

### 1. Inception Phase

Same as green-field.

### 2. Construction Phase

a. AI elevates code into higher-level modeling representations:

* Static models (components, responsibilities, relationships)
* Dynamic models (interaction flows for key use cases)

b. Developers and product managers validate and correct AI reverse-engineered models.
c. Remaining construction proceeds as in green-field.

### 3. Operations Phase

Same as green-field.

---

## VI. Adopting AI-DLC

AI-DLC is designed to be close enough to Agile for easier adoption but still requires transition support. Two approaches:

a. **Learning by practicing**
AI-DLC is a set of rituals (Mob Elaboration, Mob Construction) practiced as a group. Adoption is driven through repeated real-world scenarios rather than training-only. AWS Solution Architects provide an offering called “AI-DLC Unicorn Gym” to package this approach for large organizations.

b. **Embed AI-DLC into developer experience tooling**
Organizations building orchestration tools across SDLC (e.g., FlowSource, CodeSpell, AIForce) can embed AI-DLC so developers practice it implicitly without major adoption programs.

---

# Appendix A: Prompts for practicing AI-DLC

## Setup Prompt

* Build an application.
* Create a project folder per frontend/backend component.
* Store documents under `aidlc-docs/`.
* Plans: `aidlc-docs/plans/` (AI must plan ahead, create an md plan, only execute after approval).
* Requirements: `aidlc-docs/requirements/`.
* User stories: `aidlc-docs/story-artifacts/`.
* Architecture/design docs: `aidlc-docs/design-artifacts/`.
* Store all prompts in order in `aidlc-docs/prompts.md`.
* Confirm understanding; create folders/files if missing.

---

## Inception

### User stories

**Role**: Expert product manager creating well-defined user stories as the development contract.

**Instructions**:

* Create plan `user_stories_plan.md` with checkboxes.
* Flag any step requiring clarification.
* No critical decisions without confirmation.
* Ask for approval; after approval execute plan step-by-step and tick checkboxes.

**Task**:

* Build user stories for the high-level requirement: `<< describe product description >>`.

**After plan review**:

* “Yes, I like your plan as in the <<md file>>. Now exactly follow the same plan... Mark checkboxes as done.”

### Units

**Role**: Experienced software architect.

**Instructions**:

* Write plan `units_plan.md` with checkboxes, request clarifications as needed.
* Ask for approval; then execute and tick checkboxes.

**Task**:

* Use `mvp_user_stories.md`.
* Group stories into multiple independently buildable Units (high cohesion within Unit, loose coupling across Units).
* For each Unit: write user stories and acceptance criteria into individual md files in the `design/` folder.

**After plan review**:

* “I approve. Proceed.”

---

## Construction

### Domain (component) model creation

**Role**: Experienced software engineer.

**Instructions**:

* Write plan in `design/component_model.md` with checkboxes; request clarifications as needed.
* Ask for approval; then execute and tick checkboxes.
* Do not generate code yet.

**Task**:

* Refer to `design/seo_optimization_unit.md`.
* Design a component model containing components, attributes, behaviors, and interactions needed to implement user stories.
* Write component model into a separate md file under `/design`.

**After plan review**:

* “I approve the plan. Proceed. After completing each step, mark the checkbox in your plan file.”

### Code generation

**Role**: Experienced software engineer.

**Instructions**:

* Create an md plan with checkboxes; request clarifications as needed.
* Ask for approval; then execute and tick checkboxes.

**Task**:

* Refer to `search_discovery/nlp_component.md`.
* Generate a simple Python implementation for NLP component.
* For `processQuery(queryText)`, use Amazon Bedrock APIs to extract entities.
* Generate classes into individual files in `vocabMapper` directory.

**Follow-up**:

* Analyze current `EntityExtractor` (currently uses `vocabulary_repository`) and propose a plan to leverage GenAI for both entity extraction and intent extraction.

### Architecture

**Role**: Experienced Cloud Architect.

**Instructions**:

* Write plan in `deployment_plan.md` with checkboxes; request clarifications as needed.
* Ask for approval; then execute and tick checkboxes.

**Task**:

* Refer to:

  * Component design: `design/core_component_model.md`
  * Units: `UNITS/`
  * Cloud architecture: `ARCHITECTURE/`
  * Backend code: `BACKEND/`
* Generate end-to-end deployment plan for backend on AWS using one of: CloudFormation, CDK, Terraform.
* Document prerequisites.

**After approval**:

* Output IaC code into `DEPLOYMENT/`.
* Create validation plan and validation report.
* Fix issues and update report.

### Build IaC/REST APIs

**Role**: Experienced software engineer.

**Instructions**:

* Create an md plan with checkboxes; request clarifications as needed.
* Ask for approval; then execute and tick checkboxes.

**Task**:

* Refer to `services.py` under `construction/<>/`.
* Create Python Flask APIs for each service.