---
description: Perform comprehensive code review of recent changes, analyzing quality, security, and test coverage
argument-hint: "[feature-dir] [--files file1,file2,...]"
Allowed-tools: Read, Task, Glob, Bash, TodoWrite, Write
---

# Code Review: $ARGUMENTS

Orchestrate code review by spawning the code-reviewer agent and generating a report with clear approval status.

## Instructions

### Step 1: Parse Arguments and Identify Files

**Extract flags from $ARGUMENTS:**

First, check for optional flags and store them as variables:
- `--include-all`: If present, set INCLUDE_ALL=true and skip interactive issue selection
- `--clear-exclusions`: If present, set CLEAR_EXCLUSIONS=true and delete `.review-exclusions.json` if it exists

After extracting flags, remove them from $ARGUMENTS before processing file discovery.

Example parsing logic:
```bash
INCLUDE_ALL=false
CLEAR_EXCLUSIONS=false
ARGS="$ARGUMENTS"

# Check for --include-all
if [[ "$ARGS" == *"--include-all"* ]]; then
  INCLUDE_ALL=true
  ARGS="${ARGS//--include-all/}"
fi

# Check for --clear-exclusions
if [[ "$ARGS" == *"--clear-exclusions"* ]]; then
  CLEAR_EXCLUSIONS=true
  ARGS="${ARGS//--clear-exclusions/}"
fi

# Trim whitespace
ARGS="$(echo "$ARGS" | xargs)"
```

**Handle --clear-exclusions flag:**

If CLEAR_EXCLUSIONS=true and FEATURE_DIR is determined (or use current directory):
```bash
if [ "$CLEAR_EXCLUSIONS" = true ]; then
  EXCLUSION_FILE="${FEATURE_DIR:-.}/.review-exclusions.json"
  if [ -f "$EXCLUSION_FILE" ]; then
    rm "$EXCLUSION_FILE"
    echo "✓ Cleared exclusions from previous reviews"
  fi
fi
```

**Determine review mode from remaining arguments:**

**Mode 1: Feature Directory**
```bash
/review feats/add-user-field
/review feats/add-user-field --include-all
```
Extract FEATURE_DIR and find files from development-report.md

**Mode 2: Specific Files**
```bash
/review --files backend/src/auth.ts,frontend/src/Login.jsx
/review --files backend/src/auth.ts,frontend/src/Login.jsx --include-all
```
Extract comma-separated file paths after --files flag

**Mode 3: Auto-detect**
```bash
/review
/review --include-all
```
Find recently modified files using git status

**File Discovery Logic:**

If FEATURE_DIR provided:
1. Check if `{FEATURE_DIR}/development-report.md` exists
2. If exists, read it and extract file paths from "Files Created" and "Files Modified" sections
3. If not exists, use `find {FEATURE_DIR} -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \)`

If --files flag:
1. Split comma-separated list: `file1,file2,file3` → `[file1, file2, file3]`
2. Trim whitespace from each path

If no arguments:
1. Try git: `git status --short | grep -E '^(M|A)' | awk '{print $2}' | grep -E '\.(ts|tsx|js|jsx)$'`
2. Fallback: `find . -maxdepth 3 -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -mtime -7 | head -20`

**Handle errors:**
- If no files found: Display error and exit
- If feature directory doesn't exist: Display error and exit

### Step 2: Categorize Files by Domain

For each file, determine domain based on path patterns:
- Contains `backend/` or `server/` or `api/` or ends with `.controller.ts` or `.service.ts` → **backend**
- Contains `frontend/` or `client/` or `ui/` or ends with `.jsx` or `.tsx` or `.vue` → **frontend**
- Contains `__tests__/` or ends with `.test.` or `.spec.` → **test**
- Matches `package.json`, `tsconfig.json`, `.eslintrc` → **config**
- Everything else → **general**

Build domain summary:
```
Backend: [count] files
Frontend: [count] files
Test: [count] files
Config: [count] files
Other: [count] files
```

### Step 3: Spawn Code-Reviewer Agent

Use Task tool to invoke the code-reviewer agent:

