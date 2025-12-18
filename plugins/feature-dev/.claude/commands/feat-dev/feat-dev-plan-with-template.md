---
Allowed-tools: Read, Grep, Glob, Task, TodoWrite, WebFetch, AskUserQuestion, Write, Bash
argument-hint: "[feature-description] [@context-files...]"
description: "Systematically plan new features through phased discovery, exploration, clarification, specification, and documentation"
---

# Purpose

Guide the planning of a new feature through a structured, phase-gated approach that emphasizes thorough understanding and comprehensive specification. This command follows senior engineering practices: discover requirements, explore the codebase, ask clarifying questions, and create detailed specifications ready for implementation. Each phase requires user approval before proceeding. The output is a complete, actionable plan document.

## Variables

FEATURE_DESCRIPTION: $1
- The initial description of the feature to plan
- Used for: Understanding what needs to be planned
- Required: If not provided, will prompt user interactively
- Example: "Add user authentication with JWT tokens"

CONTEXT_FILES: $2, $3, $4, ...
- Optional file paths (using @ prefix) that provide additional context
- Used for: Enriching understanding of requirements and constraints
- Example: @docs/architecture.md @requirements/auth-spec.md

PLAN_TEMPLATE: .claude/templates/feat-dev-plan/plan-template-minimal-v2.md
- The template structure for generating plan.md
- Used for: Providing consistent plan documentation format

FEATURE_NAME: (derived from FEATURE_DESCRIPTION)
- Automatically generated kebab-case name from the feature description
- Used for: Creating the output directory path
- Example: "Add user authentication" → "add-user-authentication"
- Derived in: Phase 1

OUTPUT_DIR: feats/{FEATURE_NAME}
- The directory where the plan will be saved
- Used for: Storing the final plan.md document
- Automatically created: Yes (including parent feats/ directory)
- Example: feats/add-user-authentication/

SCRATCH_MEMORY_FILE: {OUTPUT_DIR}/scratch-memory.md
- A structured document for capturing insights, patterns, and domain knowledge during planning
- Used for: Knowledge capture that can be triaged post-implementation for the project knowledgebase
- Automatically created: Yes (initialized in Phase 1 with 8 category sections)
- Structure: Contains 8 categories:
  - **Domain Concepts**: Business logic, terminology, domain rules learned
  - **Technical Patterns**: Architectural patterns, code structures, design approaches found
  - **Integration Points**: How systems connect, dependencies, interfaces discovered
  - **Gotchas & Constraints**: Limitations, things to watch out for, edge cases identified
  - **Decisions & Rationale**: Why choices were made, alternatives considered, tradeoffs
  - **Assumptions**: Things assumed during planning that may need validation later
  - **Questions & Unknowns**: Open items, areas needing future consideration or clarification
  - **Reusable Solutions**: Patterns or approaches applicable to other features
- Post-implementation: Use /triage-scratch-memory command to review and promote content to .claude/knowledge/

## Core Principles

- **Ask clarifying questions**: Identify all ambiguities, edge cases, and underspecified behaviors. Ask specific, concrete questions rather than making assumptions. Wait for user answers before proceeding with design decisions.
- **Understand before planning**: Read and comprehend existing code patterns first
- **Read files identified by agents**: When launching agents, ask them to return lists of the most important files to read. After agents complete, read those files to build detailed context.
- **Capture knowledge continuously**: Use scratch-memory.md throughout all phases to document domain concepts, technical patterns, decisions, and insights as they emerge. This builds a foundation for project knowledge.
- **Comprehensive documentation**: Create clear, thorough specifications that serve as implementation blueprints
- **Use TodoWrite**: Track all progress throughout all planning phases
- **Use AskUserQuestion**: ALWAYS use for interaction with user to collect well structured answers from the user.

## Instructions

You are a senior software engineer planning a new feature. You pride yourself on designing elegant and clean architectures. Think hard and deeply about this feature.

KNOWLEDGE CAPTURE PROTOCOL:
Throughout the planning process, continuously capture insights to SCRATCH_MEMORY_FILE ({OUTPUT_DIR}/scratch-memory.md). This document serves as a working memory that will be triaged post-implementation to extract valuable knowledge for the project knowledgebase.

**When to Capture:**
- Continuously throughout all phases as insights emerge
- When discovering domain concepts or business rules
- When identifying technical patterns or architectural approaches
- When making decisions (capture the rationale and alternatives considered)
- When encountering gotchas, constraints, or edge cases
- When questions arise that might be relevant later
- When finding reusable solutions applicable to other features

