---
Allowed-tools: Read, Write, Edit, TodoWrite, AskUserQuestion, Grep, Glob, Bash
argument-hint: "<code-review-path>"
description: "Implement changes suggested in a code review with planning, gap analysis, and execution"
---

# Purpose

Execute comprehensive fixing of code review findings by reading the review, creating an implementation plan, and systematically fixing all identified issues. This command follows a streamlined but rigorous approach: deep analysis, planning, clarification, and execution, with continuous knowledge capture to scratch-memory.md throughout the process.

## Variables

CODE_REVIEW_PATH: $1
- The path to the code review markdown file
- Used for: Locating and reading the code review findings
- Required: Yes
- Expected format: path/to/code-review.md or feats/feature-name/code-review.md
- Example: "feats/delete-task/code-review.md"

REVIEW_DIR: (derived from CODE_REVIEW_PATH)
- The directory containing the code review file
- Used for: Storing review-fix plan, report, and scratch-memory.md
- Derived by: Extracting directory path from CODE_REVIEW_PATH
- Example: "feats/delete-task" if CODE_REVIEW_PATH is "feats/delete-task/code-review.md"

REVIEW_FIX_PLAN_FILE: {REVIEW_DIR}/review-fix-plan.md
- Generated document with implementation plan for addressing review findings
- Used for: Planning fixes before implementation
- Created: Phase 3
- Sections: Executive Summary, Critical Issues, High Priority Issues, Medium Priority Issues, Low Priority Issues, Implementation Tasks

