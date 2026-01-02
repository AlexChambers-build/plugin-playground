---
description: Perform comprehensive code review of recent changes, analyzing quality, security, and test coverage
argument-hint: "[feature-dir] [--files file1,file2,...]"
Allowed-tools: Read, Task, Glob, Bash, TodoWrite
---

# Code Review: $ARGUMENTS

Perform comprehensive code review analyzing code quality, security vulnerabilities, and test coverage.

## Instructions

You will conduct a thorough code review of files by spawning the code-reviewer agent.

### Step 1: Parse Arguments

Extract the review target from $ARGUMENTS:

**Pattern 1: Feature Directory**
```
/review feats/add-user-field
```
- FEATURE_DIR = "feats/add-user-field"
- Mode: Review files from development-report.md

**Pattern 2: Specific Files**
```
/review --files backend/src/auth.ts,frontend/src/Login.jsx
```
- Mode: Review specified files

**Pattern 3: No Arguments**
```
/review
```
- Mode: Find and review recently modified files

### Step 2: Create Todo List

Use TodoWrite to create a simple progress tracker:
```
[
  { "content": "Identify files to review", "status": "in_progress", "activeForm": "Identifying files to review" },
  { "content": "Spawn code-reviewer agent", "status": "pending", "activeForm": "Spawning code-reviewer agent" },
  { "content": "Display review summary", "status": "pending", "activeForm": "Displaying review summary" }
]
```

### Step 3: Determine Files to Review

**If FEATURE_DIR provided:**
1. Verify the directory exists
2. Check for development-report.md file
3. If found, read it to extract the list of created/modified files
4. Pass the feature directory path to the agent

**If --files provided:**
1. Parse the comma-separated file list
2. Verify each file exists (optional, agent will handle)
3. Pass the file list to the agent

**If no arguments:**
1. Use Bash tool to find recently modified files:
   ```bash
   git status --short | grep -E '^(M|A)' | awk '{print $2}'
   ```
   or if not a git repo:
   ```bash
   find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -20
   ```
2. Pass the file list to the agent

Mark the first todo as completed and move to next.

### Step 4: Spawn Code-Reviewer Agent

Use the Task tool to spawn the code-reviewer agent:

**For feature directory:**
```
Task tool:
  subagent_type: "feature-dev:code-reviewer"
  description: "Review code changes"
  prompt: "Review all code changes in the feature directory: [FEATURE_DIR]

  The development-report.md file contains the list of files that were created or modified.

  Analyze each file for:
  - Code quality issues (complexity, maintainability, organization)
  - Security vulnerabilities (injection risks, authentication issues, data exposure)
  - Test coverage (missing tests, test quality, conventions)
  - Best practice adherence (use /research to get patterns from .ai-docs)

  Generate a comprehensive code-review.md report in the feature directory with severity levels:
  - CRITICAL: Security vulnerabilities, data loss risks
  - HIGH: Bugs, missing error handling, missing tests
  - MEDIUM: Best practice violations, code complexity
  - LOW: Style issues, minor improvements

  This is 'Warn & Continue' mode - provide warnings and recommendations but don't block."
```

**For specific files:**
```
Task tool:
  subagent_type: "feature-dev:code-reviewer"
  description: "Review specific files"
  prompt: "Review the following files: [comma-separated file list]

  Analyze each file for:
  - Code quality issues
  - Security vulnerabilities
  - Test coverage
  - Best practice adherence

  Generate a code-review.md report with findings categorized by severity (CRITICAL/HIGH/MEDIUM/LOW).

  This is 'Warn & Continue' mode - provide warnings but don't block."
```

Mark the second todo as completed.

### Step 5: Display Review Summary

After the agent completes:

1. Read the generated code-review.md file to extract the executive summary
2. Display a formatted summary to the user:

```markdown
## ✅ Code Review Complete

**Files Reviewed**: [count from report]
**Issues Found**: [total]
- 🚨 Critical: [count]
- ⚠️  High: [count]
- ⚙️  Medium: [count]
- ℹ️  Low: [count]

**Overall Status**: [PASS WITH WARNINGS / NEEDS ATTENTION / SERIOUS ISSUES FOUND]

**Report Location**: `[path to code-review.md]`

### Key Findings:
- [1-2 sentence summary from report]

### Next Steps:
1. Review the full report: `[report path]`
2. Address critical issues immediately
3. Plan fixes for high-priority issues
4. Schedule medium/low issues for future refactoring

[If critical or high issues found:]
⚠️  **Action Required**: [count] critical/high severity issues need attention
```

Mark the final todo as completed.

### Step 6: Provide Additional Guidance

Based on the severity of issues found:

**If CRITICAL issues found:**
```
🚨 **CRITICAL ISSUES DETECTED**

Security vulnerabilities or data loss risks were identified. Review these immediately before deployment:
[List critical issues from report]

Recommendation: Address these issues before proceeding with deployment.
```

**If only HIGH/MEDIUM/LOW issues:**
```
✅ No critical issues found.

Review the report for recommendations on code quality, testing, and best practices.
```

**If NO issues found:**
```
🎉 **Excellent!**

No significant issues found. The code looks good!
```

## Example Usage

```bash
# Review changes in a feature directory
/review feats/add-user-authentication

# Review specific files
/review --files backend/src/auth.ts,frontend/src/Login.tsx

# Review recent changes (auto-detect)
/review
```

## Output Files

- **code-review.md**: Comprehensive review report with all findings
  - Located in feature directory if provided
  - Located in current directory otherwise

## Error Handling

**If feature directory doesn't exist:**
```
Error: Feature directory not found: [path]

Please verify the path or use --files to review specific files.
```

**If development-report.md not found:**
```
Warning: development-report.md not found in [feature-dir]

Scanning directory for code files to review...
```

**If no files to review:**
```
No files found to review.

Usage:
  /review [feature-dir]           - Review feature changes
  /review --files file1,file2     - Review specific files
```

## Integration with feat-plan-build

After running `/feat-plan-build`, you can run `/review` to perform a comprehensive code review:

```bash
# 1. Build the feature
/feat-plan-build feats/add-user-field

# 2. Review the changes
/review feats/add-user-field

# 3. Address any critical/high issues found
# 4. Re-run tests and validation
```

## Notes

- **Non-Blocking**: This command provides warnings and recommendations but never blocks the build
- **Severity-Based**: Issues are categorized as CRITICAL, HIGH, MEDIUM, or LOW
- **Best Practices**: Integrates with .ai-docs knowledge base to check pattern adherence
- **Actionable**: Provides specific recommendations with line numbers and code examples
- **Comprehensive**: Covers code quality, security, testing, and best practices

The code-reviewer agent will use the `/research` command to fetch relevant best practices from the knowledge base and compare your code against documented patterns.
