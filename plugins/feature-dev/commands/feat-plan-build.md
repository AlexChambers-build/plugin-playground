---
Allowed-tools: Read, Write, Edit, TodoWrite, AskUserQuestion, Grep, Glob, Bash
argument-hint: "<feature-dir> [--verbose]"
description: "Implement features from specification directories with deep analysis, gap identification, and comprehensive execution"
---

# Purpose

Execute a complete feature implementation from specification files (plan.md, scratch-memory.md, tasks.md) with the persona of an experienced senior software engineer. This command performs deep analysis ("ULTRATHINK"), identifies gaps in requirements, executes all implementation tasks, and generates comprehensive development reports. It transforms detailed specifications into working code with full tracking and validation.

## Variables

FEATURE_DIR: $1
- The directory path containing feature specification files
- Used for: Locating plan.md, scratch-memory.md, and tasks.md
- Required: Yes
- Example: "feats/expand-todo-items" or "/absolute/path/to/feature"
- Validation: Must exist and contain required specification files

VERBOSE_FLAG: $2
- Optional flag to enable detailed output during execution
- Used for: Controlling output verbosity throughout all phases
- Values: "--verbose" or empty
- Default: Normal output (non-verbose)
- Affects: Gap analysis detail, task execution logging, validation output

PLAN_FILE: {FEATURE_DIR}/plan.md
- The feature plan document with requirements, design decisions, and architecture
- Used for: Understanding the feature's purpose and design
- Required: Yes
- Expected size: ~300-500 lines
- Sections: Executive summary, requirements, design decisions, architecture, testing strategy

SCRATCH_MEMORY_FILE: {FEATURE_DIR}/scratch-memory.md
- Knowledge capture document with domain concepts, patterns, and decisions
- Used for: Deep understanding of technical context and constraints
- Required: Yes
- Expected size: ~50-100 lines
- Sections: Domain concepts, technical patterns, integration points, gotchas, decisions

TASKS_FILE: {FEATURE_DIR}/tasks.md
- Detailed implementation tasks with code changes and validation steps
- Used for: Executing the actual implementation
- Required: Yes
- Format: Structured with Task sections, action keywords, file targets, code blocks
- Expected size: ~400-800 lines

GAP_ANALYSIS_FILE: {FEATURE_DIR}/gap-analysis.md
- Generated document capturing identified gaps and resolutions
- Used for: Recording what was unclear and how it was resolved
- Created: Phase 2 (if gaps are identified)
- Sections: Identified Gaps, Clarifications Needed, Assumptions Made, Resolutions

DEVELOPMENT_REPORT_FILE: {FEATURE_DIR}/development-report.md
- Comprehensive report of all changes made during implementation
- Used for: Documenting what was actually implemented and why
- Created: Phase 4
- Includes: File changes, rationale, validation results, deviations from plan

## Core Principles

- **Deep Analysis First**: "ULTRATHINK" about the feature before any implementation
- **Gap Identification**: Proactively identify missing information or ambiguities
- **Systematic Execution**: Follow tasks.md structure methodically
- **Continuous Validation**: Run validation steps after each task
- **Comprehensive Reporting**: Document every change and decision
- **Error Recovery**: Handle failures gracefully with clear reporting
- **Progress Tracking**: Use TodoWrite throughout for visibility

## Instructions

### Phase 1: Validation & Understanding

**ULTRATHINK Protocol:**
You are a senior software engineer who has been tasked with implementing this feature. Before you write any code, you need to deeply understand what you're building. Read the specification files and think through:

1. **Validate Directory Structure**
   - Verify FEATURE_DIR exists and is accessible
   - Use Read tool to check for required files: plan.md, scratch-memory.md, tasks.md
   - If any required file is missing, report clearly:
     ```
     Error: Missing required specification files

     Expected files in {FEATURE_DIR}:
     - plan.md: [FOUND/MISSING]
     - scratch-memory.md: [FOUND/MISSING]
     - tasks.md: [FOUND/MISSING]

     Please ensure all specification files exist before running this command.
     ```
   - Exit gracefully if validation fails

