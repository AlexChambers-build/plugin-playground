# Knowledge Base Skills

Skills and utilities for efficiently working with markdown documentation in `.ai-docs/`.

## Overview

This collection of skills enables **progressive disclosure** of documentation content, minimizing token usage while maximizing information retrieval accuracy.

### Progressive Disclosure Pattern

```
1. DISCOVER  → list-docs.js          → Find all available documents
2. SCAN      → read-frontmatter      → Read metadata only (fast, low tokens)
3. SCORE     → (in agent code)       → Rank relevance to query
4. RETRIEVE  → extract-segment       → Read only relevant sections
5. SYNTHESIZE → (in agent code)      → Combine and return findings
```

## Skills

### 1. shared/scripts/

**Location:** `plugins/feature-dev/skills/shared/scripts/`

Common utilities shared across skills.

- **list-docs.js** - Discover all markdown files in `.ai-docs/`

```bash
node shared/scripts/list-docs.js              # List all documents
node shared/scripts/list-docs.js --json       # JSON output
```

### 2. read-frontmatter

**Location:** `plugins/feature-dev/skills/read-frontmatter/`

Read YAML frontmatter metadata from documents without loading full content.

**Purpose:**
- Fast document scanning
- Metadata extraction (domain, keywords, patterns)
- Section discovery with line numbers
- Relevance scoring

**Scripts:**
- `extract-frontmatter.js` - Extract and parse frontmatter

**Usage:**
```bash
# Extract frontmatter from one document
node read-frontmatter/scripts/extract-frontmatter.js backend-patterns.md

# Extract from all documents
node read-frontmatter/scripts/extract-frontmatter.js --all --json

# Get raw YAML
node read-frontmatter/scripts/extract-frontmatter.js backend-patterns.md --raw
```

**Output:**
```json
{
  "file": "backend-patterns.md",
  "frontmatter": {
    "domain": "backend",
    "title": "Backend Architecture Patterns",
    "sections": [
      {
        "name": "Microservices Architecture",
        "line_start": 45,
        "line_end": 120,
        "summary": "Decomposing monolithic applications..."
      }
    ],
    "patterns": ["microservices", "event-driven"],
    "keywords": ["backend", "architecture"],
    "complexity": "intermediate",
    "line_count": 850
  }
}
```

**Documentation:**
- `SKILL.md` - Skill overview and usage
- `EXAMPLES.md` - Concrete examples
- `WORKFLOWS.md` - Common workflows and patterns

### 3. extract-segment

**Location:** `plugins/feature-dev/skills/extract-segment/`

Extract specific line ranges from documents without reading the entire file.

**Purpose:**
- Targeted section retrieval
- Line-based extraction
- Context expansion via offset
- Token-efficient reads

**Scripts:**
- `extract-segment.js` - Line-range extraction

**Usage:**
```bash
# Extract specific lines
node extract-segment/scripts/extract-segment.js backend-patterns.md 45 120

# Add context with offset
node extract-segment/scripts/extract-segment.js backend-patterns.md 45 120 --offset 5

# JSON output
node extract-segment/scripts/extract-segment.js backend-patterns.md 45 120 --json

# Hide line numbers
node extract-segment/scripts/extract-segment.js backend-patterns.md 45 120 --no-numbers
```

**Output:**
```
======================================================================
📄 backend-patterns.md
📍 Lines 45-120
======================================================================

 45 │ ## Microservices Architecture
 46 │
 47 │ Microservices architecture is an approach to developing...
 ...
120 │ - Consider operational complexity
======================================================================
✓ Extracted 76 lines
======================================================================
```

**Documentation:**
- `SKILL.md` - Skill overview and usage
- `EXAMPLES.md` - Concrete examples
- `WORKFLOWS.md` - Common workflows and patterns

## Directory Structure

```
plugins/feature-dev/skills/
├── shared/
│   └── scripts/
│       ├── README.md
│       └── list-docs.js
│
├── read-frontmatter/
│   ├── SKILL.md
│   ├── EXAMPLES.md
│   ├── WORKFLOWS.md
│   └── scripts/
│       └── extract-frontmatter.js
│
└── extract-segment/
    ├── SKILL.md
    ├── EXAMPLES.md
    ├── WORKFLOWS.md
    └── scripts/
        └── extract-segment.js
```

## Complete Workflow Example