```
Task tool:
  subagent_type: "feature-dev:code-reviewer"
  description: "Review code for quality, security, and testing"
  prompt: "Review the following files for code quality, security vulnerabilities, testing coverage, and best practice adherence.

Files to review:
[List each file path, one per line]

Domain breakdown:
- Backend: [count] files
- Frontend: [count] files
- Test: [count] files

For each file:
1. Read and analyze the code thoroughly
2. Identify issues in: Security, Code Quality, Testing, Best Practices, AI Slop
3. Research relevant patterns from .ai-docs using Task tool
4. Categorize findings by severity: CRITICAL/HIGH/MEDIUM/LOW
5. Provide specific line numbers and actionable recommendations

**AI Slop Detection:**
Identify low-quality AI-generated code patterns:
- Unnecessary comments that state the obvious (e.g., `// increment counter` above `counter++`)
- Over-commenting where code is self-explanatory
- Overly verbose or redundant comments restating the code
- Premature abstractions (helpers/utilities for one-time operations)
- Defensive over-engineering (error handling for impossible scenarios)
- Excessive boilerplate or wrapper functions
- Docstrings that just restate function signatures
- Feature flags or configurability that will never be used
- Overly complex solutions to simple problems
Categorize AI slop as MEDIUM severity unless it significantly impacts maintainability

Return a structured analysis with:
- Executive summary (files reviewed, issue counts by severity, overall assessment, AI slop count)
- All findings organized by file and category
- For each finding: severity, description, line number, recommendation, relevant pattern reference
- Separate AI slop findings section with specific examples

This is 'Warn & Continue' mode - provide thorough analysis without blocking."
```

### Step 3.5: Interactive Issue Selection

After the code-reviewer agent returns findings, before generating the report:

**1. Parse agent output to extract all issues**

Parse the agent's response to identify all issues with the following structure:
```javascript
{
  "file": "path/to/file.ts",
  "line": 45,
  "severity": "HIGH" | "MEDIUM" | "LOW" | "CRITICAL",
  "issue": "Brief description",
  "description": "Full description",
  "recommendation": "How to fix"
}
```

**2. Load existing exclusions**

Read `.review-exclusions.json` from the feature directory (or current directory):
```bash
EXCLUSION_FILE="${FEATURE_DIR:-.}/.review-exclusions.json"

if [ -f "$EXCLUSION_FILE" ]; then
  # Load existing exclusions
  EXISTING_EXCLUSIONS=$(cat "$EXCLUSION_FILE")
else
  EXISTING_EXCLUSIONS='{"version":"1.0","exclusions":[]}'