2. **Deep Reading & Analysis**

   Read plan.md and perform ULTRATHINK:
   ```
   CRITICAL: After reading plan.md, you must deeply contemplate this feature.

   Think about:
   - What is the core problem being solved?
   - What are the key requirements and constraints?
   - What design decisions were made and why?
   - What is the intended architecture?
   - What are the testing requirements?
   - What risks or concerns are mentioned?

   Consider the impacts:
   - How will this change affect existing functionality?
   - What are the performance implications?
   - Are there security considerations?
   - What about backward compatibility?
   - How will this be maintained long-term?
   ```

   Read scratch-memory.md and absorb:
   - Domain concepts and business rules
   - Technical patterns discovered in the codebase
   - Integration points identified
   - Gotchas and constraints noted
   - Decisions and their rationale
   - Assumptions that were made
   - Questions that remain open
   - Reusable solutions identified

3. **Feature Impact Evaluation**

   Based on your deep analysis, evaluate:

   **Complexity Level:**
   - Simple: Single component, straightforward logic
   - Moderate: Multiple components, some complexity
   - Complex: Significant architecture changes, multiple systems
   - Critical: Core system modifications, high risk

   **Risk Level:**
   - Low: Well-understood changes, minimal side effects
   - Medium: Some unknowns, moderate side effects possible
   - High: Many unknowns, significant potential for issues

   **Estimated Effort:**
   - Quick: <1 hour
   - Standard: 1-4 hours
   - Extended: 4-8 hours
   - Multi-day: >8 hours

   **Confidence Level:**
   - High: Clear path forward, all requirements understood
   - Medium: Some unknowns but manageable
   - Low: Many gaps, significant clarification needed

4. **Initial Todo List Creation**

   Use TodoWrite to create a comprehensive todo list with:
   - Phase 1: Validation & Understanding (mark as completed)
   - Phase 2: Gap Analysis
   - Phase 3: Task Execution (break down into individual tasks from tasks.md)
   - Phase 4: Development Report
   - Phase 5: Summary Display

### Phase 2: Gap Analysis

**Gap Identification Protocol:**

1. **Requirement Gaps**

   Analyze plan.md and tasks.md for:
   - Underspecified behaviors (e.g., "add validation" without specifying what to validate)
   - Missing edge case handling (e.g., what happens when X is null/empty/invalid?)
   - Unclear validation criteria (e.g., "ensure it works" without specific tests)
   - Ambiguous implementation details (e.g., "improve the UI" without specifics)
   - Missing error handling specifications

2. **Technical Gaps**

   Identify technical uncertainties:
   - Missing API specifications (endpoints, request/response formats)
   - Unclear data formats (JSON structure, field types, validation rules)
   - Unspecified integration points (how does this connect to other systems?)
   - Missing dependency information (libraries, versions, configurations)
   - Unclear performance requirements (response times, throughput, scalability)

3. **Implementation Gaps**

   Review tasks.md for:
   - Tasks with insufficient detail (e.g., "modify the component" without showing what to change)
   - Missing code context (before/after snippets are unclear or incomplete)
   - Validation steps that are ambiguous (e.g., "test it" without specific test cases)
   - Dependencies between tasks not specified (task order, prerequisites)
   - Missing file paths or incorrect paths

4. **Interactive Clarification**

   If gaps are identified:
   - Collect all gaps into a structured list
   - Use AskUserQuestion to present all gaps at once (up to 4 most critical gaps)
   - Structure questions clearly with context about why clarification is needed
   - Offer reasonable default assumptions as options
   - Document all responses for inclusion in gap-analysis.md

   Example question format:
   ```
   Question: "How should the modal close behavior work?"
   Context: "The plan mentions adding a modal but doesn't specify close behavior"
   Options:
   - Click outside to close (common pattern)
   - Explicit close button only (more controlled)
   - Both methods available (maximum flexibility)
   ```

