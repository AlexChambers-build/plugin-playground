---
description: Perform comprehensive code review of recent changes, analyzing quality, security, and test coverage
argument-hint: "[feature-dir] [--files file1,file2,...]"
Allowed-tools: Read, Task, Glob, Bash, TodoWrite, Write
---

# Code Review: $ARGUMENTS

Orchestrate code review by spawning the code-reviewer agent and generating a report with clear approval status.

## Instructions

### Step 1: Parse Arguments and Identify Files

**Determine review mode from $ARGUMENTS:**

**Mode 1: Feature Directory**
```bash
/review feats/add-user-field
```
Extract FEATURE_DIR and find files from development-report.md

**Mode 2: Specific Files**
```bash
/review --files backend/src/auth.ts,frontend/src/Login.jsx
```
Extract comma-separated file paths after --files flag

**Mode 3: Auto-detect**
```bash
/review
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
2. Identify issues in: Security, Code Quality, Testing, Best Practices
3. Research relevant patterns from .ai-docs using Task tool
4. Categorize findings by severity: CRITICAL/HIGH/MEDIUM/LOW
5. Provide specific line numbers and actionable recommendations

Return a structured analysis with:
- Executive summary (files reviewed, issue counts by severity, overall assessment)
- All findings organized by file and category
- For each finding: severity, description, line number, recommendation, relevant pattern reference

This is 'Warn & Continue' mode - provide thorough analysis without blocking."
```

### Step 4: Generate Report from Agent Output

After the agent completes and returns findings:

**Determine report location:**
- If FEATURE_DIR: `{FEATURE_DIR}/code-review.md`
- Otherwise: `./code-review.md`

**Calculate approval status:**
- If any CRITICAL issues: **CHANGES REQUIRED**
- If any HIGH issues and no CRITICAL: **CHANGES REQUIRED**
- If only MEDIUM/LOW or no issues: **APPROVED**

**Use Write tool to create code-review.md:**

```markdown
# Code Review Report

**Generated**: [current timestamp]
**Reviewed By**: Code Reviewer Agent
**Review Mode**: Warn & Continue

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
**Total Issues**: [total from agent output]
- 🚨 Critical: [count]
- ⚠️  High: [count]
- ⚙️  Medium: [count]
- ℹ️  Low: [count]

**Key Findings**: [1-2 sentence summary from agent]

---

## Critical Issues

[If none: "None found. ✅"]

[For each critical issue from agent output:]
### [File Path]
**Line**: [line number from agent]
**Issue**: [description from agent]
**Risk**: [risk explanation from agent]
**Recommendation**: [fix recommendation from agent]
**Reference**: [.ai-docs reference if provided by agent]

---

## High Priority Issues

[If none: "None found. ✅"]

[For each high issue from agent output:]
### [File Path]
**Line**: [line number from agent]
**Issue**: [description from agent]
**Impact**: [impact explanation from agent]
**Recommendation**: [fix recommendation from agent]

---

## Medium Priority Issues

[For each medium issue from agent output:]
### [File Path]
**Line**: [line number from agent]
**Issue**: [description from agent]
**Recommendation**: [fix recommendation from agent]

---

## Low Priority Issues

[For each low issue from agent output:]
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
## ⚠️  Code Review: CHANGES REQUIRED

**Files Reviewed**: [count]
**Critical Issues**: [count] 🚨
**High Priority Issues**: [count] ⚠️
**Medium Issues**: [count]
**Low Issues**: [count]

**Status**: Changes must be made before proceeding

**Top Issues to Address**:
1. [First critical/high issue summary]
2. [Second critical/high issue summary]
3. [Third critical/high issue summary]

**Report Location**: `[path]`

⚠️  Review the full report and address critical/high issues before deployment.
```

**If APPROVED:**
```
## ✅ Code Review: APPROVED

**Files Reviewed**: [count]
**Issues Found**: [total]
- Medium: [count]
- Low: [count]

**Status**: ✅ This change is approved

No critical or high-severity issues found. Code meets quality standards.

[If medium/low issues exist:]
**Optional Improvements**: [count] medium/low priority suggestions available in report

**Report Location**: `[path]`

✅ Ready to proceed with deployment or merge.
```

**If NO issues at all:**
```
## 🎉 Code Review: APPROVED

**Files Reviewed**: [count]
**Issues Found**: 0

**Status**: ✅ Excellent! No issues found.

The code looks great and meets all quality standards.

**Report Location**: `[path]`
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
# Review feature directory
/review feats/add-user-authentication

# Review specific files
/review --files backend/src/auth.ts,frontend/src/Login.tsx

# Auto-detect changes
/review
```

## Integration with Workflow

Standard feature development workflow:

```bash
# 1. Plan
/feat-dev-plan "Add authentication"

# 2. Build
/feat-plan-build feats/add-authentication

# 3. Review (NEW)
/review feats/add-authentication

# 4. If APPROVED: proceed
# 5. If CHANGES REQUIRED: fix issues and re-review
```

## Notes

- **Approval-Based**: Clear APPROVED/CHANGES REQUIRED status at top of report
- **Agent-Driven**: All analysis done by specialized code-reviewer agent
- **Non-Blocking**: Provides status but doesn't fail the build
- **Actionable**: Agent provides specific recommendations with line numbers
- **Research-Backed**: Agent uses .ai-docs patterns for best practice validation

The command orchestrates the review workflow while the agent provides the expertise and analysis.
