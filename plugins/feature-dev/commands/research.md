---
description: Research any topic using the explorer agent. Spawns an autonomous agent to search the .ai-docs knowledge base, read relevant sections, and return synthesized findings.
arguments:
  - name: topic
    description: The topic, problem, or question to research
    required: true
---

# Research: $ARGUMENTS

Spawn the **explorer agent** to research this topic autonomously.

## Instructions

Use the Task tool to spawn the explorer agent:

```
Tool: Task
subagent_type: general-purpose
model: sonnet
prompt: |
  Research this topic: "$ARGUMENTS"

  Follow the instructions in .claude/agents/explorer.md
```

## What Happens

The explorer agent will:
1. Spawn a **doc-scanner** agent to find relevant documents
2. Spawn **content-retriever** agents to read high-relevance sections
3. Synthesize findings and return recommendations

This hierarchical approach keeps each agent's context small and focused.