**How to Capture:**
- Add entries under the appropriate category section in scratch-memory.md
- Be specific and concise - focus on the insight, not implementation details
- Include context when helpful (e.g., "Found in users/auth.ts:45")
- Don't worry about perfect organization - triage happens post-implementation

**Categories:**
1. **Domain Concepts** - Business logic, terminology, domain rules
2. **Technical Patterns** - Architectural patterns, code structures, design approaches
3. **Integration Points** - How systems connect, dependencies, interfaces
4. **Gotchas & Constraints** - Limitations, edge cases, things to watch out for
5. **Decisions & Rationale** - Why choices were made, alternatives considered
6. **Assumptions** - Things assumed that may need validation later
7. **Questions & Unknowns** - Open items for future consideration
8. **Reusable Solutions** - Patterns applicable to other features

Follow this systematic five-phase planning approach, getting user approval before moving to each subsequent phase:

### Phase 1: Discovery
**Goal**: Understand what needs to be built

1. Create a comprehensive todo list tracking all five phases
2. If FEATURE_DESCRIPTION is missing or unclear:
   - Ask user: What problem are they solving?
   - Ask user: What should the feature do?
   - Ask user: Any constraints or requirements?
   - Ask user: Expected user experience or behavior?
3. Read any CONTEXT_FILES provided to gather additional requirements
4. Derive FEATURE_NAME from FEATURE_DESCRIPTION:
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove special characters (keep only alphanumeric and hyphens)
   - Set OUTPUT_DIR to feats/{FEATURE_NAME}
5. Create the output directory: mkdir -p {OUTPUT_DIR}
6. Initialize SCRATCH_MEMORY_FILE with structured categories:
   ```markdown
   # Scratch Memory: {FEATURE_NAME}

   ## Domain Concepts
   <!-- Business logic, terminology, domain rules -->

   ## Technical Patterns
   <!-- Architectural patterns, code structures found -->

   ## Integration Points
   <!-- How systems connect, dependencies, interfaces -->

   ## Gotchas & Constraints
   <!-- Limitations, things to watch out for, edge cases -->

   ## Decisions & Rationale
   <!-- Why choices were made, alternatives considered -->

   ## Assumptions
   <!-- Things assumed during planning that need validation -->

   ## Questions & Unknowns
   <!-- Open items, areas needing future consideration -->

   ## Reusable Solutions
   <!-- Patterns/approaches applicable to other features -->
   ```
7. Capture initial domain concepts to scratch-memory.md:
   - Domain terminology from FEATURE_DESCRIPTION
   - Business rules or constraints mentioned
   - Initial assumptions about the problem space
8. Summarize your understanding of the feature in clear terms, including:
   - What will be built
   - The derived FEATURE_NAME
   - Where the plan will be saved (OUTPUT_DIR)
9. Get explicit user confirmation before proceeding to Phase 2

### Phase 2: Codebase Exploration
**Goal**: Understand existing code structure and patterns

1. Use Task tool with subagent_type=Explore to:
   - Identify similar features or patterns in the codebase
   - Locate files that will need modification
   - Understand current architecture and conventions
   - Return a list of the most important files to review
2. Read the key files identified by the exploration agent
3. Document existing patterns, naming conventions, and architectural decisions
4. Identify where the new feature fits into the current structure
5. Capture to scratch-memory.md as you explore:
   - **Technical Patterns**: Architectural patterns found (e.g., "Middleware pattern in auth/", "Repository pattern for data access")
   - **Integration Points**: How systems connect (e.g., "API routes in routes/, handlers in handlers/")
   - **Gotchas & Constraints**: Limitations discovered (e.g., "Database schema requires migration", "Auth tokens expire after 1h")
   - **Questions & Unknowns**: Areas needing clarification (e.g., "How does error handling work across async boundaries?")
6. Get explicit user confirmation before proceeding to Phase 3

### Phase 3: Clarifying Questions
**Goal**: Resolve all ambiguities before designing

1. Based on your codebase exploration, identify:
   - Edge cases not covered in requirements
   - Underspecified behaviors (error handling, validation, etc.)
   - Integration points that need clarification
   - Performance or security considerations
   - Multiple valid design approaches or architectural patterns
2. Use AskUserQuestion to present specific, concrete questions
3. Document all answers and decisions
4. Ensure you have complete information to design the solution
5. Capture to scratch-memory.md as questions are resolved:
   - **Decisions & Rationale**: Why choices were made (e.g., "Using JWT over sessions because: stateless, scalable. Considered: sessions (simpler) but chose JWT")
   - **Assumptions**: Things assumed (e.g., "Assuming users can only have one active session", "Assuming UTF-8 encoding for all text")
   - **Gotchas & Constraints**: New constraints from discussion (e.g., "Must handle legacy user format", "Rate limit: 100 req/min")
   - **Domain Concepts**: Business rules clarified (e.g., "Admin users bypass normal validation", "Soft delete preserves audit trail")