5. **Gap Analysis Documentation**

   If any gaps were identified, create gap-analysis.md with this structure:
   ```markdown
   # Gap Analysis Report

   Generated: {current date/time}
   Feature: {feature name from plan.md}

   ## Executive Summary

   - Total gaps identified: {count}
   - Requirement gaps: {count}
   - Technical gaps: {count}
   - Implementation gaps: {count}
   - Clarifications obtained: {count}
   - Assumptions made: {count}

   ## Identified Gaps

   ### Requirement Gaps

   #### Gap 1: {title}
   - **Context**: {where this gap was found}
   - **Issue**: {what is unclear or missing}
   - **Impact**: {why this matters}
   - **Resolution**: {how it was resolved}

   ### Technical Gaps

   [Same structure as above]

   ### Implementation Gaps

   [Same structure as above]

   ## Assumptions Made

   1. {assumption}: {rationale for making this assumption}
   2. ...

   ## Resolutions Applied

   1. {what was changed in understanding or approach}
   2. ...
   ```

6. **Task List Updates**

   If gaps revealed:
   - Additional tasks needed
   - Changes to task order
   - New validation steps required

   Update the TodoWrite list to reflect these changes

### Phase 3: Task Execution

**Task Parsing & Execution Protocol:**

1. **Parse tasks.md Structure**

   Read tasks.md and identify:
   - **Todo Checklist**: High-level task list at the top (typically with checkboxes)
   - **Individual Task Sections**: Sections labeled "Task 1", "Task 2", etc.
   - **Task Components**: Each task should have:
     - **Action**: MODIFY, CREATE, ADD, DELETE, RENAME, MOVE, REPLACE, MIRROR, or COPY
     - **File**: Specific file path to be changed
     - **Changes**: Detailed description with code blocks showing before/after
     - **Implementation Notes**: Key technical details
     - **Validation**: Specific commands and expected results

   Example task structure:
   ```markdown
   ## Task 1: Add Description Field to Todo Model

   **Action**: MODIFY
   **File**: src/models/todo.ts

   **Changes**:
   Add description field to Todo interface:

   ```typescript
   interface Todo {
     id: string;
     title: string;
     description: string;  // NEW: Add this field
     completed: boolean;
   }
   ```

   **Implementation Notes**:
   - Description is optional (can be empty string)
   - Should be stored in database

   **Validation**:
   ```bash
   npm run typecheck
   # Expected: No type errors
   ```
   ```