fi
```

**3. Generate issue IDs and filter excluded issues**

For each issue, generate a stable ID using hash of:
- File path
- Line number (with ±3 line fuzzy matching tolerance)
- Issue description (first 50 chars)

Filter out issues that match existing exclusions (by ID with fuzzy line matching).

**4. Check if interactive selection is needed**

Skip interactive selection if:
- `INCLUDE_ALL=true` flag is set
- No issues remaining after filtering exclusions
- Agent found 0 issues

**5. Separate CRITICAL issues (auto-include)**

CRITICAL severity issues are NEVER presented for selection - they are automatically included in the report.

**6. Present issues for user selection using AskUserQuestion**

For remaining issues (HIGH, MEDIUM, LOW), batch by severity and present using AskUserQuestion with `multiSelect: true`:

**Example for HIGH severity:**
```javascript
AskUserQuestion tool:
{
  "questions": [
    {
      "question": "Select HIGH priority issues to include in the report (2 issues found):",
      "header": "HIGH Issues",
      "multiSelect": true,
      "options": [
        {
          "label": "backend/auth.ts:45 - Missing error handling",
          "description": "Function lacks try-catch for database operations"
        },
        {
          "label": "frontend/Login.jsx:23 - Security vulnerability",
          "description": "Password exposed in client-side logs"
        }
      ]
    }
  ]
}
```

**Present in order:** HIGH → MEDIUM → LOW (separate question for each severity level that has issues)

**7. Process user selections**

For each severity level:
- Issues selected by user: Include in report
- Issues NOT selected: Add to exclusions

**8. Save updated exclusions**

For each excluded issue, generate exclusion entry:
```json
{
  "id": "hash-of-issue",
  "file": "path/to/file.ts",
  "line": 45,
  "severity": "MEDIUM",
  "issue": "Brief description",
  "reason": "User marked as non-issue",
  "excludedAt": "2026-01-05T10:30:00Z",
  "excludedInRound": 2
}
```

Write updated exclusions back to `.review-exclusions.json` using Write tool.

**9. Build final issue list**

Combine:
- All CRITICAL issues (auto-included)
- User-selected HIGH/MEDIUM/LOW issues

This filtered list will be used for report generation in Step 4.

Store both:
- `INCLUDED_ISSUES`: Issues to include in main report sections
- `EXCLUDED_ISSUES`: Issues excluded in this round (for summary section)

### Step 4: Generate Report from Agent Output

After the agent completes and returns findings (and after Step 3.5 interactive selection):

**IMPORTANT**: Use `INCLUDED_ISSUES` from Step 3.5 for all report sections (Critical, High, Medium, Low).
The `EXCLUDED_ISSUES` list should only appear in the summary section.

**Determine report location with round tracking:**

1. Determine base directory:
   - If FEATURE_DIR: `{FEATURE_DIR}/`
   - Otherwise: `./`

2. Check for existing reviews and find next available filename:
   ```bash
   # Check if code-review.md exists
   if [ -f "{base_dir}/code-review.md" ]; then
     # Find next available round number
     round=2
     while [ -f "{base_dir}/code-review-round-${round}.md" ]; do
       round=$((round + 1))
     done
     REVIEW_FILE="{base_dir}/code-review-round-${round}.md"
     REVIEW_ROUND=${round}
     PREVIOUS_REVIEW="{base_dir}/code-review-round-$((round - 1)).md"
     if [ ! -f "$PREVIOUS_REVIEW" ]; then
       PREVIOUS_REVIEW="{base_dir}/code-review.md"
     fi
   else
     REVIEW_FILE="{base_dir}/code-review.md"
     REVIEW_ROUND=1
     PREVIOUS_REVIEW=""
   fi
   ```

3. If REVIEW_ROUND > 1, optionally read PREVIOUS_REVIEW to understand what was fixed

**Calculate approval status (based on INCLUDED_ISSUES only):**
- If any CRITICAL issues in INCLUDED_ISSUES: **CHANGES REQUIRED**
- If any HIGH issues in INCLUDED_ISSUES and no CRITICAL: **CHANGES REQUIRED**
- If only MEDIUM/LOW or no issues in INCLUDED_ISSUES: **APPROVED**

Note: Excluded issues do NOT affect approval status. Only issues the user selected for inclusion determine whether changes are required.

**Use Write tool to create REVIEW_FILE:**

```markdown
# Code Review Report [If REVIEW_ROUND > 1: - Round {REVIEW_ROUND}]

**Generated**: [current timestamp]
**Reviewed By**: Code Reviewer Agent
**Review Mode**: Warn & Continue
[If REVIEW_ROUND > 1:]
**Review Round**: {REVIEW_ROUND}
**Previous Review**: {PREVIOUS_REVIEW}

---

[If REVIEW_ROUND > 1:]
## 📋 Review History

This is review round {REVIEW_ROUND}. Previous review(s):
- Round {REVIEW_ROUND - 1}: {PREVIOUS_REVIEW} [If exists: - {status from file if readable}]
[If REVIEW_ROUND > 2: - Round 1: code-review.md]

---

## 🔍 REVIEW STATUS: [APPROVED / CHANGES REQUIRED]

[If APPROVED:]
✅ **This change is APPROVED**

No critical or high-severity issues found. The code meets quality standards and can proceed.

[If CHANGES REQUIRED:]
⚠️  **CHANGES REQUIRED**

Critical or high-severity issues must be addressed before proceeding:
- [Count] Critical issues
- [Count] High-priority issues

See detailed findings below.

---

## Executive Summary

**Files Reviewed**: [count from agent output]
**Total Issues Found**: [count from INCLUDED_ISSUES]
- 🚨 Critical: [count from INCLUDED_ISSUES]
- ⚠️  High: [count from INCLUDED_ISSUES]
- ⚙️  Medium: [count from INCLUDED_ISSUES]
- ℹ️  Low: [count from INCLUDED_ISSUES]
- 🤖 AI Slop: [count from INCLUDED_ISSUES]