6. Get explicit user confirmation before proceeding to Phase 4

### Phase 4: Specification
**Goal**: Create a detailed implementation plan with clear separation between design thinking and actionable tasks

This phase is split into two sub-sections:

#### Phase 4a: Architecture & Design
**Focus**: High-level design decisions and system architecture

1. Design the architecture:
   - Files to create or modify
   - New functions, classes, or components needed
   - Data structures and interfaces
   - Integration points with existing code
   - Architectural patterns to follow
2. Consider:
   - Error handling strategy
   - Testing approach
   - Migration or backward compatibility
   - Documentation needs
   - Performance and security implications
3. Capture architectural insights to scratch-memory.md:
   - **Reusable Solutions**: Patterns applicable elsewhere (e.g., "Validation middleware pattern can be reused for all endpoints")
   - **Technical Patterns**: Design approaches used (e.g., "Factory pattern for creating auth providers", "Decorator pattern for middleware chaining")
   - **Decisions & Rationale**: Final architectural decisions (e.g., "Chose layered architecture over clean architecture due to project size")

#### Phase 4b: Implementation Tasks
**Focus**: Detailed, actionable tasks with specific code changes

1. Break down the architecture into concrete implementation tasks
2. For each task, specify:
   - **Action keyword**: MODIFY, CREATE, ADD, DELETE, RENAME, MOVE, REPLACE, MIRROR, COPY
   - **Target file**: Exact file path
   - **Changes**: Specific modifications with reference code snippets (5-10 lines)
   - **Validation**: Commands to verify the change works
3. Organize tasks in logical implementation order
4. Include clear markers and implementation details for each task
5. Capture implementation insights to scratch-memory.md:
   - **Gotchas & Constraints**: Implementation challenges (e.g., "Must initialize DB connection before middleware registration")
   - **Questions & Unknowns**: Remaining uncertainties (e.g., "Performance impact of N+1 queries TBD")
6. Present the complete specification (both architecture and tasks) to the user
7. Get explicit user confirmation before proceeding to Phase 5

### Phase 5: Plan Documentation
**Goal**: Produce THREE structured documents - plan.md, tasks.md, and scratch-memory.md

1. The output directory structure already exists (created in Phase 1)

2. Generate **plan.md** - High-level problem and design documentation (NO code snippets):
   - Read PLAN_TEMPLATE to understand the required structure and sections
   - Follow the template's guidance on section organization and content
   - Populate each [REQUIRED] section with content from Phases 1-4:
     - Executive Summary
     - Requirements & Context (from Phase 1)
     - Codebase Analysis (from Phase 2)
     - Design Decisions (from Phase 3)
     - Architecture & Design (from Phase 4a)
     - Testing Strategy
     - Risks & Considerations
   - Include [CONDITIONAL] sections where applicable
   - Write to {OUTPUT_DIR}/plan.md using the Write tool

3. Generate **tasks.md** - Actionable implementation tasks with code:
   - Todo checklist at the top with checkboxes for all tasks
   - Implementation tasks in structured format (from Phase 4b):
     ```
     task_name:
       action: MODIFY/CREATE/ADD/DELETE/RENAME/MOVE/REPLACE/MIRROR/COPY
       file: path/to/file
       changes: |
         - Reference code snippet (5-10 lines)
         - Specific implementation markers
         - Clear modification points
       validation:
         - command: "test command to verify"
         - expect: "success criteria"
     ```
   - Tasks organized in logical implementation order
   - Each task includes action keyword, target file, code snippets, and validation
   - Write to {OUTPUT_DIR}/tasks.md using the Write tool

4. Finalize **scratch-memory.md** (already created in Phase 1, updated throughout phases):
   - Review all 8 categories for completeness
   - Ensure key insights from all phases are captured
   - Note: This file will be triaged post-implementation using /triage-scratch-memory command

5. Provide final summary with all file locations and next steps for implementation and knowledge triage

## Workflow

1. **Initialize** - Create todo list with all 5 phases, mark Phase 1 as in_progress
2. **Phase 1: Discovery** - Gather requirements, initialize scratch-memory.md, capture domain concepts → **WAIT FOR USER APPROVAL**
3. **Phase 2: Exploration** - Explore codebase, read key files, capture patterns & integrations → **WAIT FOR USER APPROVAL**
4. **Phase 3: Clarification** - Ask questions, resolve ambiguities, capture decisions & rationale → **WAIT FOR USER APPROVAL**
5. **Phase 4: Specification** - Design architecture (4a), create implementation tasks (4b), capture reusable solutions → **WAIT FOR USER APPROVAL**
6. **Phase 5: Plan Documentation** - Generate plan.md, tasks.md, and finalize scratch-memory.md → **COMPLETE**

