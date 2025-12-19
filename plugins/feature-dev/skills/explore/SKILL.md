---
name: explore
description: Research architecture patterns, best practices, and project knowledge from .ai-docs. Use when asked about patterns, best practices, how to implement something, recommended approaches, handling failures, error handling strategies, or any architectural design questions. Triggers on phrases like "what pattern", "best practice for", "how should I", "recommend an approach", "how to handle".
allowed-tools: Read, Grep, Glob, Task
---

# Explore Skill

Research architecture patterns and best practices from the `.ai-docs/` knowledge base.

## When to Use

- Questions about architecture patterns
- Best practice recommendations
- "How should I implement X?"
- Comparing approaches
- Error/failure handling strategies

## Knowledge Base

Documentation files in `.ai-docs/`.

## Command

**`/research [topic]`** - Spawns an autonomous agent to research the topic

The command uses the Task tool to spawn a general-purpose agent that:
1. Scans `.ai-docs/` frontmatter to find relevant documents
2. Reads full sections for high-relevance matches
3. Synthesizes findings across all sources
4. Returns structured recommendations

## Core Principle: Progressive Disclosure

The research agent follows progressive disclosure:

1. **Scan frontmatter first** (lines 1-60) - get patterns, keywords, sections
2. **Score relevance** - match query against metadata
3. **Read only relevant sections** - use line ranges from frontmatter
4. **Synthesize and summarize** - don't return raw content

## Output Format

The agent returns structured findings:

```markdown
## Research Findings: [Topic]

### Summary
[2-3 sentence overview]

### Sources Consulted
- [doc.md] > [section] (relevance)

### Key Findings
[Synthesized insights from relevant sections]

### Recommendations
[Actionable guidance]

### Anti-Patterns to Avoid
[What not to do]

### Next Steps
[Commands for deeper exploration]
```

## Skill Files

| File | Purpose |
|------|---------|
| `WORKFLOWS.md` | Detailed scanning and retrieval procedures |
| `EXAMPLES.md` | Concrete research examples |
| `REFERENCE.md` | Frontmatter schema, scoring algorithm |