[If EXCLUDED_ISSUES is not empty:]
**Excluded from Report**: [count from EXCLUDED_ISSUES] issues (see Excluded Issues section below)

**Key Findings**: [1-2 sentence summary from agent based on INCLUDED_ISSUES]

---

[If EXCLUDED_ISSUES is not empty:]
## Excluded Issues

The following issues were reviewed but excluded from this report by user selection:

[Group by severity level]

[If HIGH severity exclusions exist:]
**HIGH Priority ([count] excluded):**
[For each excluded HIGH issue:]
- `[file path]:[line]` - [issue title/brief description]

[If MEDIUM severity exclusions exist:]
**MEDIUM Priority ([count] excluded):**
[For each excluded MEDIUM issue:]
- `[file path]:[line]` - [issue title/brief description]

[If LOW severity exclusions exist:]
**LOW Priority ([count] excluded):**
[For each excluded LOW issue:]
- `[file path]:[line]` - [issue title/brief description]

Full details of all exclusions are stored in `.review-exclusions.json`

To include all issues in a future review, use: `/review [feature-dir] --include-all`

---

## Critical Issues

[If none in INCLUDED_ISSUES: "None found. ✅"]

[For each critical issue from INCLUDED_ISSUES:]
### [File Path]
**Line**: [line number from agent]
**Issue**: [description from agent]
**Risk**: [risk explanation from agent]
**Recommendation**: [fix recommendation from agent]
**Reference**: [.ai-docs reference if provided by agent]

---

## High Priority Issues

[If none in INCLUDED_ISSUES: "None found. ✅"]

[For each high issue from INCLUDED_ISSUES:]
### [File Path]
**Line**: [line number from agent]
**Issue**: [description from agent]
**Impact**: [impact explanation from agent]
**Recommendation**: [fix recommendation from agent]

---

## Medium Priority Issues

[If none in INCLUDED_ISSUES: "None found. ✅"]

[For each medium issue from INCLUDED_ISSUES:]
### [File Path]
**Line**: [line number from agent]
**Issue**: [description from agent]
**Recommendation**: [fix recommendation from agent]

---

## Low Priority Issues

[If none in INCLUDED_ISSUES: "None found. ✅"]

[For each low issue from INCLUDED_ISSUES:]
### [File Path]
**Line**: [line number from agent]
**Issue**: [description from agent]

---

## Review Summary by File

[For each file reviewed, using agent output:]

### 📄 `[file path]`
**Domain**: [backend/frontend/test/config/general]
**Issues Found**: [count from agent]
- Critical: [count]
- High: [count]
- Medium: [count]
- Low: [count]

[Brief summary of main issues from agent]

---

## Security Analysis

