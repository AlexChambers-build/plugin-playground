# .ai-docs Frontmatter Standard

Progressive disclosure system: DISCOVER → SCAN frontmatter → SCORE → RETRIEVE sections → SYNTHESIZE

## Schema

```yaml
---
domain: string                    # REQUIRED: general|backend|frontend|security|database|deployment|testing|architecture
title: string                     # REQUIRED: Title Case, 3-7 words
description: string               # REQUIRED: 1-2 sentences mentioning key patterns
patterns: string[]                # REQUIRED: kebab-case topics (CRITICAL FOR SCORING)
keywords: string[]                # OPTIONAL: lowercase search terms
sections:                         # REQUIRED: (CRITICAL FOR EXTRACTION)
  - name: string                  # Section heading as it appears
    line_start: number            # 1-indexed start line
    line_end: number              # 1-indexed end line (inclusive)
    summary: string               # Descriptive with searchable terms
complexity: basic|intermediate|advanced  # REQUIRED
line_count: number                # REQUIRED: wc -l output
last_updated: YYYY-MM-DD          # REQUIRED
related: string[]                 # OPTIONAL: filenames
---
```

## Scoring Algorithm

```javascript
score = 0
for (pattern in patterns) {
  if (pattern === query) score += 5         // Exact match (HIGHEST)
  if (pattern.includes(query)) score += 2
}
for (keyword in keywords) {
  if (keyword === query) score += 3
  if (keyword.includes(query)) score += 1
}
for (section in sections) {
  if (section.name.includes(query)) score += 2
  if (section.summary.includes(query)) score += 2
}

// Relevance: HIGH (≥5), MEDIUM (≥2), LOW (≥1)
```

## Critical Rules

### `patterns[]` (MOST IMPORTANT)
- **Format**: kebab-case only (`dependency-injection`, NOT `DI` or `Dependency_Injection`)
- **Coverage**: List ALL topics, subsections, technologies, concepts
- **Searchable**: Include variations (`auth`, `authentication`, `jwt`, `json-web-tokens`)
- **Specific**: Use full names (`single-responsibility-principle`, NOT `srp`)
- **Scoring**: Exact match = +5 (highest weight), drives discovery

**Example**:
```yaml
patterns:
  - clean-architecture-layers
  - hexagonal-architecture-ports-&-adapters
  - dependency-injection
  - constructor-injection-preferred
  - repository-pattern
  - service-layer-best-practices
  - restful-api-design
  - input-validation-with-dtos
```

### `sections[]` (CRITICAL FOR EXTRACTION)
- **Line numbers**: Must be exact (use Read tool to verify)
- **Summaries**: Descriptive, include searchable terms, mention code if present
- **No overlap**: Each line belongs to one section only
- **Complete**: Every major heading (##) should be a section

**Example**:
```yaml
sections:
  - name: "Dependency Injection"
    line_start: 289
    line_end: 323
    summary: "Constructor injection with @Injectable decorator, ITodoRepository interface pattern, provider configuration"
```

### `keywords[]`
- Supplement patterns with tech names, abbreviations, synonyms
- Lowercase, 1-2 words
- Don't duplicate patterns

## Complete Example

```yaml
---
domain: backend
title: "Backend Best Practices"
description: "NestJS backend patterns covering clean architecture, dependency injection, service/controller layers, error handling, testing, and security."

patterns:
  - overview
  - technology-stack
  - clean-architecture-layers
  - hexagonal-architecture-ports-&-adapters
  - dependency-injection
  - constructor-injection-preferred
  - dependency-inversion
  - service-layer-best-practices
  - single-responsibility
  - error-handling
  - async-await-best-practices
  - controller-layer-best-practices
  - restful-api-design
  - http-status-codes
  - input-validation-with-dtos
  - repository-pattern
  - exception-filters
  - testing-considerations
  - configuration-management
  - security-best-practices
  - logging
  - performance-optimization

keywords:
  - nestjs
  - typescript
  - backend
  - architecture
  - solid
  - rest-api

sections:
  - name: "Overview"
    line_start: 141
    line_end: 143
    summary: "NestJS backend best practices following Clean Architecture and Hexagonal Architecture"

  - name: "Clean Architecture Layers"
    line_start: 152
    line_end: 180
    summary: "Four layers: Domain (entities), Application (use cases), Infrastructure (repositories), Presentation (controllers)"

  - name: "Dependency Injection"
    line_start: 289
    line_end: 323
    summary: "Constructor injection with @Injectable, ITodoRepository interface, dependency inversion with provider configuration"

  - name: "Service Layer Best Practices"
    line_start: 324
    line_end: 391
    summary: "Single responsibility, error handling with NestJS exceptions, async/await patterns"

  - name: "Controller Layer Best Practices"
    line_start: 392
    line_end: 502
    summary: "RESTful API with HTTP verbs (@Get, @Post, @Patch), status codes, DTOs with class-validator, thin controllers"

  - name: "Testing Considerations"
    line_start: 488
    line_end: 543
    summary: "Unit testing services with mocks, integration testing with TestingModule, Jest examples"

complexity: intermediate
line_count: 834
last_updated: 2026-01-05

related:
  - frontend-best-practices.md
  - technical-decisions.md
---
```

## Scoring Example

**Query**: "dependency injection"

**Good frontmatter**:
```yaml
patterns:
  - dependency-injection           # +5 (exact)
  - constructor-injection          # +2 (contains "injection")
  - dependency-inversion           # +2 (contains "dependency")
keywords:
  - injection                      # +1
sections:
  - name: "Dependency Injection"   # +2
    summary: "Constructor injection with dependency inversion"  # +2
# Total: 14 (HIGH)
```

**Poor frontmatter**:
```yaml
patterns:
  - di                             # 0 (no match)
keywords:
  - backend                        # 0
sections:
  - name: "DI Patterns"            # 0
    summary: "Content about DI"    # 0
# Total: 0 (NO MATCH)
```

## Creating Documentation

1. Write content with clear `##` headings
2. Read file with line numbers to identify section boundaries
3. Extract ALL patterns: headings, subsections, technologies, concepts
4. Write frontmatter with comprehensive patterns (kebab-case) and accurate line numbers
5. Validate: `node read-frontmatter/scripts/extract-frontmatter.js doc.md --json`
6. Test extraction: `node extract-segment/scripts/extract-segment.js doc.md [start] [end]`

## When Updating

- Update content first
- Adjust section line numbers if content shifted
- Add new patterns for new topics
- Update `last_updated` and `line_count`
- Re-test section extraction

## Quick Reference

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `patterns[]` | string[] | ✅ | **CRITICAL**: Drives scoring (exact +5, contains +2) |
| `sections[]` | object[] | ✅ | **CRITICAL**: Enables extraction (line_start, line_end) |
| `domain` | enum | ✅ | Category filter |
| `title` | string | ✅ | Document name |
| `description` | string | ✅ | Brief summary |
| `keywords[]` | string[] | ❌ | Fuzzy matching (exact +3, contains +1) |
| `complexity` | enum | ✅ | Skill level |
| `line_count` | number | ✅ | Total lines |
| `last_updated` | date | ✅ | YYYY-MM-DD |
| `related[]` | string[] | ❌ | Cross-references |

**Remember**: Comprehensive patterns (kebab-case) + accurate sections (verified line numbers) = high-quality search results.
