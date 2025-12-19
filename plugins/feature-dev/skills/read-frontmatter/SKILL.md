---
name: read-frontmatter
description: Read frontmatter metadata from .ai-docs documents without loading full content. Use when asked to scan documents for topics, check what sections are available, find documents by keywords, or discover content overview. Triggers on phrases like "what topics are in", "scan the frontmatter", "what sections does it have", "check if it contains", "what's the metadata".
allowed-tools: Bash, Read
---

# Read Frontmatter Skill

Quickly extract frontmatter metadata from markdown documents in `.ai-docs/` without reading the full file content.

## When to Use This Skill

Use this skill when the user asks questions like:
- "Read the frontmatter of this document and tell me if it contains these topics"
- "What topics are covered in backend-best-practices.md?"
- "Scan the documents and tell me which ones mention authentication"
- "What sections are available in this document?"
- "Check if any documents contain information about caching"
- "What's the overview of technical-decisions.md?"

## How It Works

When invoked, you should:
1. Use the Bash tool to run the extract-frontmatter.js script
2. Parse the JSON output to understand document metadata
3. Answer the user's question based on the frontmatter data
4. Provide relevant section information with line numbers if needed

## What is Frontmatter?

Frontmatter is YAML metadata at the top of markdown files, enclosed between `---` markers:

```markdown
---
domain: backend
title: "Backend Architecture Patterns"
description: "Comprehensive guide..."
patterns:
  - microservices
  - event-driven
keywords:
  - backend
  - architecture
sections:
  - name: "Microservices Architecture"
    line_start: 45
    line_end: 120
    summary: "Decomposing monoliths..."
complexity: intermediate
line_count: 850
last_updated: 2025-01-15
related:
  - api-design-patterns.md
  - data-architecture-patterns.md
---

# Document content starts here...
```

## How It Works

The skill uses a helper script that:
1. Reads only the first ~100 lines of the document
2. Extracts content between the first `---` and second `---`
3. Parses the YAML metadata
4. Returns structured frontmatter without loading the full document

## Usage Instructions

### List Available Documents
```bash
node plugins/feature-dev/skills/shared/scripts/list-docs.js
```

### Read Frontmatter from a Specific Document
```bash
node plugins/feature-dev/skills/read-frontmatter/scripts/extract-frontmatter.js <filename> --json
```

### Read Frontmatter from All Documents
```bash
node plugins/feature-dev/skills/read-frontmatter/scripts/extract-frontmatter.js --all --json
```

## Example Conversational Usage

**User:** "Read the frontmatter of backend-best-practices.md and tell me if it contains topics about dependency injection"

**You should:**
1. Run: `node plugins/feature-dev/skills/read-frontmatter/scripts/extract-frontmatter.js backend-best-practices.md --json`
2. Parse the output to find the `patterns` and `keywords` fields
3. Check if "dependency-injection" or similar topics appear
4. Respond: "Yes, backend-best-practices.md contains dependency injection topics. The frontmatter shows it has sections on 'dependency-injection', 'constructor-injection-preferred', and 'dependency-inversion' at specific line ranges."

## Scripts

- `scripts/extract-frontmatter.js` - Extracts frontmatter from specified markdown file
- `../shared/scripts/list-docs.js` - Lists all available documents

## Output Format

```json
{
  "file": "backend-architecture-patterns.md",
  "frontmatter": {
    "domain": "backend",
    "title": "Backend Architecture Patterns",
    "sections": [
      {
        "name": "Microservices Architecture",
        "line_start": 45,
        "line_end": 120,
        "summary": "..."
      }
    ],
    "patterns": ["microservices", "event-driven"],
    "keywords": ["backend", "architecture"],
    "complexity": "intermediate",
    "line_count": 850
  }
}
```

## Performance Benefits

- Only reads first ~100 lines instead of entire document
- Fast metadata scanning across multiple documents
- Enables intelligent section targeting for full reads
- Reduces token usage in conversations