2. **Task Execution Engine**

   For each task identified:

   **Pre-execution:**
   - Mark task as in_progress in TodoWrite
   - Verify the target file exists (for MODIFY/DELETE) or parent directory exists (for CREATE)
   - Read current file contents if modifying
   - If VERBOSE_FLAG is set, output: "Starting Task {N}: {task title}"

   **Action Execution:**

   - **CREATE**: Use Write tool to create new file with provided content
   - **MODIFY**: Use Edit tool to make precise changes
     - Parse code blocks to find exact "before" and "after" code
     - Apply changes preserving formatting and indentation
     - If before/after blocks are provided, use them exactly
   - **ADD**: Similar to MODIFY, but appending new code
   - **DELETE**: Use Edit tool to remove specified code sections
   - **RENAME**: Read file, Write to new location, use Bash to remove old file
   - **MOVE**: Similar to RENAME
   - **REPLACE**: Use Edit tool with replace_all=true for systematic replacements
   - **MIRROR**: Copy file contents to new location
   - **COPY**: Same as MIRROR

   **Code Block Handling:**
   - Look for code fence markers (```)
   - Extract language identifier
   - Parse before/after sections if present
   - Apply changes exactly as specified
   - Preserve indentation and formatting

   **Validation Execution:**
   - Run each validation command specified in the task
   - Capture output and check against expected results
   - If validation fails:
     - Log the failure with full output
     - If VERBOSE_FLAG is set, display detailed error information
     - Decide: Continue with warning or stop execution?
     - Default: Continue for test failures, stop for build/syntax errors

   **Error Handling:**
   - **File Not Found**: Report clearly, check if path is correct, suggest alternatives
   - **Edit Failed**: Show what was searched for, what was found, suggest manual edit
   - **Validation Failed**: Show command output, explain expected vs actual
   - **Tool Error**: Report tool error message, suggest recovery steps

   **Post-execution:**
   - Mark task as completed in TodoWrite
   - If VERBOSE_FLAG is set, output: "Completed Task {N}: {summary of changes}"
   - Record task completion details for development report

3. **Progress Reporting**

   Throughout execution:
   - Update TodoWrite status continuously
   - Keep one task in_progress at a time
   - Mark completed immediately after finishing
   - If VERBOSE_FLAG is set:
     - Show detailed output for each step
     - Display validation command output
     - Show file paths being modified
     - Display success/failure indicators for each action

### Phase 4: Development Report Generation

**Report Generation Protocol:**

Generate comprehensive development-report.md with the following structure:

```markdown
# Development Report

**Feature**: {feature name from plan.md}
**Generated**: {current date/time}
**Status**: {Success/Partial Success/Failed}

## Executive Summary

Brief overview of what was implemented:
- Tasks completed: {X} of {Y}
- Files created: {count}
- Files modified: {count}
- Files deleted: {count}
- Validations passed: {X} of {Y}
- Total time: {if trackable}

Key outcomes:
- {bullet point summary of main achievements}
- {any significant challenges overcome}
- {overall assessment}

## Implementation Details

### Files Created

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| {path} | {one-sentence description} | {count} | ✅ Success |

### Files Modified

| File | Changes | Impact | Status |
|------|---------|--------|--------|
| {path} | {brief description} | {High/Med/Low} | ✅ Success |

### Files Deleted

| File | Reason | Status |
|------|--------|--------|
| {path} | {why deleted} | ✅ Success |

## Task Execution Summary

| Task | Action | File | Status | Validation |
|------|--------|------|--------|------------|
| Task 1 | MODIFY | src/file.ts | ✅ Success | ✅ Passed |
| Task 2 | CREATE | src/new.ts | ✅ Success | ⚠️  Warning |

## Validation Results

### Successful Validations
- {command}: {brief result description}

### Failed Validations
- {command}: {error message and explanation}

### Warnings
- {description of any warnings encountered}

## Deviations from Plan

{If any deviations occurred}

### Deviation 1: {title}
- **Planned**: {what the plan specified}
- **Actual**: {what was actually done}
- **Reason**: {why the deviation was necessary}
- **Impact**: {assessment of the change}

## Issues Encountered

{If any issues occurred}

### Issue 1: {title}
- **Problem**: {description of the issue}
- **Context**: {when/where it occurred}
- **Resolution**: {how it was resolved}
- **Lesson**: {what was learned}

## Code Quality

- **Type Safety**: {assessment}
- **Test Coverage**: {if applicable}
- **Documentation**: {state of code comments/docs}
- **Best Practices**: {adherence to coding standards}

## Recommendations

### Immediate Next Steps
1. {what should be done next}
2. {any follow-up tasks}

### Future Enhancements
1. {potential improvements}
2. {technical debt to address}

### Testing Recommendations
1. {additional testing suggested}
2. {edge cases to verify}

## Conclusion

{Final assessment of the implementation, confidence level, and any caveats}
```

**Report Generation Guidelines:**
- Be honest and accurate about successes and failures
- Provide specific details, not generic statements
- Include actionable recommendations
- Highlight any risks or concerns
- Assess code quality objectively
- Document all deviations with clear rationale

**Optional Code Review:**

After generating the development report, you can perform a comprehensive code review using the `/review` command:

```bash
/review {FEATURE_DIR}
```

This will spawn a code-reviewer agent that analyzes all changes for:
- **Code Quality**: Complexity, maintainability, organization, naming conventions
- **Security Vulnerabilities**: SQL injection, XSS, command injection, hardcoded secrets, missing authentication
- **Test Coverage**: Missing tests, test quality, convention adherence
- **Best Practice Violations**: Compares code against patterns in .ai-docs knowledge base

The review generates a `code-review.md` report with severity-based findings (CRITICAL/HIGH/MEDIUM/LOW) and actionable recommendations. This is a non-blocking "Warn & Continue" mode that provides guidance without failing the build.

### Phase 5: Summary Display

**CLI Output Protocol:**

Generate a summary table for CLI display. Format depends on VERBOSE_FLAG:

**Normal Mode (default):**
```
Feature Implementation Complete

Status: ✅ Success (or ⚠️  Partial Success / ❌ Failed)

Summary:
- Tasks: {X}/{Y} completed
- Files: {created} created, {modified} modified, {deleted} deleted
- Validations: {X}/{Y} passed

Key Changes:
• {file1}: {one-sentence description}
• {file2}: {one-sentence description}
• {file3}: {one-sentence description}

Reports Generated:
- development-report.md
- gap-analysis.md (if created)

Next Steps:
1. Review development-report.md for details
2. Run tests to verify functionality
3. {any specific next step from plan}
```

**Verbose Mode (--verbose flag set):**
```
╔════════════════════════════════════════════════════════════════╗
║              FEATURE IMPLEMENTATION COMPLETE                   ║
╠════════════════════════════════════════════════════════════════╣
║ Feature: {feature name}                                        ║
║ Status: ✅ Completed Successfully                              ║
║ Duration: {if trackable}                                       ║
╚════════════════════════════════════════════════════════════════╝

📊 Implementation Summary
├─ Tasks Completed: {X}/{Y} ({percentage}%)
├─ Files Changed: {total} total
│  ├─ Created: {count} files
│  ├─ Modified: {count} files
│  └─ Deleted: {count} files
└─ Validations: {X}/{Y} passed ({percentage}%)

📁 Detailed File Changes
┌────────────────────────────────┬──────────┬─────────┬────────────┐
│ File                           │ Action   │ Changes │ Status     │
├────────────────────────────────┼──────────┼─────────┼────────────┤
│ {path}                         │ CREATE   │ +150    │ ✅ Success │
│ {path}                         │ MODIFY   │ +45 -12 │ ✅ Success │
│ {path}                         │ DELETE   │ -200    │ ✅ Success │
└────────────────────────────────┴──────────┴─────────┴────────────┘

✅ Successful Validations
• {validation 1}: {result}
• {validation 2}: {result}

⚠️  Warnings
• {warning 1 if any}

📄 Generated Reports
• development-report.md - Comprehensive implementation documentation
• gap-analysis.md - Gap identification and resolution {if created}

🎯 Next Steps
1. Review {file} for {reason}
2. Test {functionality}
3. {additional step}

💡 Recommendations
• {recommendation 1}
• {recommendation 2}
```

**Error/Failure Output:**
```
❌ Feature Implementation Failed

Status: Failed at Phase {N}: {phase name}
Completed: {X}/{Y} tasks before failure

Error Details:
- {error description}
- {context about what was being attempted}
- {partial progress made}

Recovery Steps:
1. {what to check}
2. {how to fix}
3. {how to resume}

Partial Progress:
• {what was completed successfully}

Tips:
• {helpful suggestion}
```

## Workflow

1. **Initialize** - Validate feature directory, create todo list with all phases
2. **Phase 1: Validation & Understanding** - Read all specification files, perform ULTRATHINK analysis, evaluate feature impact
3. **Phase 2: Gap Analysis** - Identify gaps in requirements/technical/implementation, clarify with user via AskUserQuestion, document in gap-analysis.md, update task list if needed
4. **Phase 3: Task Execution** - Parse tasks.md structure, execute each task (CREATE/MODIFY/DELETE/etc), run validations, track progress with TodoWrite
5. **Phase 4: Development Report** - Generate comprehensive development-report.md with all implementation details, deviations, and recommendations
6. **Phase 5: Summary Display** - Show CLI summary in appropriate format (verbose or normal) with key metrics and next steps

## Report

**Success Format:**
```
✅ Feature Implementation Completed Successfully

Summary:
- All {Y} tasks completed
- {total} files changed ({created} created, {modified} modified, {deleted} deleted)
- {X}/{Y} validations passed
- 2 reports generated

The feature has been fully implemented according to specifications.

Review development-report.md for comprehensive details.

Next: Run tests and verify functionality.
```

**Partial Success Format:**
```
⚠️  Feature Implementation Partially Completed

Summary:
- {X}/{Y} tasks completed
- {total} files changed
- {X}/{Y} validations passed
- Some issues encountered

Review development-report.md for details on issues and partial progress.

Next: Address issues listed in the report and complete remaining tasks.
```

**Failure Format:**
```
❌ Feature Implementation Failed

Failed at: Phase {N}: {phase name}
Reason: {error description}

Partial Progress:
- {X} tasks completed before failure
- {files changed}

Recovery:
1. {recovery step 1}
2. {recovery step 2}

Review development-report.md for details on what was completed before failure.
```
