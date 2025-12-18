---
Allowed-tools: comma separated list of allowed tools for this command
argument-hint: Array of hints in square brackets if arguments required, used for variables later
description: Describe in one sentence what this command does
---

# Purpose

Describe in succinct detail what the purpose of this slash command

E.G.
```
Create a detailed implementation plan based on the user's requirements provided through the USER_PROMPT variable. Analyze the request, think through the implementation approach, and save a comprehensive specification document to PLAN_OUTPUT_DIRECTORY/<name-of-plan>.md that can be used as a blueprint for actual development work.
```

## Variables
Detail variables which are required from the user input
Figure out if they are required or not. Required arguments come first. 
If there is a single argument it can be $ARGUMENTS
If there are many use positional arguments in order $1, $2 ... etc
If they are options provide default values. 
Provide bullet point of what the variable is and what it's used for
E.G.
```
USER_PROMPT: $1
- Prompt from user with details for this plan
- Used for: Understanding what the task is and what needs to be completed as well as success criteria
PLAN_OUTPUT_DIRECTORY: $2
- Path used to store the output of this command (defaults to `/plans`)
- Used for: detailing where to store the plan once command is complete
```

## Codebase Structure

Provide information about the codebase structure if relevant to the command

## Instructions

Provide detailed instructions for the task to be completed.
If it's complicated ensure that you think about and analyze the problem.

E.G.
```
- Carefully analyze the user's requirements provided in the USER_PROMPT variable
- If you need any clarifications use the AskUserTool and get this information from the user
- Think deeply (ultrathink) about the best approach to implement the requested functionality or solve the problem
- Create a concise implementation plan that includes:
    - Clear problem statement and objectives
    - Technical approach and architecture decisions
    - Step-by-step implementation guide
    - Potential challenges and solutions
    - Testing strategy
    - Success criteria
- Generate a descriptive, kebab-case filename based on the main topic of the plan
- Save the complete implementation plan to `PLAN_OUTPUT_DIRECTORY/<descriptive-name>.md`
- Ensure the plan is detailed enough that another developer could follow it to implement the solution
- Include code examples or pseudo-code where appropriate to clarify complex concepts
- Consider edge cases, error handling, and scalability concerns
- Structure the document with clear sections and proper markdown formatting
```


## Workflow
Provide a detailed step by step plan of what needs to be done to complete the command

E.G.
```
1. Analyze Requirements - THINK HARD and parse the USER_PROMPT to understand the core problem and desired outcome
2. Design Solution - Develop technical approach including architecture decisions and implementation strategy
3. Document Plan - Structure a comprehensive markdown document with problem statement, implementation steps, and testing approach
4. Generate Filename - Create a descriptive kebab-case filename based on the plan's main topic
5. Save & Report - Write the plan to `PLAN_OUTPUT_DIRECTORY/<filename>.md` and provide a summary of key components
```

## Report
Once the command is complete this is the result you MUST return. 
SOME examples of what it could be are:
- a single sentence
- a more complicated report with sections
- bullet points 
- template of JSON or YAML structure to return

E.G.
```
✅ Implementation Plan Created

File: PLAN_OUTPUT_DIRECTORY/<filename>.md
Topic: <brief description of what the plan covers>
Key Components:
- <main component 1>
- <main component 2>
- <main component 3>
```