[Agent's security findings summary]

---

## Test Coverage Analysis

[Agent's test coverage findings summary]

---

## AI Slop Detection

[Agent's AI slop findings - unnecessary comments, over-engineering, premature abstractions]

**Common AI Slop Patterns to Flag:**
- Comments that just restate what the code does
- Over-commented self-explanatory code
- Premature abstractions for one-time use
- Defensive error handling for impossible cases
- Excessive boilerplate or wrapper layers
- Overly complex solutions to simple problems

---

## Best Practice Violations

[Agent's best practice findings with .ai-docs references]

---

## Recommendations

### Immediate Actions Required
[Agent's critical/high priority recommendations]

### Should Address Soon
[Agent's medium priority recommendations]

### Future Improvements
[Agent's low priority suggestions]

---

## Next Steps

[If CHANGES REQUIRED:]
1. ⚠️  Address all critical issues immediately
2. ⚠️  Fix high-priority issues before deployment
3. Schedule medium-priority fixes for upcoming sprint
4. Consider low-priority improvements during refactoring

[If APPROVED:]
1. ✅ Code review passed - ready to proceed
2. Consider addressing medium/low issues in future iterations
3. Continue with deployment or merge process
```

### Step 5: Display Summary to User

Show formatted summary in console:

**If CHANGES REQUIRED:**
```
## ⚠️  Code Review [If REVIEW_ROUND > 1: Round {REVIEW_ROUND}]: CHANGES REQUIRED

**Files Reviewed**: [count]
**Critical Issues**: [count from INCLUDED_ISSUES] 🚨
**High Priority Issues**: [count from INCLUDED_ISSUES] ⚠️
**Medium Issues**: [count from INCLUDED_ISSUES]
**Low Issues**: [count from INCLUDED_ISSUES]
**AI Slop Detected**: [count from INCLUDED_ISSUES] 🤖

[If EXCLUDED_ISSUES is not empty:]
**Excluded Issues**: [count from EXCLUDED_ISSUES] (not affecting approval status)

**Status**: Changes must be made before proceeding
[If REVIEW_ROUND > 1:]
**Review Round**: {REVIEW_ROUND} (Previous: {PREVIOUS_REVIEW})

**Top Issues to Address**:
1. [First critical/high issue summary]
2. [Second critical/high issue summary]
3. [Third critical/high issue summary]

**Report Location**: `{REVIEW_FILE}`

⚠️  Review the full report and address critical/high issues before deployment.
[If REVIEW_ROUND > 1:]
💡 Run /review-fix {REVIEW_FILE} to apply fixes
```

**If APPROVED:**
```
## ✅ Code Review [If REVIEW_ROUND > 1: Round {REVIEW_ROUND}]: APPROVED

**Files Reviewed**: [count]
**Issues Found**: [total from INCLUDED_ISSUES]
- Medium: [count from INCLUDED_ISSUES]
- Low: [count from INCLUDED_ISSUES]
- AI Slop: [count from INCLUDED_ISSUES] 🤖

[If EXCLUDED_ISSUES is not empty:]
**Excluded Issues**: [count from EXCLUDED_ISSUES] (not affecting approval)

**Status**: ✅ This change is approved
[If REVIEW_ROUND > 1:]
**Review Round**: {REVIEW_ROUND} [If REVIEW_ROUND == 2: (Improvements from previous review applied! 🎉)]

No critical or high-severity issues found. Code meets quality standards.

[If medium/low issues exist in INCLUDED_ISSUES:]
**Optional Improvements**: [count] medium/low priority suggestions available in report

[If EXCLUDED_ISSUES is not empty:]
💡 Tip: [count from EXCLUDED_ISSUES] issues were excluded by user selection. Use `--include-all` to review all issues.

**Report Location**: `{REVIEW_FILE}`

✅ Ready to proceed with deployment or merge.
[If REVIEW_ROUND > 1:]
📊 Review progression: Round 1 → Round {REVIEW_ROUND} ✅
```

**If NO issues in INCLUDED_ISSUES:**
```
## 🎉 Code Review [If REVIEW_ROUND > 1: Round {REVIEW_ROUND}]: APPROVED

**Files Reviewed**: [count]
**Issues Found**: 0

[If EXCLUDED_ISSUES is not empty:]
**Note**: [count from EXCLUDED_ISSUES] issues were excluded by user selection and are not blocking approval.

**Status**: ✅ Excellent! No issues found.
[If REVIEW_ROUND > 1:]
**Review Round**: {REVIEW_ROUND} - Perfect! All previous issues resolved! 🎉

The code looks great and meets all quality standards.

[If EXCLUDED_ISSUES is not empty:]
💡 Tip: Excluded issues are listed in the report. Use `--clear-exclusions` to reset for future reviews.

**Report Location**: `{REVIEW_FILE}`
[If REVIEW_ROUND > 1:]
📊 Review progression: Round 1 → Round {REVIEW_ROUND} ✅ (Clean code!)
```

## Error Handling

**No files found:**
```
❌ No files to review.

Usage:
  /review [feature-dir]              # Review feature changes
  /review --files file1.ts,file2.js  # Review specific files
  /review                            # Auto-detect recent changes
```

**Feature directory not found:**
```
❌ Error: Feature directory not found: [path]

Please verify the path or use:
  /review --files file1,file2    # Review specific files
  /review                        # Auto-detect changes
```

**Agent fails:**
```
❌ Code review failed

The code-reviewer agent encountered an error. Please check:
- File paths are valid and readable
- Files contain valid code
- Feature directory structure is correct

Try again or review files manually.
```

## Example Usage

```bash
# Review feature directory (with interactive issue selection)
/review feats/add-user-authentication

# Review with all issues included (skip interactive selection)
/review feats/add-user-authentication --include-all

# Clear previous exclusions and start fresh
/review feats/add-user-authentication --clear-exclusions

# Review specific files
/review --files backend/src/auth.ts,frontend/src/Login.tsx

# Auto-detect changes
/review

# Combine flags
/review feats/add-user-authentication --clear-exclusions --include-all
```

## Integration with Workflow

Standard feature development workflow with iterative reviews:

```bash
# 1. Plan
/feat-dev-plan "Add authentication"

# 2. Build
/feat-plan-build feats/add-authentication

# 3. Review (Round 1)
/review feats/add-authentication
# → Creates: code-review.md
# → Status: CHANGES REQUIRED (2 Critical, 6 High issues)

# 4. Fix issues (Round 1)
/review-fix feats/add-authentication/code-review.md
# → Creates: review-fix-plan.md, review-fix-report.md

# 5. Review again (Round 2)
/review feats/add-authentication
# → Creates: code-review-round-2.md
# → Status: CHANGES REQUIRED (1 High, 3 Medium issues remain)

# 6. Fix remaining issues (Round 2)
/review-fix feats/add-authentication/code-review-round-2.md

# 7. Final review (Round 3)
/review feats/add-authentication
# → Creates: code-review-round-3.md
# → Status: APPROVED ✅

# 8. Proceed with deployment
```

## Round Tracking System

The review command automatically tracks multiple review rounds to maintain audit history:

**File Naming Pattern:**
- **Round 1**: `code-review.md` (initial review)
- **Round 2**: `code-review-round-2.md` (after first fix cycle)
- **Round 3**: `code-review-round-3.md` (after second fix cycle)
- **Round N**: `code-review-round-N.md` (continues as needed)

**How It Works:**
1. First `/review` call creates `code-review.md`
2. After fixes applied, next `/review` detects existing file
3. Automatically creates `code-review-round-2.md` with history reference
4. Each subsequent review increments the round number
5. Previous reviews remain unchanged for comparison

**Example Directory Structure After Multiple Rounds:**
```
feats/add-authentication/
├── plan.md
├── tasks.md
├── scratch-memory.md
├── development-report.md
├── .review-exclusions.json     ← Persistent issue exclusions
├── code-review.md              ← Round 1: CHANGES REQUIRED
├── review-fix-plan.md           (fixes from round 1)
├── review-fix-report.md
├── code-review-round-2.md      ← Round 2: CHANGES REQUIRED
├── review-fix-plan.md           (updated with round 2 fixes)
├── review-fix-report.md         (updated)
└── code-review-round-3.md      ← Round 3: APPROVED ✅
```

**Benefits:**
- **Audit Trail**: Complete history of all review iterations
- **Progress Tracking**: See improvement across rounds
- **Comparison**: Compare issues found in different rounds
- **Accountability**: Clear record of what was fixed when
- **No Overwrites**: Previous reviews never lost

## Notes

- **Approval-Based**: Clear APPROVED/CHANGES REQUIRED status at top of report
- **Interactive Issue Selection**: Users can select which issues to include in the report, excluding non-issues
- **Persistent Exclusions**: Excluded issues are remembered across review rounds via `.review-exclusions.json`
- **Round Tracking**: Automatically creates versioned reviews (see above)
- **Iterative Workflow**: Supports multiple review → fix → review cycles until approved
- **History Preservation**: Each round's report is kept for audit trail and comparison
- **Agent-Driven**: All analysis done by specialized code-reviewer agent
- **Non-Blocking**: Provides status but doesn't fail the build
- **Actionable**: Agent provides specific recommendations with line numbers
- **Research-Backed**: Agent uses .ai-docs patterns for best practice validation
- **AI Slop Detection**: Identifies unnecessary comments, over-engineering, and premature abstractions typical of low-quality AI-generated code
- **CRITICAL Issues Always Included**: Security vulnerabilities and critical issues cannot be excluded
- **Flexible Review Modes**: Use `--include-all` to bypass selection or `--clear-exclusions` to reset

The command orchestrates the review workflow while the agent provides the expertise and analysis. Multiple review rounds track progress toward code quality standards. Interactive issue selection reduces noise by allowing users to focus on real problems while maintaining an audit trail of all findings.
