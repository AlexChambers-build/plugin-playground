---
Allowed-tools: Read, Grep, Glob, Task, TodoWrite, AskUserQuestion, Write, Bash
argument-hint: "[documentation-topic] [@context-files...]"
description: "Create comprehensive .ai-docs documentation through intelligent topic analysis and interactive information gathering"
---

# Purpose

Create .ai-docs documentation via structured workflow: analyze → propose topics → gather info via minimal-context tasks → assemble → validate.

## Variables

- `DOCUMENTATION_TOPIC`: $1 - what to document (e.g., "authentication patterns")
- `CONTEXT_FILES`: $2+ - optional @file paths for code analysis
- `DOC_NAME`: derived kebab-case from topic
- `OUTPUT_FILE`: `.ai-docs/{DOC_NAME}.md`
- `SCRATCH_MEMORY_FILE`: `./write-docs-scratch-memory.md`

## Core Principles

- Deep analysis before proposing topics; user selects what to document
- Each topic = separate Task agent (context minimization)
- Smart merge with existing docs vs. overwrite
- Follow AI-DOCS-FRONTMATTER-STANDARD strictly (comprehensive patterns[], exact line numbers)
- Progressive: topics → details → assemble
- Use TodoWrite (track 5 phases) and AskUserQuestion (structured interaction)

## Five-Phase Workflow

### Phase 1: Topic Discovery

1. **Create todo** with all 5 phases using TodoWrite
2. **Parse args**: Extract DOCUMENTATION_TOPIC from $1; if missing, use AskUserQuestion (what area? problem solved? audience? specific patterns?)
3. **Derive DOC_NAME**: lowercase, spaces→hyphens, strip special chars
4. **Read context files**: Use Read on @files to understand tech/patterns/structure
5. **Initialize scratch memory**:
   ```markdown
   # Write Docs Scratch Memory: {DOC_NAME}

   ## Documentation Goal
   <!-- What this documentation aims to achieve -->

   ## Target Document
   - File: .ai-docs/{DOC_NAME}.md
   - Domain: [TBD]
   - Complexity: [TBD]

   ## Topics Considered
   <!-- List of potential topics identified -->

   ## Context Analyzed
   <!-- Files read and key takeaways -->

   ## Decisions & Rationale
   <!-- Key decisions made during documentation creation -->

   ## Patterns Identified
   <!-- Patterns to include in frontmatter patterns[] -->
   ```

6. **Deep topic analysis** - Generate 5-8 topics covering:
   - **Core Concepts & Patterns** (2-3): fundamentals, key patterns, architectural approaches, core abstractions
   - **Implementation Details** (1-2): how-to implement, configuration/setup, code structure
   - **Best Practices & Guidelines** (1-2): recommended approaches, conventions, quality standards, performance
   - **Common Pitfalls & Gotchas** (1): known issues, edge cases, anti-patterns, troubleshooting
   - **Testing & Security** (0-1): testing strategies, security considerations (if applicable)

   Each topic: clear name, 1-2 sentence description, info source (files/user/both), focused for single task

7. **Update scratch**: Add topics to SCRATCH_MEMORY_FILE
8. **Display**: Show DOC_NAME, context count, topics list; **WAIT FOR APPROVAL**

### Phase 2: Topic Selection

1. **Mark Phase 2 in_progress** (TodoWrite)
2. **Use AskUserQuestion** with multiSelect: present all topics (max 8), let user select
3. **Process selection**: Count, enforce max 8, parse "Other" input, validate clarity
4. **Prioritize**: Order by logical flow (fundamentals → implementation → practices → pitfalls)
5. **Update scratch**: Record selections
6. **Display**: Show count, ordered outline with sources; **WAIT FOR APPROVAL**

### Phase 3: Information Gathering

**CRITICAL**: Each topic = separate Task agent for context minimization

1. **Mark Phase 3 in_progress** (TodoWrite)
2. **Spawn tasks in batches of 3** (parallel):

   For each topic:
   ```
   Task tool:
     subagent_type: "general-purpose"
     model: "sonnet"
     description: "Gather info: {TOPIC_NAME}"
     prompt: "Gather information for: {TOPIC_NAME}

   1. Use AskUserQuestion with options:
      - Analyze code files (user provides paths)
      - User will describe (ask: what's topic? key concepts? implementation? practices? pitfalls? related?)
      - Hybrid (both)
      - Search codebase (Grep/Glob)
      - Skip

   2. Execute based on choice

   3. Return JSON:
   {
     \"topic\": \"{TOPIC_NAME}\",
     \"status\": \"completed\",
     \"content\": {
       \"overview\": \"2-3 paragraphs\",
       \"key_concepts\": [\"concept + explanation\"],
       \"implementation_details\": \"how-to\",
       \"code_examples\": [{\"language\": \"x\", \"code\": \"...\", \"explanation\": \"...\"}],
       \"best_practices\": [\"practice\"],
       \"common_pitfalls\": [\"pitfall + avoidance\"],
       \"related_patterns\": [\"pattern\"],
       \"keywords\": [\"kw\"]
     }
   }"
   ```

3. **Collect results**: Store all task outputs as `GATHERED_INFORMATION[]`
4. **Handle failures**: Check errors, retry if possible, mark failed and continue
5. **Update scratch**: Add info summary
6. **Display**: Show processed/successful/failed/skipped counts; **WAIT FOR APPROVAL**

### Phase 4: Document Assembly

