---
Allowed-tools: Read, Write, Edit, TodoWrite, AskUserQuestion, Grep, Glob, Bash
argument-hint: "<code-review-path>"
description: "Implement changes suggested in a code review with planning, gap analysis, and execution"
---

# Review Fix: Systematic Code Review Remediation

Execute 7-phase workflow to fix code review findings: analyze → plan → clarify → implement → validate → report → summarize.

## Variables

**CODE_REVIEW_PATH** ($1): Path to code-review.md file (required)
**REVIEW_DIR**: Derived from CODE_REVIEW_PATH directory
**REVIEW_FIX_PLAN_FILE**: {REVIEW_DIR}/review-fix-plan.md
**REVIEW_FIX_REPORT_FILE**: {REVIEW_DIR}/review-fix-report.md
**SCRATCH_MEMORY_FILE**: {REVIEW_DIR}/scratch-memory.md (create or update)

## Core Workflow

### Phase 1: Validation & Discovery

1. Read CODE_REVIEW_PATH, exit if missing with error message
2. Derive REVIEW_DIR from path
3. Check SCRATCH_MEMORY_FILE exists
4. Create TodoWrite with 7 phases
5. Report completion, mark Phase 2 in_progress

### Phase 2: Deep Analysis (ULTRATHINK)

1. Read entire code review file
2. Parse all findings by severity: CRITICAL/HIGH/MEDIUM/LOW
3. Extract for each issue:
   - File path and line numbers
   - Issue description
   - Risk/Impact
   - Recommended fix (often includes code)
   - Best practices reference
4. Analyze dependencies between fixes
5. Assess complexity (simple/moderate/complex/research-needed)
6. Initialize or update SCRATCH_MEMORY_FILE:
   ```markdown
   # Scratch Memory: Code Review Remediation

   ## Domain Concepts
   ## Technical Patterns
   ## Integration Points
   ## Gotchas & Constraints
   ## Decisions & Rationale
   ## Assumptions
   ## Questions & Unknowns
   ## Reusable Solutions
   ```
7. Capture initial findings to scratch-memory.md
8. Report completion with summary, mark Phase 3 in_progress

### Phase 3: Planning → USER APPROVAL REQUIRED

1. Organize issues by priority (CRITICAL first) and dependencies
2. Create implementation tasks with:
   - Task ID, issue reference, severity
   - Action: CREATE/MODIFY/ADD/DELETE/INSTALL
   - File path
   - Code changes (use examples from review)
   - Dependencies (task IDs that must complete first)
   - Validation commands
3. Write REVIEW_FIX_PLAN_FILE:

```markdown
# Review Fix Plan

**Generated**: {timestamp}
**Source Review**: {CODE_REVIEW_PATH}

## Executive Summary
{Total issues by severity, files affected, strategy}

## Critical Issues
### Issue N: {Title}
**File**: {path} | **Line**: {lines} | **Severity**: 🚨 CRITICAL
**Problem**: {description}
**Solution**: {detailed fix with code}
**Validation**: {test commands}

## High Priority Issues
{Same structure}

## Medium Priority Issues
{Same structure}

## Low Priority Issues
{Same structure}

## Implementation Tasks
- [ ] Task 1: {name}
- [ ] Task 2: {name}

### Task 1: {Name}
**Addresses**: {Issue ref} | **Action**: {CREATE|MODIFY|etc} | **File**: {path} | **Severity**: {level}
**Dependencies**: {Task IDs or "None"}
**Changes**:
```{language}
{Code showing fix}
```
**Validation**:
```bash
{command}
# Expected: {outcome}
```

{Repeat for all tasks}

## Dependencies to Install
{npm/pip commands or "None"}

## Testing Strategy
1. Build validation: npm run build
2. Type checking: npm run typecheck
3. Unit tests: npm test
4. Manual testing: {scenarios}
```

4. Update scratch-memory.md with planning insights
5. Present plan summary to user
6. **WAIT FOR USER APPROVAL** before proceeding
7. Mark Phase 4 in_progress

### Phase 4: Gap Analysis & Clarification

1. Review REVIEW_FIX_PLAN_FILE for gaps:
   - Incomplete/ambiguous code examples
   - Multiple valid approaches
   - Missing dependency versions
   - Unclear validation criteria
2. Read existing files to understand context
3. If gaps found: use AskUserQuestion with clear options
4. Update REVIEW_FIX_PLAN_FILE with clarifications
5. Update scratch-memory.md
6. Report completion, mark Phase 5 in_progress

### Phase 5: Implementation Execution

1. Parse REVIEW_FIX_PLAN_FILE, extract all tasks in order
2. Update TodoWrite with individual task items
3. For each task sequentially:
   - Mark in_progress
   - Verify dependencies completed
   - Read target file if modifying
   - Execute action:
     - **INSTALL**: Bash to install packages
     - **CREATE**: Write new file
     - **MODIFY**: Edit existing code (match before/after from plan)
     - **ADD**: Edit to append code
     - **DELETE**: Edit to remove code
   - Run validation commands, capture results
   - On error: log and decide continue/stop (stop for build errors)
   - Mark completed
   - Update scratch-memory.md with insights
