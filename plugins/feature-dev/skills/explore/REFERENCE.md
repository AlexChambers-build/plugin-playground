# Explore Skill Reference

Technical reference for the explore skill implementation.

---

## Frontmatter Schema

All `.ai-docs/` files use this YAML frontmatter structure:

```yaml
---
domain: string           # Category: backend, frontend, api, data, security, etc.
title: string            # Document title
description: string      # Brief summary (for search matching)

patterns:                # Pattern names (searchable, kebab-case)
  - pattern-name-1
  - pattern-name-2

keywords:                # Search terms (include synonyms)
  - keyword-1
  - keyword-2

sections:                # Section metadata with line ranges
  - name: "Section Name" # Exact heading text
    line_start: 22       # First line of section
    line_end: 150        # Last line before next section
    summary: "Brief..."  # 50-100 char description

complexity: string       # beginner | intermediate | advanced
line_count: number       # Total document lines
last_updated: string     # YYYY-MM-DD

related:                 # Cross-references
  - other-doc.md
---
```

### Domain Values

| Domain | Document | Focus |
|--------|----------|-------|
| backend | backend-architecture-patterns.md | Server architecture |
| frontend | frontend-architecture-patterns.md | Client architecture |
| api | api-design-patterns.md | API design |
| data | data-architecture-patterns.md | Data management |
| security | security-patterns.md | Auth & protection |
| scalability | scalability-patterns.md | Performance |
| testing | testing-patterns.md | Test strategies |
| design | design-patterns.md | GoF patterns |
| principles | solid-principles.md | SOLID |
| anti-patterns | anti-patterns.md | What to avoid |
| index | INDEX.md | Navigation |

---

## Scoring Algorithm

### Relevance Scoring

```javascript
function scoreDocument(frontmatter, query) {
  let score = 0;
  const q = query.toLowerCase();

  // Pattern matches (highest weight)
  for (const pattern of frontmatter.patterns) {
    if (pattern === q) score += 5;           // Exact match
    else if (pattern.includes(q)) score += 2; // Partial match
  }

  // Keyword matches
  for (const keyword of frontmatter.keywords) {
    if (keyword.toLowerCase() === q) score += 3;
    else if (keyword.toLowerCase().includes(q)) score += 1;
  }

  // Section matches
  for (const section of frontmatter.sections) {
    if (section.name.toLowerCase().includes(q)) score += 2;
    if (section.summary.toLowerCase().includes(q)) score += 2;
  }

  // Description match
  if (frontmatter.description.toLowerCase().includes(q)) {
    score += 1;
  }

  return score;
}
```

### Relevance Thresholds

| Score | Level | Action |
|-------|-------|--------|
| >= 5 | HIGH | Read relevant sections |
| >= 2 | MEDIUM | Include in results |
| >= 1 | LOW | Mention if few results |
| 0 | NONE | Exclude |

---

## Synonym Mappings

Expand user queries with these synonyms:

```javascript
const synonyms = {
  'auth': ['authentication', 'authorization', 'login'],
  'db': ['database', 'persistence', 'storage'],
  'perf': ['performance', 'speed', 'latency'],
  'scale': ['scaling', 'scalability', 'growth'],
  'error': ['failure', 'exception', 'fault'],
  'cache': ['caching', 'redis', 'memcached'],
  'test': ['testing', 'unit', 'integration'],
};
```

---

## Document Shorthand

For `/deep-dive` and other commands:

| Shorthand | Full Document |
|-----------|---------------|
| backend | backend-architecture-patterns.md |
| frontend | frontend-architecture-patterns.md |
| api | api-design-patterns.md |
| data | data-architecture-patterns.md |
| security | security-patterns.md |
| scalability | scalability-patterns.md |
| testing | testing-patterns.md |
| design | design-patterns.md |
| solid | solid-principles.md |
| anti | anti-patterns.md |
| index | INDEX.md |

---

## Context Budget Guidelines

### Token Estimates

| Operation | Tokens |
|-----------|--------|
| Frontmatter scan (per doc) | ~100 |
| Section read (avg) | ~800 |
| Section read (large) | ~1500 |
| Structured output | ~500 |

### Limits

| Constraint | Limit |
|------------|-------|
| Max docs to scan | 11 (all) |
| Max sections to read | 5 |
| Max output tokens | ~1500 |

---

## Regenerating Frontmatter

If documents are updated, regenerate frontmatter:

```bash
# Preview changes
node .claude/skills/explore/scripts/generate-frontmatter.js

# Apply changes
node .claude/skills/explore/scripts/generate-frontmatter.js --apply

# Single file
node .claude/skills/explore/scripts/generate-frontmatter.js --file=security-patterns.md
```

The script:
1. Extracts title from first `# Heading`
2. Finds all `## Sections` with line numbers
3. Generates keywords based on domain
4. Creates YAML frontmatter block
