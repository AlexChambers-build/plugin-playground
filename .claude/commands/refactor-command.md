---
Allowed-tools: Read, Write, AskUserQuestion, Grep, Glob
argument-hint: [command-name] [refactor-description]
description: Refactors an existing slash command by analyzing requirements, suggesting multiple options, and implementing approved changes
---

# Purpose

Refactor an existing slash command in `.claude/commands/` by analyzing the requested changes, determining if functionality is being added or removed, asking clarifying questions to understand context, presenting multiple refactoring options for the user to choose from, and implementing the approved changes. This command ensures thoughtful refactoring with user involvement at every decision point.

## Variables

COMMAND_NAME: $1
- The name of the command to refactor (without the leading slash)
- Used for: Locating the command file at `.claude/commands/COMMAND_NAME.md`
- Required: Yes

REFACTOR_DESCRIPTION: $2
- Description of what needs to be changed/refactored
- Used for: Understanding the scope and nature of the refactor
- Required: Yes

REFACTOR_REASON: (gathered via AskUserQuestion)
- Why this refactor is being done (context and motivation)
- Used for: Making informed decisions about the best approach

REFACTOR_TYPE: (determined by analysis)
- Whether this is adding functionality, removing functionality, or restructuring
- Used for: Tailoring the refactoring approach

SELECTED_OPTION: (gathered via AskUserQuestion)
- Which refactoring option the user selects from multiple suggestions
- Used for: Implementing the approved changes

## Codebase Structure

Commands are stored in `.claude/commands/` directory with `.md` extension. The refactor-command will:
1. Read the existing command file
2. Analyze its current structure (frontmatter, Purpose, Variables, Instructions, Workflow, Report)
3. Suggest modifications while preserving the CommandTemplate.md pattern
4. Write the updated command back to the same location

## Instructions

- Validate that COMMAND_NAME is provided and the command file exists at `.claude/commands/COMMAND_NAME.md`
- If the command doesn't exist, inform the user and offer to create it instead using /create-meta-command
- Read the existing command file to understand its current implementation
- Analyze REFACTOR_DESCRIPTION to determine the scope of changes:
  - Is functionality being added? (new arguments, new tools, new steps)
  - Is functionality being removed? (removing arguments, simplifying workflow)
  - Is it a restructure? (reorganizing without adding/removing features)
- Use AskUserQuestion to gather context about WHY this refactor is needed:
  - What problem does it solve?
  - What's not working with the current implementation?
  - What's the desired outcome?
  - Are there any constraints or requirements to consider?
- Based on the analysis and context, generate 2-4 different refactoring options
- Each option should have:
  - Clear description of the approach
  - Pros and cons
  - What sections will be modified
  - Level of impact (minor, moderate, major)
- Present options to user using AskUserQuestion with multiSelect: false
- Once user selects an option, show a detailed preview of the changes:
  - Which sections will be modified
  - Key changes to content
  - Any new sections being added or removed
- Use AskUserQuestion to get final confirmation before making changes
- Apply the approved changes to the command file
- Ensure the refactored command maintains proper markdown formatting and CommandTemplate.md structure
- Preserve any custom content that isn't being modified
- Validate that all required sections are present after refactoring

## Workflow

1. Validate & Read - Check that COMMAND_NAME exists, read the current command file from `.claude/commands/COMMAND_NAME.md`
2. Analyze Request - Parse REFACTOR_DESCRIPTION and analyze the existing command to determine:
   - Refactor type (add/remove/restructure)
   - Which sections will be affected
   - Complexity of the changes
3. Gather Context - Use AskUserQuestion to understand:
   - Why is this refactor needed?
   - What problems exist with current implementation?
   - What is the desired outcome?
   - Any constraints or requirements?
4. Generate Options - Create 2-4 different refactoring approaches, each with:
   - Clear description of the approach
   - Pros and cons
   - Sections that will be modified
   - Impact level (minor/moderate/major)
5. Present Options - Use AskUserQuestion to present options and let user select one
6. Preview Changes - Show detailed preview of what will change:
   - Modified sections
   - Key content changes
   - New/removed sections
7. Get Confirmation - Use AskUserQuestion to get final approval before making changes
8. Apply Changes - Implement the approved refactoring, maintaining CommandTemplate.md structure
9. Validate - Ensure all required sections are present and properly formatted
10. Report - Provide summary of changes made with before/after comparison

## Report

```
✅ Command Refactored Successfully

File: .claude/commands/COMMAND_NAME.md
Refactor Type: [Adding Functionality | Removing Functionality | Restructuring]
Selected Approach: [Name/description of chosen option]

Changes Applied:
- [Section 1]: [Brief description of changes]
- [Section 2]: [Brief description of changes]
- [Section 3]: [Brief description of changes]

Impact Summary:
- Frontmatter: [Changed | Unchanged]
- Purpose: [Changed | Unchanged]
- Variables: [Added X | Removed Y | Unchanged]
- Instructions: [Enhanced | Simplified | Restructured | Unchanged]
- Workflow: [Expanded | Streamlined | Reorganized | Unchanged]
- Report: [Updated | Unchanged]

The refactored command is ready to use. Type `/COMMAND_NAME` to test it.

Key Improvements:
- [Main benefit 1]
- [Main benefit 2]
- [Main benefit 3]
```
