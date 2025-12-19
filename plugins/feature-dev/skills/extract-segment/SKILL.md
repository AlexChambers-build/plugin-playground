---
name: extract-segment
description: Extract specific sections from .ai-docs documents using line numbers. Use when asked to read a specific section, get content from certain lines, extract a topic, or retrieve partial document content. Triggers on phrases like "read the section about", "extract lines", "get the content from", "show me the section on", "read the dependency injection section".
allowed-tools: Bash, Read
---

# Extract Segment Skill

Extract specific sections of markdown documents from `.ai-docs/` using line numbers and offsets.

## When to Use This Skill

Use this skill when the user asks questions like:
- "Read the section about dependency injection from backend-best-practices.md"
- "Extract the service layer best practices section"
- "Show me the content from lines 186 to 253"
- "Get the authentication section from the security document"
- "Read the microservices section with some context around it"
- "What does the testing section say?"

## How It Works

The skill uses line-based extraction to read only the needed portions of documents:

1. Frontmatter contains section line ranges (e.g., lines 45-120)
2. Use this skill to extract only those specific lines
3. Optionally add offset to expand context around the section
4. Returns only the requested segment

## How to Use This Skill

### Progressive Disclosure Workflow
1. First, use read-frontmatter skill to get section metadata
2. Identify the line numbers for the relevant section
3. Use this skill to extract only that section
4. Avoid reading entire documents unnecessarily

### Basic Usage
```bash
node plugins/feature-dev/skills/extract-segment/scripts/extract-segment.js <filename> <start-line> <end-line>
```

### With Context (offset)
```bash
node plugins/feature-dev/skills/extract-segment/scripts/extract-segment.js <filename> <start-line> <end-line> --offset 5
```

### JSON Output
```bash
node plugins/feature-dev/skills/extract-segment/scripts/extract-segment.js <filename> <start-line> <end-line> --json
```

## Example Conversational Usage

**User:** "Read the section about service layer best practices from backend-best-practices.md"

**You should:**
1. First use read-frontmatter: `node plugins/feature-dev/skills/read-frontmatter/scripts/extract-frontmatter.js backend-best-practices.md --json`
2. Find the section named "Service Layer Best Practices" in the frontmatter sections array
3. Note it's at lines 186-253
4. Extract that section: `node plugins/feature-dev/skills/extract-segment/scripts/extract-segment.js backend-best-practices.md 186 253`
5. Read and summarize the content for the user

**User:** "Show me the dependency injection section with some context"

**You should:**
1. Use read-frontmatter to find the "Dependency Injection" section line numbers
2. Extract with offset for context: `node plugins/feature-dev/skills/extract-segment/scripts/extract-segment.js backend-best-practices.md 151 185 --offset 5`
3. Present the content to the user

## Command Examples

### Extract Specific Section
```bash
# Extract lines 45-120 (Microservices section)
node extract-segment.js backend-architecture-patterns.md 45 120
```

### Extract with Context
```bash
# Extract lines 45-120 plus 5 lines of context on each side
node extract-segment.js backend-architecture-patterns.md 45 120 --offset 5
```

### Extract from Multiple Sections
```bash
# Extract introduction (lines 1-40)
node extract-segment.js patterns.md 1 40

# Extract specific pattern (lines 150-200)
node extract-segment.js patterns.md 150 200
```

## Output Format

```json
{
  "file": "backend-architecture-patterns.md",
  "start": 45,
  "end": 120,
  "offset": 0,
  "actualStart": 45,
  "actualEnd": 120,
  "lineCount": 76,
  "content": "## Microservices Architecture\n\nMicroservices..."
}
```

Or plain text output for direct reading.

## Performance Benefits

- Reads only requested line ranges, not full file
- Reduces token usage in conversations
- Enables targeted content retrieval
- Works with frontmatter metadata for smart section targeting
- Supports context expansion via offset parameter

## Script

`scripts/extract-segment.js` - Line-based document segment extraction
