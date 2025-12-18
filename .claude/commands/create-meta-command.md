---
Allowed-tools: Read, Write, AskUserQuestion
argument-hint: [command-name] [description]
description: Generates a new slash command file following the CommandTemplate.md pattern
---

# Purpose

Create a new slash command file in `.claude/commands/` with intelligent, complete content based on user specifications. This meta-command analyzes the user's requirements and generates a fully-structured command following the CommandTemplate.md pattern with suggested variables, instructions, workflow, and report sections.

## Variables

COMMAND_NAME: $1
- The name of the command to create (without the leading slash)
- Used for: Creating the filename and identifying the command
- Required: Yes

COMMAND_DESCRIPTION: $2
- Brief description of what the command does
- Used for: Generating the frontmatter description and expanding into detailed sections
- Required: Yes

COMMAND_ARGUMENTS: (gathered via AskUserQuestion)
- List of arguments the command should accept
- Used for: Defining the argument-hint in frontmatter and Variables section

ALLOWED_TOOLS: (gathered via AskUserQuestion)
- Comma-separated list of tools this command needs
- Used for: Setting the Allowed-tools frontmatter field

## Codebase Structure

Commands are stored in `.claude/commands/` directory with `.md` extension. Each command file contains:
- YAML frontmatter with metadata
- Purpose section explaining the command
- Variables section defining arguments
- Instructions section with detailed implementation steps
- Workflow section with numbered steps
- Report section defining the output format

## Instructions

- Validate that COMMAND_NAME is provided and is a valid command name (alphanumeric, hyphens allowed)
- Ensure COMMAND_DESCRIPTION provides enough context to generate a complete command
- Fetch the latest slash command documentation from https://code.claude.com/docs/en/slash-commands to ensure generated commands follow current best practices
- Use AskUserQuestion to gather additional specifications:
  - What arguments/variables does the command need?
  - What tools should the command have access to?
  - Are there any specific workflow steps or requirements?
- Analyze the description and specifications to intelligently generate:
  - A clear Purpose section that expands on the description
  - A detailed Variables section with proper argument mapping ($1, $2, $ARGUMENTS, etc.)
  - Comprehensive Instructions that break down the implementation
  - A logical Workflow with numbered steps
  - An appropriate Report format (simple or structured based on command complexity)
- Ensure proper markdown formatting and clear section structure
- Consider the command's complexity and tailor the detail level appropriately
- Include relevant examples in the template where helpful
- Create the file at `.claude/commands/COMMAND_NAME.md`

## Workflow

1. Validate Input - Ensure COMMAND_NAME and COMMAND_DESCRIPTION are provided and valid
2. Review Documentation - Fetch best practices from https://code.claude.com/docs/en/slash-commands using WebFetch and extract key guidelines for command structure, frontmatter fields, variable naming, workflow patterns, and formatting standards to inform command generation
3. Gather Specifications - Use AskUserQuestion to collect additional details about arguments, tools, and workflow requirements
4. Analyze Requirements - Parse the description and specifications to understand the command's purpose, complexity, and needs
5. Generate Sections - Create each section of the template:
   - Frontmatter with Allowed-tools, argument-hint, and description
   - Purpose section with expanded explanation
   - Variables section with clear argument definitions
   - Instructions section with implementation guidance
   - Workflow section with step-by-step process
   - Report section with output format
6. Create File - Write the complete command to `.claude/commands/COMMAND_NAME.md`
7. Report Success - Confirm creation with file path and brief summary

## Report

```
✅ Command Created Successfully

File: .claude/commands/COMMAND_NAME.md
Command: /COMMAND_NAME
Arguments: [list of arguments if any]

The command is ready to use. Type `/COMMAND_NAME` to see it in action.

Summary:
- Purpose: [one-line summary]
- Key features: [2-3 bullet points about what makes this command useful]
```