1. **Mark Phase 4 in_progress** (TodoWrite)
2. **Check existing**: Use Glob for `.ai-docs/{DOC_NAME}.md`; if exists, set `MODE=SMART_MERGE` and read content, else `MODE=CREATE_NEW`
3. **Determine domain**: backend (API/DB), frontend (UI/state), security (auth/crypto), testing, architecture, general, database, deployment
4. **Spawn document-writer agent**:
   ```
   Task tool:
     subagent_type: "feature-dev:document-writer"
     model: "sonnet"
     description: "Assemble {DOC_NAME} documentation"
     prompt: "Create .ai-docs documentation from gathered info.

   **First read**: plugins/feature-dev/skills/AI-DOCS-FRONTMATTER-STANDARD.md

   **Target**: {DOC_NAME}.md
   **Mode**: {MODE}
   **Domain**: {DOMAIN}
   **Complexity**: {basic/intermediate/advanced}

   {If SMART_MERGE: show EXISTING_CONTENT + merge strategy (preserve + add new sections + update patterns/keywords/sections[] with -1 placeholders + update date)}

   **Gathered Information**: {For each topic: show all content fields}

   **Requirements**:
   1. Frontmatter (AI-DOCS-FRONTMATTER-STANDARD):
      - domain: {DOMAIN} (exact enum)
      - title: \"Title Case 3-7 words\"
      - description: \"1-2 sentences mentioning key patterns\"
      - patterns: [COMPREHENSIVE kebab-case: ALL topics, variations (auth/authentication/jwt), technologies, related terms] **CRITICAL for scoring: exact match = +5**
      - keywords: [lowercase supplements]
      - sections: [{name, line_start: -1, line_end: -1, summary: \"descriptive with searchable terms\"}] - each topic gets section, include Overview + Related Documentation
      - complexity: {level}
      - line_count: -1
      - last_updated: {TODAY}
      - related: [related .ai-docs files]

   2. Structure:
      - Title h1
      - Overview (2-3 paragraphs)
      - Topic sections (h2) with: When to Use / Implementation / code blocks / Best Practices / Common Pitfalls
      - Related Documentation

   3. Code: Complete runnable examples, syntax highlighting, comments, show good/bad

   4. Quality: Clear technical writing, specific examples, proper markdown

   Return COMPLETE document with frontmatter."
   ```

5. **Process output**: Extract document, validate frontmatter, ensure comprehensive patterns[], verify sections[] have -1 placeholders
6. **Two-pass line numbers**:
   - Pass 1: Write document with -1 placeholders
   - Pass 2: Read file, use `grep -n "^## "` to find sections, calculate ranges, Edit to replace -1 with real line numbers
7. **Validate**: All required fields present, no -1 remaining, line_count = `wc -l`, patterns[] has variations
8. **Update scratch**: Record stats
9. **Display**: Show mode, domain, section count, patterns count, line count; **WAIT FOR APPROVAL**

### Phase 5: Finalization

1. **Mark Phase 5 in_progress** (TodoWrite)
2. **Final validation**: Read OUTPUT_FILE, verify frontmatter compliance, no -1s, line_count matches, sections[] valid, patterns[] comprehensive, domain valid
3. **Test discovery**: Extract 3 patterns from frontmatter, confirm scoring works
4. **Check related docs**: List in "related" field, inform user of potential cross-reference updates
5. **Clean up**: `rm -f ./write-docs-scratch-memory.md`
6. **Generate report**:
   ```
   ✅ Documentation Complete: {DOC_NAME}.md

   **Location**: .ai-docs/{DOC_NAME}.md
   **Mode**: {CREATE_NEW or Updated existing}

   **Statistics**:
   - Domain: {domain}, Complexity: {complexity}
   - Topics: {count}, Sections: {count}, Lines: {count}
   - Patterns: {count}, Keywords: {count}, Code Examples: {count}

   **Search Optimization**: Patterns with variations for high scoring, exact line numbers for extraction

   **Integration**: Available for /research, /explore, /review, /feat-dev-plan

   **Test**: `/research "{PATTERN1}"` or `/research "{PATTERN2}"`

   **Next**: Test search, consider cross-references, share for feedback
   ```
7. **Mark Phase 5 complete** (TodoWrite)

## Error Handling

**No topic**: Show usage with examples (`/write-docs "topic"`, `/write-docs "topic" @file`)

**Task failures**: Show error, use AskUserQuestion (retry/skip/manual/abort)

**Write failure**: Check .ai-docs exists/permissions/disk; save to `./write-docs-output.md` with manual move instructions

**Invalid frontmatter**: List issues, use AskUserQuestion (auto-fix/continue/manual)

**Merge conflicts**: Show existing vs new excerpt, use AskUserQuestion (keep + add separate/replace/merge/skip)

## Usage Examples

```bash
/write-docs "authentication patterns"
/write-docs "React hooks" @frontend/src/hooks/useAuth.js
/write-docs "microservices communication" @backend/src/messaging/
```

## Integration

- `/research [topic]` - searches created docs
- `/triage-scratch-memory` - extract patterns → `/write-docs`
- `/feat-dev-plan` - references docs during planning
- `/review` - cites docs as best practices

## Notes

Progressive context management (separate agents), smart merge (preserves existing), search optimization (comprehensive patterns[]), quality standards (follows AI-DOCS-FRONTMATTER-STANDARD), two-pass line numbers (exact boundaries), user control (multiple approval gates), flexible gathering (files/user/hybrid/search), error resilience (graceful failures), integration ready (works with research/review/planning).