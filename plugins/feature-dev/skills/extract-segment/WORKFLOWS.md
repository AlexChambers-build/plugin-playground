# Extract Segment Workflows

## Core Principle: Targeted Retrieval

The extract-segment skill enables precise, line-based content retrieval from documentation, minimizing token usage and improving response time.

```
┌─────────────────────────────────────────────────────────────────┐
│ Targeted Retrieval Pattern                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontmatter             Extract Segment          Result       │
│  ┌──────────┐           ┌──────────┐           ┌──────────┐   │
│  │ Metadata │  ──────>  │ Lines    │  ──────>  │ Content  │   │
│  │ Sections │           │ 45-120   │           │ Only     │   │
│  │ Line Nums│           │ Targeted │           │ Needed   │   │
│  └──────────┘           └──────────┘           └──────────┘   │
│                                                                 │
│  ~100 lines             ~75 lines               ~400 tokens    │
│  ~200 tokens            ~400 tokens             vs 4000 full   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Workflow 1: Single Section Extraction

**Goal:** Read one specific section from a document

```bash
# 1. Scan frontmatter to get section metadata
node ../read-frontmatter/scripts/extract-frontmatter.js backend-patterns.md --json

# 2. Identify target section from output
# Example: "Microservices" at lines 45-120

# 3. Extract that section
node scripts/extract-segment.js backend-patterns.md 45 120

# 4. Return content to user
```

**Token usage:** ~600 tokens (frontmatter + section)
**vs Full read:** ~4000 tokens

## Workflow 2: Multi-Section Compilation

**Goal:** Compile information from multiple sections across documents

```bash
# User asks: "Compare REST and GraphQL API patterns"

# 1. Scan relevant documents
node ../read-frontmatter/scripts/extract-frontmatter.js api-design-patterns.md --json

# Frontmatter shows:
# - "REST API Design" at lines 50-150
# - "GraphQL Patterns" at lines 151-250

# 2. Extract both sections
node scripts/extract-segment.js api-design-patterns.md 50 150 > rest.txt
node scripts/extract-segment.js api-design-patterns.md 151 250 > graphql.txt

# 3. Synthesize comparison from both sections
```

## Workflow 3: Context-Aware Extraction

**Goal:** Get section with surrounding context

```bash
# User asks about a specific pattern that might need context

# 1. Identify section
node ../read-frontmatter/scripts/extract-frontmatter.js patterns.md --json

# 2. Extract with offset for context
node scripts/extract-segment.js patterns.md 200 250 --offset 10

# This extracts lines 190-260, giving context before/after
```

**Use cases:**
- Pattern might reference previous section
- Examples might be just after section
- Prerequisites might be just before section

## Workflow 4: Progressive Deep Dive

**Goal:** Start broad, then get specific based on findings

```bash
# User asks: "How do I implement authentication?"

# Phase 1: Broad scan
node ../read-frontmatter/scripts/extract-frontmatter.js security-patterns.md --json

# Frontmatter shows multiple auth-related sections:
# - "Authentication Basics" lines 50-100
# - "OAuth 2.0" lines 101-200
# - "JWT Tokens" lines 201-280

# Phase 2: Extract overview first
node scripts/extract-segment.js security-patterns.md 50 100

# Phase 3: User indicates interest in OAuth
node scripts/extract-segment.js security-patterns.md 101 200

# Phase 4: User wants JWT details
node scripts/extract-segment.js security-patterns.md 201 280
```

**Progressive disclosure:** Start general, drill down as needed.

## Workflow 5: Cross-Document Pattern Research

**Goal:** Research a pattern mentioned in multiple documents

```bash
# User asks: "What do we know about the Circuit Breaker pattern?"

# 1. Scan multiple potentially relevant documents
node ../read-frontmatter/scripts/extract-frontmatter.js backend-patterns.md --json
node ../read-frontmatter/scripts/extract-frontmatter.js scalability-patterns.md --json
node ../read-frontmatter/scripts/extract-frontmatter.js resilience-patterns.md --json

# 2. Find sections mentioning circuit breaker
# backend-patterns.md: "Resilience Patterns" lines 500-580
# scalability-patterns.md: "Circuit Breaker" lines 300-380
# resilience-patterns.md: "Circuit Breaker" lines 150-230

# 3. Extract all relevant sections
node scripts/extract-segment.js backend-patterns.md 500 580 > circuit-1.txt
node scripts/extract-segment.js scalability-patterns.md 300 380 > circuit-2.txt
node scripts/extract-segment.js resilience-patterns.md 150 230 > circuit-3.txt

# 4. Synthesize findings from all sources
```

## Workflow 6: Code Example Extraction

**Goal:** Extract just the code examples without full explanation

```bash
# User asks: "Show me a code example of rate limiting"

# 1. Find section with examples
node ../read-frontmatter/scripts/extract-frontmatter.js api-patterns.md --json

# Section shows: "Rate Limiting" lines 400-500

# 2. Extract section
node scripts/extract-segment.js api-patterns.md 400 500

# 3. Parse output to find code blocks (```...```)

# 4. Return just the code examples
```

## Workflow 7: Related Document Navigation

**Goal:** Follow related documents for comprehensive understanding

```bash
# User reads about microservices

# 1. Extract microservices section
node scripts/extract-segment.js backend-patterns.md 45 120

# 2. Frontmatter shows related docs:
# - api-design-patterns.md
# - data-architecture-patterns.md
# - scalability-patterns.md

# 3. Extract relevant sections from related docs
node ../read-frontmatter/scripts/extract-frontmatter.js api-design-patterns.md --json
# Find "Microservices API" section at lines 180-240