SCRATCH_MEMORY_FILE: {REVIEW_DIR}/scratch-memory.md
- Knowledge capture document (create if doesn't exist, update if exists)
- Used for: Capturing insights, patterns, and decisions during review fixes
- Structure: 8 categories (Domain Concepts, Technical Patterns, Integration Points, Gotchas & Constraints, Decisions & Rationale, Assumptions, Questions & Unknowns, Reusable Solutions)
- Updated: Throughout all phases

REVIEW_FIX_REPORT_FILE: {REVIEW_DIR}/review-fix-report.md
- Comprehensive report documenting all fixes applied
- Used for: Recording what was changed and validation results
- Created: Phase 6
- Includes: Issues addressed, files modified, validation results, remaining issues

## Core Principles

- **Deep Understanding First**: Read and comprehend all review findings before planning
- **Prioritized Remediation**: Address issues in severity order (CRITICAL → HIGH → MEDIUM → LOW)
- **Knowledge Capture**: Update scratch-memory.md throughout with insights and patterns
- **Gap Identification**: Clarify ambiguous fixes before implementation
- **Systematic Execution**: Fix issues methodically with validation after each change
- **Comprehensive Reporting**: Document every fix and its outcome
- **Progress Tracking**: Use TodoWrite throughout for visibility

## Instructions

You are a senior software engineer tasked with remediating code review findings. Take this seriously - these issues were flagged for a reason. Think deeply about the best way to fix each issue while maintaining code quality and following best practices.

### Phase 1: Validation & Discovery

**Goal**: Validate inputs and understand the review structure

1. **Validate CODE_REVIEW_PATH**
   - Use Read tool to check if CODE_REVIEW_PATH exists and is readable
   - If file doesn't exist, report error:
     ```
     ❌ Error: Code review file not found

     Path: {CODE_REVIEW_PATH}

     Please provide a valid path to a code-review.md file.

     Usage: /review-fix <code-review-path>
     Example: /review-fix feats/delete-task/code-review.md
     ```
   - Exit gracefully if validation fails

2. **Derive REVIEW_DIR**
   - Extract directory path from CODE_REVIEW_PATH
   - Example: "feats/delete-task/code-review.md" → "feats/delete-task"
   - Set REVIEW_FIX_PLAN_FILE = {REVIEW_DIR}/review-fix-plan.md
   - Set SCRATCH_MEMORY_FILE = {REVIEW_DIR}/scratch-memory.md
   - Set REVIEW_FIX_REPORT_FILE = {REVIEW_DIR}/review-fix-report.md

3. **Check for Scratch Memory**
   - Use Read tool to check if SCRATCH_MEMORY_FILE exists
   - If it exists, note that it will be updated
   - If it doesn't exist, note that it will be created

4. **Create Initial Todo List**
   - Use TodoWrite to create comprehensive todo list:
     - Phase 1: Validation & Discovery (mark as in_progress)
     - Phase 2: Deep Analysis & Understanding
     - Phase 3: Remediation Planning
     - Phase 4: Gap Analysis & Clarification
     - Phase 5: Implementation Execution
     - Phase 6: Report Generation
     - Phase 7: Summary Display

5. **Report Phase 1 Completion**
   ```
   ## Phase 1 Complete: Validation & Discovery

   ✅ Code review file found: {CODE_REVIEW_PATH}
   📁 Review directory: {REVIEW_DIR}
   📝 Review fix plan will be saved to: {REVIEW_FIX_PLAN_FILE}
   🧠 Scratch memory: {EXISTS/WILL BE CREATED}

   Next: Phase 2 - Deep Analysis
   ```

6. **Mark Phase 1 as completed, Phase 2 as in_progress**

### Phase 2: Deep Analysis & Understanding

**Goal**: Read and deeply comprehend all code review findings

**ULTRATHINK Protocol:**

You must deeply understand what needs to be fixed before creating any plan. This is critical.

1. **Read Code Review File**
   - Use Read tool to read CODE_REVIEW_PATH completely
   - Absorb all sections:
     - Review Status (APPROVED/CHANGES REQUIRED)
     - Executive Summary (total issues by severity)
     - Critical Issues section
     - High Priority Issues section
     - Medium Priority Issues section
     - Low Priority Issues section
     - Security Analysis
     - Test Coverage Analysis
     - Best Practice Violations
     - Recommendations

2. **Parse and Structure Findings**

   For each issue found, extract:
   - **Severity**: CRITICAL, HIGH, MEDIUM, or LOW
   - **File**: Which file has the issue
   - **Line(s)**: Specific line numbers or ranges
   - **Issue Description**: What the problem is
   - **Risk/Impact**: Why this matters (for CRITICAL/HIGH)
   - **Recommendation**: How to fix it (often includes code examples)
   - **Reference**: Link to best practices documentation (if provided)

3. **Analyze Impact and Scope**

   Think deeply about:
   - How many files will need to be modified?
   - Are there dependencies between fixes? (e.g., creating a DTO is needed before using it)
   - Which fixes require new dependencies or libraries?
   - What is the order of implementation? (dependencies first, then usage)
   - Are there any fixes that conflict with each other?
   - What testing will be needed to validate fixes?

4. **Determine Fix Complexity**

   For each issue, assess:
   - **Simple**: Single-line change, straightforward fix
   - **Moderate**: Multiple lines, clear approach, some testing needed
   - **Complex**: Architectural change, multiple files, significant refactoring
   - **Research Needed**: Unclear how to implement, needs investigation

5. **Initialize or Update Scratch Memory**

   If SCRATCH_MEMORY_FILE doesn't exist, create it with structure:
   ```markdown
   # Scratch Memory: Code Review Remediation

   ## Domain Concepts
   <!-- Business logic, terminology, domain rules -->

   ## Technical Patterns
   <!-- Architectural patterns, code structures, validation approaches -->

   ## Integration Points
   <!-- How systems connect, dependencies, framework integration -->

   ## Gotchas & Constraints
   <!-- Limitations, things to watch out for, edge cases -->

   ## Decisions & Rationale
   <!-- Why fix choices were made, alternatives considered -->

   ## Assumptions
   <!-- Things assumed during remediation that need validation -->

   ## Questions & Unknowns
   <!-- Open items, areas needing future consideration -->

   ## Reusable Solutions
   <!-- Patterns/approaches applicable to other features -->
   ```

   Capture initial findings to scratch-memory.md:
   - **Technical Patterns**: Patterns mentioned in recommendations (e.g., "DTO validation pattern", "Exception filter pattern")
   - **Gotchas & Constraints**: Issues found (e.g., "Race condition in file operations", "Missing input validation")
   - **Decisions & Rationale**: Initial thoughts on fix approach
   - **Questions & Unknowns**: Areas where the fix approach isn't immediately clear

6. **Report Phase 2 Completion**
   ```
   ## Phase 2 Complete: Deep Analysis

   **Review Status**: {APPROVED/CHANGES REQUIRED}
   **Total Issues**: {count}
   - 🚨 Critical: {count}
   - ⚠️  High: {count}
   - ⚙️  Medium: {count}
   - ℹ️  Low: {count}

   **Files Affected**: {count} files
   {List affected files}

   **Fix Complexity Assessment**:
   - Simple fixes: {count}
   - Moderate fixes: {count}
   - Complex fixes: {count}
   - Research needed: {count}

   **Dependencies Identified**:
   {Any new libraries or dependencies needed}

   **Knowledge Captured to scratch-memory.md**:
   - Technical Patterns: {count} items
   - Gotchas & Constraints: {count} items
   - Questions & Unknowns: {count} items

   Next: Phase 3 - Remediation Planning
   ```

7. **Mark Phase 2 as completed, Phase 3 as in_progress**

### Phase 3: Remediation Planning

**Goal**: Create a detailed, actionable plan to fix all issues

1. **Organize Issues by Priority and Dependencies**

   Group issues for optimal implementation order:
   - **Critical Issues First**: Security vulnerabilities, data integrity issues
   - **Dependency Order**: Create DTOs before using them, add imports before usage
   - **File Grouping**: Group related changes to the same file
   - **Testing Last**: Test implementations come after the code they test

2. **Create Implementation Tasks**

   For each issue, define:
   - **Task ID**: Sequential number
   - **Issue Reference**: Which review finding this addresses
   - **Severity**: CRITICAL/HIGH/MEDIUM/LOW
   - **Action**: CREATE, MODIFY, ADD, DELETE, INSTALL (for dependencies)
   - **File**: Target file path
   - **Changes**: Specific code modifications needed
   - **Dependencies**: Other tasks that must complete first
   - **Validation**: How to verify the fix works

   Use code examples from the review recommendations when available.

3. **Generate REVIEW_FIX_PLAN_FILE**

   Use Write tool to create review-fix-plan.md:
   ```markdown
   # Review Fix Plan

   **Generated**: {timestamp}
   **Source Review**: {CODE_REVIEW_PATH}
   **Review Status**: {APPROVED/CHANGES REQUIRED}

   ---

   ## Executive Summary

   This plan addresses {total} issues identified in the code review:
   - 🚨 Critical: {count} issues
   - ⚠️  High: {count} issues
   - ⚙️  Medium: {count} issues
   - ℹ️  Low: {count} issues

   **Affected Files**: {count} files will be modified
   **New Dependencies**: {list if any, or "None"}
   **Estimated Complexity**: {Simple/Moderate/Complex/Mixed}

   **Implementation Strategy**:
   {Brief description of approach - e.g., "Address critical security issues first, then error handling improvements, then code quality enhancements"}

   ---

   ## Critical Issues (Must Fix Immediately)

   {If none: "None identified. ✅"}

   {For each critical issue:}
   ### Issue {N}: {Issue Title}
   **File**: {file path}
   **Line**: {line numbers}
   **Severity**: 🚨 CRITICAL
   **Risk**: {risk description from review}

   **Problem**:
   {Issue description}

   **Solution**:
   {Detailed fix description}

   **Code Changes**:
   ```{language}
   {Code example showing the fix}
   ```

   **Validation**:
   - {How to verify the fix}

   **Reference**: {Best practices doc reference if available}

   ---

   ## High Priority Issues (Fix Before Merge)

   {Same structure as Critical Issues}

   ---

   ## Medium Priority Issues (Address Soon)

   {Same structure, can be briefer}

   ---

   ## Low Priority Issues (Future Improvements)

   {Same structure, can be briefer}

   ---

   ## Implementation Tasks (Execution Order)

   **Todo Checklist**:
   - [ ] Task 1: {task name}
   - [ ] Task 2: {task name}
   - [ ] Task 3: {task name}
   {... all tasks}

   ---

   ### Task 1: {Task Name}

   **Addresses**: {Issue reference - e.g., "Critical Issue 1"}
   **Action**: {CREATE/MODIFY/ADD/DELETE/INSTALL}
   **File**: {file path}
   **Severity**: {CRITICAL/HIGH/MEDIUM/LOW}
   **Dependencies**: {List task IDs that must complete first, or "None"}

   **Changes**:
   {Detailed description of what to change}

   {If code example available:}
   ```{language}
   {Code showing before/after or new code to add}
   ```

   **Implementation Notes**:
   - {Any important details}
   - {Things to watch out for}

   **Validation**:
   ```bash
   {Command to run}
   # Expected: {expected outcome}
   ```

   ---

   {Repeat for all tasks}

   ---

   ## Dependencies to Install

   {If any new packages/libraries needed:}
   ```bash
   npm install {package-name}
   # Purpose: {why needed}
   ```

   {If none:}
   No new dependencies required. ✅

   ---

   ## Testing Strategy

   After implementing all fixes:

   1. **Build Validation**:
      ```bash
      npm run build
      # Expected: No errors
      ```

   2. **Type Checking** (if TypeScript):
      ```bash
      npm run typecheck
      # Expected: No type errors
      ```

   3. **Unit Tests** (if exist):
      ```bash
      npm test
      # Expected: All tests pass
      ```

   4. **Manual Testing**:
      - {Specific scenarios to test}
      - {Expected behaviors}

   ---

   ## Risk Assessment

   **High Risk Changes**:
   {Any changes that could break existing functionality}

   **Mitigation**:
   {How to minimize risk - testing, phased rollout, etc.}

   **Rollback Plan**:
   {How to undo changes if needed}

   ---

   ## Notes

   {Any additional context or considerations}
   ```

4. **Update Scratch Memory**

   Capture planning insights to scratch-memory.md:
   - **Decisions & Rationale**: Why certain fixes are prioritized
   - **Technical Patterns**: Patterns being applied (DTO validation, exception handling, etc.)
   - **Assumptions**: Assumptions made during planning
   - **Questions & Unknowns**: Anything unclear that might need clarification

5. **Present Plan to User**

   Display summary:
   ```
   ## Phase 3 Complete: Review Fix Planning

   📋 Review fix plan created: {REVIEW_FIX_PLAN_FILE}

   **Plan Summary**:
   - Total tasks: {count}
   - Critical fixes: {count}
   - High priority fixes: {count}
   - Medium priority fixes: {count}
   - Low priority fixes: {count}

   **Files to Modify**: {count}
   {List files}

   **New Dependencies**: {list or "None"}

   **Implementation Order**:
   1. {Brief description of task group 1}
   2. {Brief description of task group 2}
   3. {Brief description of task group 3}

   **Next Step**: Phase 4 - Gap Analysis & Clarification

   Review the plan at: {REVIEW_FIX_PLAN_FILE}

   Ready to proceed with gap analysis? (Will check for ambiguities before implementation)
   ```

6. **Wait for user approval before proceeding**
   - This is a checkpoint - user should review the plan
   - User can ask questions or request changes to the plan
   - Only proceed to Phase 4 after explicit approval

7. **Mark Phase 3 as completed, Phase 4 as in_progress**

### Phase 4: Gap Analysis & Clarification

**Goal**: Identify and resolve any ambiguities before implementation

1. **Analyze Plan for Gaps**

   Review REVIEW_FIX_PLAN_FILE for:

   **Implementation Gaps**:
   - Are all code examples complete and unambiguous?
   - Are file paths correct and clear?
   - Is it clear exactly where to add/modify code?
   - Are there multiple valid ways to implement a fix?

   **Technical Gaps**:
   - Are dependency versions specified? (if new packages needed)
   - Are import statements clear?
   - Are there framework-specific details missing?
   - Do we have all necessary context about existing code structure?

   **Validation Gaps**:
   - Is it clear how to test each fix?
   - Are validation commands complete and correct?
   - Do we know what "success" looks like?

   **Dependency Gaps**:
   - Are task dependencies correctly identified?
   - Is the implementation order optimal?
   - Could any fixes conflict with each other?

2. **Identify Files to Read**

   Determine which existing files need to be read to understand context:
   - Files that will be modified (to understand current structure)
   - Related files (to understand integration points)
   - Configuration files (to understand framework setup)

   Use Read tool to read these files and build context.

3. **Collect Ambiguities and Questions**

   If gaps are found, structure them into clear questions:
   - What is ambiguous?
   - Why does it matter?
   - What are the options?
   - What's the recommended approach?

4. **Interactive Clarification**

   If gaps/ambiguities exist:
   - Use AskUserQuestion to present up to 4 most critical questions
   - Structure questions clearly with context
   - Offer reasonable options based on best practices
   - Example format:
     ```
     Question: "Should we use UUID v4 or timestamp-based IDs?"
     Context: "The review recommends replacing Date.now() IDs. UUIDs are more robust but timestamps are simpler."
     Options:
     - uuid v4 (industry standard, no collisions) [Recommended]
     - nanoid (shorter, URL-friendly)
     - cuid (collision-resistant, sortable)
     ```

5. **Update Plan with Clarifications**

   If clarifications were obtained:
   - Use Edit tool to update REVIEW_FIX_PLAN_FILE
   - Add clarification details to relevant tasks
   - Update implementation notes
   - Adjust validation steps if needed

6. **Update Scratch Memory**

   Capture gap analysis insights:
   - **Decisions & Rationale**: Decisions made during clarification
   - **Assumptions**: Final assumptions after gap analysis
   - **Questions & Unknowns**: Move resolved questions out, add any new ones
   - **Gotchas & Constraints**: New constraints discovered while reading files

7. **Report Phase 4 Completion**

   If NO gaps found:
   ```
   ## Phase 4 Complete: Gap Analysis

   ✅ No significant gaps identified

   The plan is clear and ready for implementation. All tasks have:
   - Clear implementation details
   - Specific file paths and line numbers
   - Unambiguous code examples
   - Validation steps

   Next: Phase 5 - Implementation Execution
   ```

   If gaps WERE found and resolved:
   ```
   ## Phase 4 Complete: Gap Analysis

   **Gaps Identified**: {count}
   **Clarifications Obtained**: {count}
   **Plan Updated**: Yes

   **Resolutions**:
   1. {Gap 1} → {Resolution}
   2. {Gap 2} → {Resolution}

   **Knowledge Captured to scratch-memory.md**:
   - Decisions & Rationale: {count} items
   - Assumptions: {count} items updated

   The plan has been updated with all clarifications and is ready for implementation.

   Next: Phase 5 - Implementation Execution
   ```

8. **Mark Phase 4 as completed, Phase 5 as in_progress**

### Phase 5: Implementation Execution

**Goal**: Systematically implement all fixes from the remediation plan

**Task Execution Protocol**:

1. **Parse Review Fix Plan**

   Re-read REVIEW_FIX_PLAN_FILE and extract all tasks in order:
   - Task ID
   - Issue reference
   - Severity
   - Action (CREATE, MODIFY, ADD, DELETE, INSTALL)
   - File path
   - Changes description
   - Code examples
   - Dependencies (must complete first)
   - Validation steps

2. **Update Todo List with Individual Tasks**

   Use TodoWrite to break down Phase 5 into individual tasks:
   - Task 1: {task name} (CRITICAL)
   - Task 2: {task name} (CRITICAL)
   - Task 3: {task name} (HIGH)
   - {... all tasks from plan}
   - Run final validation suite

   Group by severity for clarity.

3. **Execute Each Task**

   For each task in order:

   **Pre-execution**:
   - Mark task as in_progress in TodoWrite
   - Verify dependencies are completed
   - Read target file if modifying existing code
   - Output: "Starting Task {N}: {task name} ({severity})"

   **Action Execution**:

   - **INSTALL**: Use Bash tool to install dependencies
     ```bash
     npm install {package-name}
     ```

   - **CREATE**: Use Write tool to create new file
     - Use full file content from remediation plan
     - Ensure directory exists

   - **MODIFY**: Use Edit tool to make changes
     - Find exact code to change (old_string)
     - Replace with fixed code (new_string)
     - Preserve formatting and indentation
     - If code examples show before/after, use them exactly

   - **ADD**: Use Edit tool to add new code
     - Find insertion point
     - Add new code at correct location
     - Preserve file structure

   - **DELETE**: Use Edit tool to remove code
     - Find exact code to remove
     - Delete it cleanly

   **Code Block Handling**:
   - Extract code from plan's code fences
   - Preserve language-specific syntax
   - Match indentation to existing code
   - Import statements go at top of file

   **Error Handling**:
   - **File Not Found**: Report clearly, verify path, suggest correction
   - **Edit Failed**: Show what was searched for vs what exists
   - **Install Failed**: Show error, suggest resolution
   - **Validation Failed**: Show command output, explain issue

   **Validation Execution**:
   - Run validation command from plan
   - Capture output
   - Check if it matches expected result
   - If validation fails:
     - Log failure with full output
     - Decide: Continue with warning or stop?
     - Default: Stop for build/syntax errors, warn for test failures

   **Post-execution**:
   - Mark task as completed in TodoWrite
   - Output: "Completed Task {N}: {summary of change}"
   - Update scratch memory with insights:
     - **Technical Patterns**: Patterns applied during fix
     - **Gotchas & Constraints**: Issues encountered
     - **Reusable Solutions**: Approaches that worked well
     - **Decisions & Rationale**: Why certain implementation choices were made

4. **Run Final Validation Suite**

   After all tasks complete:

   ```bash
   # Type checking (if TypeScript)
   npm run typecheck || tsc --noEmit

   # Build
   npm run build

   # Tests (if exist)
   npm test

   # Linting (if configured)
   npm run lint
   ```

   Capture all results for the report.

5. **Update Scratch Memory with Final Insights**

   After all implementation:
   - **Technical Patterns**: Final summary of patterns used
   - **Reusable Solutions**: Patterns applicable to future fixes
   - **Gotchas & Constraints**: Issues encountered during implementation
   - **Questions & Unknowns**: Anything that remains unclear

6. **Report Phase 5 Completion**

   ```
   ## Phase 5 Complete: Implementation Execution

   ✅ All tasks completed

   **Tasks Executed**: {total}
   - Critical issues fixed: {count}
   - High priority issues fixed: {count}
   - Medium priority issues fixed: {count}
   - Low priority issues fixed: {count}

   **Files Modified**: {count}
   {List files with brief description of changes}

   **Dependencies Installed**: {list or "None"}

   **Validation Results**:
   - Type checking: {PASS/FAIL}
   - Build: {PASS/FAIL}
   - Tests: {PASS/FAIL/SKIPPED}
   - Linting: {PASS/FAIL/SKIPPED}

   **Knowledge Captured to scratch-memory.md**:
   - Technical Patterns: {count} items
   - Reusable Solutions: {count} items
   - Gotchas & Constraints: {count} items

   Next: Phase 6 - Report Generation
   ```

7. **Mark Phase 5 as completed, Phase 6 as in_progress**

### Phase 6: Report Generation

**Goal**: Create comprehensive documentation of remediation work

1. **Collect Implementation Data**

   Gather from execution:
   - All tasks completed
   - Files created/modified/deleted
   - Dependencies installed
   - Validation results (pass/fail for each)
   - Issues encountered and how resolved
   - Any deviations from the plan

2. **Generate REVIEW_FIX_REPORT_FILE**

   Use Write tool to create review-fix-report.md:
   ```markdown
   # Review Fix Report

   **Generated**: {timestamp}
   **Source Review**: {CODE_REVIEW_PATH}
   **Remediation Plan**: {REVIEW_FIX_PLAN_FILE}
   **Status**: {✅ SUCCESS / ⚠️ PARTIAL / ❌ FAILED}

   ---

   ## Executive Summary

   Successfully addressed {completed} of {total} issues from the code review:
   - 🚨 Critical issues fixed: {count}/{total}
   - ⚠️  High priority issues fixed: {count}/{total}
   - ⚙️  Medium priority issues fixed: {count}/{total}
   - ℹ️  Low priority issues fixed: {count}/{total}

   **Files Changed**:
   - Created: {count} files
   - Modified: {count} files
   - Deleted: {count} files (if any)

   **Dependencies Added**: {list or "None"}

   **Validation Status**:
   - ✅ Type checking: {PASS/FAIL}
   - ✅ Build: {PASS/FAIL}
   - ✅ Tests: {PASS/FAIL/SKIPPED}
   - ✅ Linting: {PASS/FAIL/SKIPPED}

   ---

   ## Issues Addressed

   ### Critical Issues Fixed

   {For each critical issue fixed:}
   #### ✅ {Issue Title}
   **File**: {file path}
   **Original Issue**: {brief description}
   **Fix Applied**: {what was changed}
   **Validation**: {validation result}

   ---

   ### High Priority Issues Fixed

   {Same structure}

   ---

   ### Medium Priority Issues Fixed

   {Same structure}

   ---

   ### Low Priority Issues Fixed

   {Same structure}

   ---

   ## Files Modified

   ### Created Files

   {If any:}
   | File | Purpose | Lines | Status |
   |------|---------|-------|--------|
   | {path} | {purpose} | {count} | ✅ Success |

   {If none:}
   No new files created.

   ---

   ### Modified Files

   | File | Changes | Impact | Status |
   |------|---------|--------|--------|
   | {path} | {brief description} | {HIGH/MED/LOW} | ✅ Success |

   ---

   ### Deleted Files

   {If any, otherwise "None"}

   ---

   ## Task Execution Details

   | Task | Severity | Action | File | Status | Validation |
   |------|----------|--------|------|--------|------------|
   | Task 1 | CRITICAL | MODIFY | {file} | ✅ Success | ✅ Passed |
   | Task 2 | HIGH | CREATE | {file} | ✅ Success | ✅ Passed |
   {... all tasks}

   ---

   ## Validation Results

   ### Type Checking
   ```bash
   {command run}
   ```
   **Result**: {PASS/FAIL}
   {If failed, show relevant errors}

   ### Build
   ```bash
   {command run}
   ```
   **Result**: {PASS/FAIL}
   {If failed, show relevant errors}

   ### Tests
   ```bash
   {command run}
   ```
   **Result**: {PASS/FAIL/SKIPPED}
   **Tests Run**: {count if available}
   **Passed**: {count}
   **Failed**: {count}
   {If failed, show which tests}

   ### Linting
   ```bash
   {command run}
   ```
   **Result**: {PASS/FAIL/SKIPPED}
   {If failed, show relevant errors}

   ---

   ## Dependencies Installed

   {If any:}
   - `{package-name}` v{version} - {purpose}

   {If none:}
   No new dependencies required.

   ---

   ## Implementation Notes

   ### Challenges Encountered

   {If any issues during implementation:}
   1. **{Challenge}**: {Description}
      - **Resolution**: {How it was resolved}

   {If none:}
   No significant challenges encountered. Implementation went smoothly.

   ---

   ### Deviations from Plan

   {If any deviations:}
   1. **{What deviated}**:
      - **Planned**: {original approach}
      - **Actual**: {what was done}
      - **Reason**: {why deviation was necessary}
      - **Impact**: {assessment}

   {If none:}
   No deviations from the remediation plan. All fixes implemented as planned.

   ---

   ## Code Quality Assessment

   **Type Safety**: {assessment after fixes}
   **Error Handling**: {assessment after fixes}
   **Security**: {assessment after fixes}
   **Best Practices**: {assessment after fixes}
   **Test Coverage**: {assessment after fixes}

   ---

   ## Remaining Issues

   {If any issues NOT fixed:}
   ### {Severity}: {Issue Title}
   **Reason not fixed**: {why - e.g., "requires architectural change", "needs more research"}
   **Recommendation**: {what should be done}

   {If all fixed:}
   ✅ All identified issues have been successfully addressed!

   ---

   ## Recommendations

   ### Immediate Next Steps
   1. {What should be done next - e.g., manual testing, deploy to staging}
   2. {Any follow-up tasks}

   ### Future Enhancements
   1. {Potential improvements beyond the fixes}
   2. {Technical debt to address}

   ### Monitoring
   - {What to monitor after deployment}
   - {Metrics to track}

   ---

   ## Knowledge Captured

   Throughout this remediation, insights were captured to `scratch-memory.md`:
   - **Technical Patterns**: {count} patterns documented
   - **Reusable Solutions**: {count} reusable approaches identified
   - **Gotchas & Constraints**: {count} constraints documented
   - **Decisions & Rationale**: {count} decisions recorded

   These insights are available for future reference and can be triaged to the project knowledge base.

   ---

   ## Conclusion

   {Final assessment of the remediation work}

   **Overall Status**: {✅ SUCCESS / ⚠️ PARTIAL SUCCESS / ❌ FAILED}

   {If success:}
   All critical and high-priority issues have been successfully addressed. The codebase now meets quality standards and is ready for {next step}.

   {If partial:}
   Most issues addressed, but {count} issues remain. See "Remaining Issues" section for details and recommendations.

   {If failed:}
   Review fix encountered blocking issues. See "Challenges Encountered" for details and recovery steps.

   **Confidence Level**: {HIGH/MEDIUM/LOW} - {brief explanation}
   ```

3. **Report Phase 6 Completion**

   ```
   ## Phase 6 Complete: Report Generation

   📄 Review fix report created: {REVIEW_FIX_REPORT_FILE}

   **Report Summary**:
   - Status: {SUCCESS/PARTIAL/FAILED}
   - Issues fixed: {completed}/{total}
   - Files changed: {count}
   - All validations: {PASS/PARTIAL/FAIL}

   Next: Phase 7 - Summary Display
   ```

4. **Mark Phase 6 as completed, Phase 7 as in_progress**

### Phase 7: Summary Display

**Goal**: Display final summary to user in CLI

Generate formatted summary for terminal display:

**Success Case (All issues fixed, validations pass):**
```
╔════════════════════════════════════════════════════════════════╗
║             🎉 REMEDIATION COMPLETE - SUCCESS                 ║
╚════════════════════════════════════════════════════════════════╝

✅ All code review issues have been successfully addressed!

📊 Summary:
- Issues fixed: {total}
  🚨 Critical: {count}
  ⚠️  High: {count}
  ⚙️  Medium: {count}
  ℹ️  Low: {count}

📁 Files Changed: {count} total
- Created: {count}
- Modified: {count}

✅ Validation: All checks passed
- Type checking: ✅ PASS
- Build: ✅ PASS
- Tests: ✅ PASS
- Linting: ✅ PASS

📄 Generated Documents:
- Remediation Plan: {REVIEW_FIX_PLAN_FILE}
- Remediation Report: {REVIEW_FIX_REPORT_FILE}
- Scratch Memory: {SCRATCH_MEMORY_FILE} (updated)

🎯 Next Steps:
1. Review the remediation report for details
2. Perform manual testing to verify fixes
3. Run /review again to confirm all issues resolved
4. Commit changes with descriptive message

💡 Knowledge Captured:
- {count} technical patterns documented in scratch-memory.md
- {count} reusable solutions identified
- Ready for knowledge base triage

Ready for deployment! 🚀
```

**Partial Success Case (Some issues remain or validations fail):**
```
╔════════════════════════════════════════════════════════════════╗
║           ⚠️  REMEDIATION COMPLETE - PARTIAL SUCCESS          ║
╚════════════════════════════════════════════════════════════════╝

Most issues addressed, but some remain or validations need attention.

📊 Summary:
- Issues fixed: {completed}/{total}
  ✅ Critical: {fixed}/{total}
  ⚠️  High: {fixed}/{total}
  ⚙️  Medium: {fixed}/{total}
  ℹ️  Low: {fixed}/{total}

📁 Files Changed: {count}

⚠️  Validation: Some checks failed
- Type checking: {status}
- Build: {status}
- Tests: {status}
- Linting: {status}

📄 Generated Documents:
- Remediation Plan: {REVIEW_FIX_PLAN_FILE}
- Remediation Report: {REVIEW_FIX_REPORT_FILE}
- Scratch Memory: {SCRATCH_MEMORY_FILE}

⚠️  Remaining Issues:
{List issues that weren't fixed and why}

🎯 Next Steps:
1. Review remediation report for validation failures
2. Address remaining issues (see report for recommendations)
3. Re-run validations
4. Run /review again to verify fixes

Report location: {REVIEW_FIX_REPORT_FILE}
```

**Failure Case (Execution failed):**
```
╔════════════════════════════════════════════════════════════════╗
║              ❌ REVIEW FIX FAILED                             ║
╚════════════════════════════════════════════════════════════════╝

Review fix encountered blocking issues during execution.

Status: Failed at Task {N}: {task name}

Partial Progress:
- Issues fixed: {completed}/{total}
- Files changed: {count}

❌ Error Details:
{Error description}
{What was being attempted}

📄 Reports:
- Remediation Plan: {REVIEW_FIX_PLAN_FILE}
- Partial Report: {REVIEW_FIX_REPORT_FILE}

🔧 Recovery Steps:
1. Review error details in review fix report
2. {Specific recovery step based on error}
3. {How to resume or retry}

Need help? Check the remediation report for detailed diagnostics.
```

**Mark Phase 7 as completed, all todos complete**

## Workflow Summary

1. **Phase 1: Validation** - Validate code review file exists, derive paths, create todo list
2. **Phase 2: Deep Analysis** - Read review, parse findings, analyze scope, initialize/update scratch-memory.md
3. **Phase 3: Planning** - Create review-fix-plan.md with tasks, **get user approval**
4. **Phase 4: Gap Analysis** - Identify ambiguities, clarify with user, update plan
5. **Phase 5: Execution** - Implement all fixes, validate each change, update scratch-memory.md
6. **Phase 6: Reporting** - Generate review-fix-report.md with all details
7. **Phase 7: Summary** - Display final status and next steps

## Error Handling

**Code review file not found:**
```
❌ Error: Code review file not found

Path: {CODE_REVIEW_PATH}

Please provide a valid path to a code-review.md file.

Usage: /review-fix <code-review-path>
Example: /review-fix feats/delete-task/code-review.md
```

**Invalid code review format:**
```
⚠️  Warning: Unexpected code review format

The file exists but may not be a valid code review. Proceeding anyway but results may be unpredictable.

Expected sections: Review Status, Critical Issues, High Priority Issues, etc.
```

**Validation failures:**
```
⚠️  Validation Failed: {validation type}

Command: {command run}
Output: {error output}

This doesn't block remediation but should be investigated.
Continuing with remaining tasks...
```

**Task execution failure:**
```
❌ Task Execution Failed: Task {N}

Error: {error description}

Options:
1. Skip this task and continue with others
2. Stop execution and review the issue
3. Retry the task

What would you like to do?
```

## Integration with Workflow

Standard workflow after code review:

```bash
# 1. Build feature
/feat-plan-build feats/add-authentication

# 2. Review code
/review feats/add-authentication
# Output: code-review.md with CHANGES REQUIRED

# 3. Fix review issues (NEW)
/review-fix feats/add-authentication/code-review.md
# Output: review-fix-plan.md, review-fix-report.md, updated scratch-memory.md

# 4. Review again
/review feats/add-authentication
# Output: APPROVED (hopefully!)

# 5. Commit and deploy
git add .
git commit -m "feat: add authentication (code review fixes applied)"
```

## Notes

- **User Approval Required**: After Phase 3 (Planning), user must approve before implementation begins
- **Scratch Memory Integration**: Continuously updates scratch-memory.md throughout all phases
- **Progressive**: Addresses issues in priority order (CRITICAL → HIGH → MEDIUM → LOW)
- **Validation-Focused**: Validates each fix as it's applied
- **Comprehensive Reporting**: Documents everything for audit trail
- **Knowledge Capture**: Insights captured to scratch-memory.md for future reference
- **Non-Destructive**: Can be run multiple times; subsequent runs update existing plans/reports
- **Flexible**: Handles partial completion gracefully