```bash
# User asks: "How do I implement microservices?"

# Step 1: Discover documents
node shared/scripts/list-docs.js --json

# Step 2: Scan frontmatter for relevant docs
node read-frontmatter/scripts/extract-frontmatter.js backend-patterns.md --json
node read-frontmatter/scripts/extract-frontmatter.js api-design-patterns.md --json

# Step 3: Score relevance (in agent code)
# backend-patterns.md has "Microservices Architecture" section at lines 45-120
# api-design-patterns.md has "Microservices API" section at lines 180-240

# Step 4: Extract relevant sections
node extract-segment/scripts/extract-segment.js backend-patterns.md 45 120
node extract-segment/scripts/extract-segment.js api-design-patterns.md 180 240

# Step 5: Synthesize findings and return to user
```

## Performance Benefits

| Approach | Files Read | Lines Read | Tokens Used | Time |
|----------|------------|------------|-------------|------|
| **Full document read** | 1 | ~850 | ~4000 | ~150ms |
| **Progressive disclosure** | 1 | ~150 | ~600 | ~60ms |
| **Savings** | - | 82% less | 85% less | 60% faster |

## Integration with Research Agents

These skills are designed to be used by autonomous research agents:

```javascript
class ResearchAgent {
  async research(query) {
    // 1. Discover
    const docs = await this.listDocs();

    // 2. Scan
    const frontmatters = await Promise.all(
      docs.map(doc => this.readFrontmatter(doc))
    );

    // 3. Score
    const scored = frontmatters.map(fm => ({
      ...fm,
      score: this.scoreRelevance(fm, query)
    })).sort((a, b) => b.score - a.score);

    // 4. Retrieve
    const sections = [];
    for (const { file, frontmatter, score } of scored.slice(0, 3)) {
      const relevantSections = this.findRelevantSections(
        frontmatter.sections,
        query
      );

      for (const section of relevantSections) {
        const content = await this.extractSegment(
          file,
          section.line_start,
          section.line_end
        );
        sections.push({ file, section: section.name, content });
      }
    }

    // 5. Synthesize
    return this.synthesizeFindings(sections, query);
  }
}
```

## Best Practices

1. **Always start with frontmatter** - Don't read full documents blindly
2. **Score before extracting** - Only read high-relevance sections
3. **Use minimal offsets** - Add context only when truly needed
4. **Cache extractions** - Avoid re-reading same content
5. **Parallel when possible** - Scan multiple documents concurrently
6. **Progressive refinement** - Start broad, drill down on demand

## Anti-Patterns to Avoid

❌ **Don't read full documents first**
```bash
cat .ai-docs/backend-patterns.md  # 4000 tokens
```

✅ **Do scan frontmatter first**
```bash
node read-frontmatter/scripts/extract-frontmatter.js backend-patterns.md  # 200 tokens
```

---

❌ **Don't extract without knowing line numbers**
```bash
# Guessing line numbers
node extract-segment/scripts/extract-segment.js doc.md 100 200
node extract-segment/scripts/extract-segment.js doc.md 300 400
```

✅ **Do use frontmatter to guide extraction**
```bash
# Get exact line numbers from frontmatter
node read-frontmatter/scripts/extract-frontmatter.js doc.md --json
# Then extract precisely
node extract-segment/scripts/extract-segment.js doc.md 45 120
```

---

❌ **Don't use large offsets**
```bash
node extract-segment/scripts/extract-segment.js doc.md 100 150 --offset 100
# Defeats the purpose, reads 201 lines
```

✅ **Do use small offsets**
```bash
node extract-segment/scripts/extract-segment.js doc.md 100 150 --offset 5
# Adds minimal context, reads 61 lines
```

## Future Enhancements

Potential additions to this skill set:

- **search-content** - Full-text search within .ai-docs
- **compare-sections** - Side-by-side section comparison
- **extract-code** - Extract only code blocks from sections
- **summarize-doc** - Generate document summaries from frontmatter
- **graph-relations** - Visualize document relationships

## Contributing

When adding new skills to this collection:

1. Follow the established structure (SKILL.md, EXAMPLES.md, WORKFLOWS.md)
2. Use progressive disclosure principles
3. Minimize token usage
4. Support both CLI and module usage
5. Provide comprehensive examples
6. Document integration patterns

## Related Skills

- **explore** - High-level research orchestration
- **research** - Autonomous research agent using these skills

These knowledge base skills form the foundation for efficient, token-conscious documentation exploration.