node scripts/extract-segment.js api-design-patterns.md 180 240

# 4. Build comprehensive understanding across related docs
```

## Workflow 8: Efficiency Optimization

**Goal:** Minimize token usage while maximizing information

```bash
# ❌ Inefficient approach
cat .ai-docs/backend-patterns.md | grep -A 50 "Microservices"
# Reads entire file, unpredictable output, ~4000 tokens

# ✅ Efficient approach
# 1. Scan frontmatter (200 tokens)
node ../read-frontmatter/scripts/extract-frontmatter.js backend-patterns.md --json

# 2. Extract targeted section (400 tokens)
node scripts/extract-segment.js backend-patterns.md 45 120

# Total: 600 tokens vs 4000 tokens (85% reduction)
```

## Workflow 9: Batch Section Extraction

**Goal:** Extract multiple sections efficiently

```bash
# User wants to understand all backend patterns

# 1. Get all sections from frontmatter
node ../read-frontmatter/scripts/extract-frontmatter.js backend-patterns.md --json \
  | jq -r '.frontmatter.sections[] | "\(.line_start) \(.line_end) \(.name)"'

# Output:
# 45 120 Microservices Architecture
# 121 200 Event-Driven Architecture
# 201 280 Layered Architecture

# 2. Extract each section
while read start end name; do
  echo "## $name"
  node scripts/extract-segment.js backend-patterns.md $start $end --no-numbers
  echo
done < sections.txt

# 3. Compile into structured output
```

## Workflow 10: Smart Caching Strategy

**Goal:** Cache extractions for reuse

```javascript
// Implement caching to avoid re-extracting same segments

class SegmentCache {
  constructor() {
    this.cache = new Map();
  }

  getCacheKey(file, start, end, offset) {
    return `${file}:${start}:${end}:${offset}`;
  }

  get(file, start, end, offset = 0) {
    const key = this.getCacheKey(file, start, end, offset);
    return this.cache.get(key);
  }

  set(file, start, end, offset = 0, content) {
    const key = this.getCacheKey(file, start, end, offset);
    this.cache.set(key, {
      content,
      timestamp: Date.now()
    });
  }

  extract(file, start, end, offset = 0) {
    // Check cache first
    const cached = this.get(file, start, end, offset);
    if (cached && (Date.now() - cached.timestamp < 300000)) { // 5 min TTL
      return cached.content;
    }

    // Extract and cache
    const content = extractSegment(file, start, end, { offset });
    this.set(file, start, end, offset, content);
    return content;
  }
}
```

## Performance Metrics

| Workflow | Docs Read | Sections Extracted | Token Usage | Time |
|----------|-----------|-------------------|-------------|------|
| Single section | 1 | 1 | ~600 | ~40ms |
| Multi-section | 1 | 3 | ~1200 | ~80ms |
| Cross-document | 3 | 3 | ~1800 | ~120ms |
| Full doc read | 1 | all | ~4000 | ~150ms |

**Key insight:** Targeted extraction is 3-5x more efficient in both time and tokens.

## Integration Patterns

### Pattern 1: Frontmatter → Segment
```
Frontmatter (metadata) → Score sections → Extract high-scoring → Return
```

### Pattern 2: Iterative Refinement
```
Extract overview → User feedback → Extract details → User feedback → Continue
```

### Pattern 3: Parallel Extraction
```
Scan multiple docs → Extract in parallel → Synthesize → Return
```

## Anti-Patterns to Avoid

### ❌ Don't: Extract Overlapping Sections
```bash
# Bad - wasteful overlap
node scripts/extract-segment.js doc.md 50 150
node scripts/extract-segment.js doc.md 100 200  # 50 lines duplicated
```

### ✅ Do: Plan Extractions to Minimize Overlap
```bash
# Good - adjacent sections
node scripts/extract-segment.js doc.md 50 150
node scripts/extract-segment.js doc.md 151 200
```

### ❌ Don't: Extract Without Frontmatter Scan
```bash
# Bad - guessing line numbers
node scripts/extract-segment.js doc.md 100 200
node scripts/extract-segment.js doc.md 300 400
node scripts/extract-segment.js doc.md 500 600
```

### ✅ Do: Use Frontmatter to Guide Extraction
```bash
# Good - informed by metadata
node ../read-frontmatter/scripts/extract-frontmatter.js doc.md --json
# Then extract only relevant sections identified
```

### ❌ Don't: Use Large Offsets Unnecessarily
```bash
# Bad - offset defeats the purpose
node scripts/extract-segment.js doc.md 100 150 --offset 100
# Ends up reading lines 0-250 (nearly half the doc)
```

### ✅ Do: Use Minimal Offsets
```bash
# Good - small context addition
node scripts/extract-segment.js doc.md 100 150 --offset 5
# Reads lines 95-155 (reasonable context)
```

## Best Practices

1. **Always scan frontmatter first** - Know before you read
2. **Extract smallest viable sections** - Start small, expand if needed
3. **Use offset sparingly** - Only when context is truly needed
4. **Cache extractions** - Avoid re-reading same segments
5. **Batch related sections** - Extract from same doc together
6. **Parallel when possible** - Extract from different docs in parallel
7. **Progressive disclosure** - Overview first, details on demand

## Tool Chain Integration

```
list-docs.js
    ↓
extract-frontmatter.js (scan metadata)
    ↓
[Score and filter sections]
    ↓
extract-segment.js (targeted retrieval)
    ↓
[Synthesize and return]
```

This workflow minimizes token usage while maximizing information relevance.
