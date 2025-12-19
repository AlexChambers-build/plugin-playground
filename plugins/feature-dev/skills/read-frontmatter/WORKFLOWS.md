# Read Frontmatter Workflows

## Core Workflow: Progressive Disclosure

The read-frontmatter skill is designed to support progressive disclosure of knowledge base content.

```
┌─────────────────────────────────────────────────────────────────┐
│ Progressive Disclosure Pattern                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. DISCOVER                                                    │
│     └─ list-docs.js → Get all available documents              │
│                                                                 │
│  2. SCAN                                                        │
│     └─ extract-frontmatter.js → Read metadata only             │
│                                                                 │
│  3. SCORE                                                       │
│     └─ Match query against patterns, keywords, sections        │
│                                                                 │
│  4. RETRIEVE                                                    │
│     └─ extract-segment.js → Read only relevant sections        │
│                                                                 │
│  5. SYNTHESIZE                                                  │
│     └─ Combine findings and return structured results          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Workflow 1: Research Agent Discovery

**Goal:** Find relevant documentation for a research query

```bash
# 1. Discovery Phase
node ../shared/scripts/list-docs.js --json > docs.json

# 2. Scanning Phase - Read all frontmatter
for doc in $(cat docs.json | jq -r '.[].name'); do
  node scripts/extract-frontmatter.js "$doc" --json >> frontmatter-scan.json
done

# 3. Scoring Phase - Rank by relevance (in code)
# Score each document based on query match

# 4. Retrieval Phase - Read top sections
# Extract only high-scoring sections using extract-segment

# 5. Synthesis Phase - Combine and summarize
# Return structured findings to user
```

## Workflow 2: Targeted Section Lookup

**Goal:** Find specific information about a known topic

```bash
# User asks: "How do I implement microservices?"

# 1. Scan frontmatter for "microservices" keyword
node scripts/extract-frontmatter.js backend-architecture-patterns.md --json

# 2. Find section with "microservices" in name
# Output shows: "Microservices Architecture" at lines 45-120

# 3. Extract that section
node ../extract-segment/scripts/extract-segment.js backend-architecture-patterns.md 45 120

# 4. Return section content to user
```

## Workflow 3: Multi-Document Research

**Goal:** Synthesize information from multiple documents

```bash
# User asks: "What are best practices for API authentication?"

# 1. List all documents
node ../shared/scripts/list-docs.js --json

# 2. Scan frontmatter for relevant docs
node scripts/extract-frontmatter.js api-design-patterns.md --json
node scripts/extract-frontmatter.js security-patterns.md --json

# 3. Find relevant sections in each
# api-design-patterns.md → "Authentication" section at lines 200-250
# security-patterns.md → "OAuth Patterns" section at lines 100-180

# 4. Extract both sections
node ../extract-segment/scripts/extract-segment.js api-design-patterns.md 200 250
node ../extract-segment/scripts/extract-segment.js security-patterns.md 100 180

# 5. Synthesize findings from both sources
```

## Workflow 4: Domain-Specific Exploration

**Goal:** Explore all content in a specific domain

```bash
# User asks: "What frontend patterns are available?"

# 1. Scan all frontmatter
node scripts/extract-frontmatter.js --all --json > all-frontmatter.json

# 2. Filter by domain in code
cat all-frontmatter.json | jq '.[] | select(.frontmatter.domain == "frontend")'

# 3. List all sections from frontend documents
cat all-frontmatter.json | jq -r '
  .[] |
  select(.frontmatter.domain == "frontend") |
  .frontmatter.sections[] |
  "\(.name) (\(.line_start)-\(.line_end))"
'

# 4. Extract relevant sections based on user query
```

## Workflow 5: Complexity-Based Filtering

**Goal:** Find beginner-friendly or advanced content

```bash
# User asks: "I'm new to backend development, what should I learn?"

# 1. Scan all frontmatter
node scripts/extract-frontmatter.js --all --json > all-frontmatter.json

# 2. Filter by complexity level
cat all-frontmatter.json | jq '.[] | select(.frontmatter.complexity == "beginner")'

# 3. Extract introductory sections from beginner docs
```

## Performance Characteristics

| Operation | Lines Read | Token Usage | Time |
|-----------|------------|-------------|------|
| list-docs.js | 0 (directory scan) | ~50 tokens | <10ms |
| extract-frontmatter.js | ~50-100 | ~200 tokens | ~20ms |
| extract-segment.js (section) | ~50-100 | ~200-500 tokens | ~20ms |
| Full document read | 500-1000 | ~2000-4000 tokens | ~100ms |

**Key insight:** Reading frontmatter + targeted sections uses 10-20% of tokens compared to full document reads.

## Anti-Patterns to Avoid

### ❌ Don't: Read Full Documents First
```bash
# Bad - reads entire document
cat .ai-docs/backend-architecture-patterns.md
```

### ✅ Do: Scan Frontmatter First
```bash
# Good - reads only metadata
node scripts/extract-frontmatter.js backend-architecture-patterns.md
```

### ❌ Don't: Read All Sections Sequentially
```bash
# Bad - reads everything even if not relevant
for section in $(get all sections); do
  read $section
done
```

### ✅ Do: Score and Read Only Relevant Sections
```bash
# Good - reads only high-scoring sections
score_sections | top 3 | while read section; do
  extract_segment $section
done
```

## Integration with Other Skills

The read-frontmatter skill is designed to work with:

1. **shared/list-docs.js** - Document discovery
2. **extract-segment** - Targeted section retrieval
3. **explore** - Research agent orchestration

Together, these enable efficient, token-conscious knowledge base navigation.