## Report

After Phase 1 (Discovery):
```
## Phase 1 Complete: Discovery

**Feature Understanding:**
[Clear summary of what will be built]

**Requirements:**
- [Requirement 1]
- [Requirement 2]
- ...

**Constraints:**
- [Constraint 1 if any]

**Knowledge Captured:**
- Domain Concepts: [X items captured]
- Assumptions: [X items captured]

**Files Initialized:**
- {OUTPUT_DIR}/scratch-memory.md (ready for continuous capture)

**Next Step:** Phase 2 - Codebase Exploration

Ready to proceed? (Please confirm)
```

After Phase 2 (Exploration):
```
## Phase 2 Complete: Codebase Exploration

**Key Files Identified:**
- file1.ts:line - [purpose]
- file2.ts:line - [purpose]

**Existing Patterns:**
- [Pattern 1]
- [Pattern 2]

**Integration Points:**
- [Where feature will integrate]

**Knowledge Captured:**
- Technical Patterns: [X items captured]
- Integration Points: [X items captured]
- Gotchas & Constraints: [X items captured]

**Next Step:** Phase 3 - Clarifying Questions

Ready to proceed?
```

After Phase 3 (Clarification):
```
## Phase 3 Complete: Clarifying Questions

**Decisions Made:**
- Q: [question] → A: [answer]
- Q: [question] → A: [answer]

**Edge Cases Addressed:**
- [Edge case and handling]

**Knowledge Captured:**
- Decisions & Rationale: [X items captured]
- Assumptions: [X items captured]
- Domain Concepts: [X items captured]

**Next Step:** Phase 4 - Specification

Ready to proceed?
```

After Phase 4 (Specification):
```
## Phase 4 Complete: Specification

**Architecture (4a):**
[High-level design overview]

**Files to Create/Modify:**
- [file1] - [purpose/role]
- [file2] - [purpose/role]

**Implementation Tasks (4b):**
1. [Task 1] - [action keyword] - [file]
2. [Task 2] - [action keyword] - [file]
3. [Task 3] - [action keyword] - [file]
...

**Testing Strategy:**
[How to verify the feature works]

**Knowledge Captured:**
- Reusable Solutions: [X items captured]
- Technical Patterns: [X items captured]
- Gotchas & Constraints: [X items captured]

**Next Step:** Phase 5 - Plan Documentation (will generate plan.md, tasks.md, and finalize scratch-memory.md)

Ready to proceed?
```

After Phase 5 (Plan Documentation):
```
## Feature Plan Complete

**Output Files:**
- {OUTPUT_DIR}/plan.md - Problem statement, requirements, and design documentation
- {OUTPUT_DIR}/tasks.md - Actionable implementation tasks with code snippets
- {OUTPUT_DIR}/scratch-memory.md - Knowledge capture for post-implementation triage

**Plan Summary:**
[Executive summary of the feature]

**plan.md Contents:**
- Executive Summary
- Requirements & Context (Phase 1)
- Codebase Analysis (Phase 2)
- Design Decisions (Phase 3)
- Architecture & Design (Phase 4a)
- Testing Strategy
- Risks & Considerations

**tasks.md Contents:**
- Todo checklist ([X] checkboxes)
- Implementation tasks with:
  - Action keywords (MODIFY/CREATE/ADD/etc)
  - Target files
  - Reference code snippets (5-10 lines)
  - Validation commands

**scratch-memory.md Contents:**
- Domain Concepts: [X items captured]
- Technical Patterns: [X items captured]
- Integration Points: [X items captured]
- Gotchas & Constraints: [X items captured]
- Decisions & Rationale: [X items captured]
- Assumptions: [X items captured]
- Questions & Unknowns: [X items captured]
- Reusable Solutions: [X items captured]

**Ready for Implementation:**
All documents are ready. plan.md provides the "why" and high-level design. tasks.md provides the "how" with concrete implementation steps. scratch-memory.md captures knowledge for the project knowledgebase.

**Recommended Next Steps:**
1. Review plan.md to understand the problem and architecture
2. Follow tasks.md checklist for implementation
3. Check off tasks as completed
4. Run validation commands after each task
5. After implementation: Run /triage-scratch-memory to review scratch-memory.md and promote valuable insights to .claude/knowledge/
```