4. Run final validation suite:
   ```bash
   npm run typecheck || tsc --noEmit
   npm run build
   npm test
   npm run lint
   ```
5. Report completion with summary, mark Phase 6 in_progress

### Phase 6: Report Generation

Write REVIEW_FIX_REPORT_FILE:

```markdown
# Review Fix Report

**Generated**: {timestamp}
**Source**: {CODE_REVIEW_PATH}
**Plan**: {REVIEW_FIX_PLAN_FILE}
**Status**: ✅ SUCCESS | ⚠️ PARTIAL | ❌ FAILED

## Executive Summary
- Issues fixed: {count} CRITICAL, {count} HIGH, {count} MEDIUM, {count} LOW
- Files: {created} created, {modified} modified, {deleted} deleted
- Dependencies: {list or "None"}
- Validation: Type check {PASS/FAIL}, Build {PASS/FAIL}, Tests {PASS/FAIL}, Lint {PASS/FAIL}

## Issues Addressed
### Critical Issues Fixed
#### ✅ {Title}
**File**: {path} | **Fix**: {summary} | **Validation**: {result}

{Repeat for HIGH, MEDIUM, LOW}

## Files Modified
| File | Changes | Impact | Status |
|------|---------|--------|--------|
| {path} | {desc} | {H/M/L} | ✅ |

## Task Execution Details
| Task | Severity | Action | File | Status | Validation |
|------|----------|--------|------|--------|------------|
| 1 | CRITICAL | MODIFY | {file} | ✅ | ✅ |

## Validation Results
### Type Checking: {PASS/FAIL}
```bash
{command}
{output if failed}
```

{Repeat for Build, Tests, Linting}

## Dependencies Installed
- `{package}` v{version} - {purpose}

## Challenges Encountered
1. **{Challenge}**: {description} → **Resolution**: {how resolved}

## Deviations from Plan
1. **{What}**: Planned {X}, Actual {Y}, Reason {Z}, Impact {assessment}

## Remaining Issues
### {Severity}: {Title}
**Reason not fixed**: {why}
**Recommendation**: {next steps}

## Knowledge Captured
- Technical Patterns: {count} documented in scratch-memory.md
- Reusable Solutions: {count} identified
- Gotchas: {count} documented

## Conclusion
{Final assessment, confidence level HIGH/MEDIUM/LOW}
```

Report completion, mark Phase 7 in_progress

### Phase 7: Summary Display

Display to user based on status:

**SUCCESS:**
```
╔═══════════════════════════════════════════╗
║  🎉 REVIEW FIX COMPLETE - SUCCESS        ║
╚═══════════════════════════════════════════╝

✅ All issues addressed

📊 Summary:
- Fixed: {total} ({CRIT}, {HIGH}, {MED}, {LOW})
- Files: {created} created, {modified} modified
- Validation: ✅ All passed

📄 Documents:
- Plan: {REVIEW_FIX_PLAN_FILE}
- Report: {REVIEW_FIX_REPORT_FILE}
- Scratch: {SCRATCH_MEMORY_FILE}

🎯 Next Steps:
1. Manual testing
2. Run /review again (should be APPROVED)
3. Commit changes
```

**PARTIAL:**
```
╔═══════════════════════════════════════════╗
║  ⚠️  REVIEW FIX PARTIAL SUCCESS          ║
╚═══════════════════════════════════════════╝

⚠️  Some issues remain or validations failed

📊 Summary:
- Fixed: {completed}/{total}
- Validation: {status per check}

⚠️  Remaining: {list issues}

🎯 Next: Review report, address remaining issues
```

**FAILED:**
```
╔═══════════════════════════════════════════╗
║  ❌ REVIEW FIX FAILED                    ║
╚═══════════════════════════════════════════╝

Failed at Task {N}: {name}

Partial: {completed}/{total} fixed
Error: {description}

🔧 Recovery: See report for diagnostics
```

Mark Phase 7 completed

## Critical Rules

1. **User Approval**: MUST get approval after Phase 3 before implementation
2. **Priority Order**: Fix CRITICAL → HIGH → MEDIUM → LOW
3. **Dependency Awareness**: Complete prerequisite tasks first (e.g., create DTO before using it)
4. **Validation**: Run validation after each fix, capture results
5. **Knowledge Capture**: Update scratch-memory.md throughout all phases
6. **Error Handling**: Stop on build/syntax errors, warn on test failures
7. **Code Preservation**: Match indentation, preserve formatting when editing
8. **Progress Tracking**: One task in_progress at a time in TodoWrite

## Example Workflow

```bash
/feat-plan-build feats/add-auth
/review feats/add-auth                      # CHANGES REQUIRED
/review-fix feats/add-auth/code-review.md   # This command
# → Creates: review-fix-plan.md, review-fix-report.md
# → Updates: scratch-memory.md
/review feats/add-auth                      # APPROVED ✅
```

## Error Messages

**File not found:**
```
❌ Code review file not found: {CODE_REVIEW_PATH}
Usage: /review-fix <code-review-path>
```

**Validation failed:**
```
⚠️  Validation Failed: {type}
Command: {cmd}
Output: {error}
Continuing with remaining tasks...
```
