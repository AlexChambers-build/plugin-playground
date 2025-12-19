# Explore Skill Workflows

Detailed procedures for research operations.

## Workflow 1: Frontmatter Scanning

### Purpose
Scan document metadata without loading full content.

### Steps

1. **Identify candidate documents** based on query keywords
2. **Read first 60 lines** of each candidate (frontmatter only)
3. **Extract metadata**:
   ```yaml
   domain: string
   patterns: string[]
   keywords: string[]
   sections:
     - name: string
       line_start: number
       line_end: number
       summary: string
   ```
4. **Score relevance** (see scoring algorithm below)
5. **Return structured metadata**, not raw content

### Scoring Algorithm

```
score = 0

# Exact pattern match (highest weight)
for each pattern in frontmatter.patterns:
    if pattern == query: score += 5
    if pattern contains query: score += 2

# Keyword match
for each keyword in frontmatter.keywords:
    if keyword == query: score += 3
    if keyword contains query: score += 1

# Section match
for each section in frontmatter.sections:
    if section.name contains query: score += 2
    if section.summary contains query: score += 2

# Relevance levels
HIGH: score >= 5
MEDIUM: score >= 2
LOW: score >= 1
```

### Output Format

```
SCAN_RESULTS:
  query: "[topic]"
  matches:
    - doc: "[filename]"
      relevance: "HIGH|MEDIUM|LOW"
      score: [number]
      matched_patterns: ["p1", "p2"]
      relevant_sections:
        - name: "[section]"
          lines: "[start]-[end]"
          summary: "[brief]"
```

---

## Workflow 2: Targeted Section Retrieval

### Purpose
Read specific sections identified during scanning.

### Steps

1. **Get section metadata** from frontmatter (line_start, line_end)
2. **Read only those lines** - do not read surrounding content
3. **Extract key information**:
   - Overview/definition
   - When to use
   - Code examples (preserve completely)
   - Tradeoffs
4. **Summarize in 3-5 sentences** - do not dump raw content
5. **Note related sections** for navigation

### Critical Rules

- **Never truncate code blocks** - include complete examples
- **Preserve ASCII diagrams** - they convey important information
- **Always attribute sources** - include doc name and line range
- **Limit to 5 sections** per research request

### Output Format

```
RETRIEVED:
  doc: "[filename]"
  section: "[name]"
  lines: "[start]-[end]"

  summary: |
    [3-5 sentence synthesis of the section content]

  key_points:
    - [point 1]
    - [point 2]

  when_to_use:
    - [use case 1]
    - [use case 2]

  code_example: |
    [complete code block if present]

  tradeoffs:
    pros: [benefits]
    cons: [drawbacks]

  related_sections:
    - "[section in same doc]"
  related_docs:
    - "[other-doc.md]"
```

---

## Workflow 3: Synthesis and Recommendation

### Purpose
Combine findings from multiple sources into actionable guidance.

### Steps

1. **Collect findings** from all retrieved sections
2. **Identify patterns** - what do multiple sources agree on?
3. **Note conflicts** - where do approaches differ?
4. **Formulate recommendation** based on user's apparent needs
5. **Suggest next steps** for deeper exploration

### Autonomous Research Rule

**CRITICAL: Do NOT ask the user to choose between options.**

When multiple relevant patterns are found:
1. Research ALL of them (up to 5)
2. Present synthesized comparison
3. Make a recommendation
4. Let user decide after seeing the full picture

### Output Format

```markdown
## Research Findings: [Topic]

### Relevance Summary
- Primary: [doc] > [section] (HIGH)
- Secondary: [list]

### Key Findings

#### [Finding 1]
**Source**: [doc] lines [X-Y]
**Summary**: [synthesis]
**Best for**: [use case]

#### [Finding 2]
...

### Comparison (if multiple options)

| Factor | Option A | Option B |
|--------|----------|----------|
| [factor] | [A's approach] | [B's approach] |

### Recommendation
[Specific guidance based on findings]

### Anti-Patterns to Avoid
- [relevant anti-pattern]: [why]

### Next Steps
- `/deep-dive [doc] [section]` for [reason]
- `/explore-compare [p1] [p2]` for [reason]
```
