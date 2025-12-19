# Read Frontmatter Examples

## Example 1: Quick Document Discovery

```bash
# List all available documents
node ../shared/scripts/list-docs.js

# Read frontmatter from a specific document
node scripts/extract-frontmatter.js backend-architecture-patterns.md
```

**Output:**
```json
{
  "file": "backend-architecture-patterns.md",
  "frontmatter": {
    "domain": "backend",
    "title": "Backend Architecture Patterns",
    "description": "Comprehensive guide to backend patterns...",
    "patterns": ["microservices", "event-driven", "layered"],
    "keywords": ["backend", "architecture", "server"],
    "sections": [
      {
        "name": "Microservices Architecture",
        "line_start": 45,
        "line_end": 120,
        "summary": "Decomposing monolithic applications..."
      },
      {
        "name": "Event-Driven Architecture",
        "line_start": 121,
        "line_end": 200,
        "summary": "Asynchronous communication patterns..."
      }
    ],
    "complexity": "intermediate",
    "line_count": 850
  }
}
```

## Example 2: Scanning Multiple Documents

```bash
# Extract frontmatter from all documents as JSON
node scripts/extract-frontmatter.js --all --json
```

**Use case:** Find all documents related to "authentication"

```javascript
// In agent code
const results = [];
const docs = listDocs();

for (const doc of docs) {
  const fm = extractFrontmatter(doc);
  if (fm.keywords.includes('security') ||
      fm.keywords.includes('authentication')) {
    results.push({
      file: doc,
      title: fm.title,
      sections: fm.sections
    });
  }
}
```

## Example 3: Finding Relevant Sections

```bash
# Read frontmatter to find section line numbers
node scripts/extract-frontmatter.js api-design-patterns.md --json
```

**Output shows sections:**
```json
{
  "sections": [
    {
      "name": "REST API Design",
      "line_start": 50,
      "line_end": 150,
      "summary": "RESTful principles and best practices"
    },
    {
      "name": "GraphQL Patterns",
      "line_start": 151,
      "line_end": 250,
      "summary": "Query optimization and schema design"
    }
  ]
}
```

Now use these line numbers with extract-segment skill:
```bash
# Read only the REST API Design section
node ../extract-segment/scripts/extract-segment.js api-design-patterns.md 50 150
```

## Example 4: Relevance Scoring

```javascript
// Score document relevance based on frontmatter
function scoreRelevance(frontmatter, query) {
  let score = 0;
  const queryLower = query.toLowerCase();

  // Check title
  if (frontmatter.title.toLowerCase().includes(queryLower)) {
    score += 10;
  }

  // Check patterns
  for (const pattern of frontmatter.patterns || []) {
    if (pattern.toLowerCase().includes(queryLower)) {
      score += 5;
    }
  }

  // Check keywords
  for (const keyword of frontmatter.keywords || []) {
    if (keyword.toLowerCase().includes(queryLower)) {
      score += 3;
    }
  }

  // Check section names and summaries
  for (const section of frontmatter.sections || []) {
    if (section.name.toLowerCase().includes(queryLower)) {
      score += 4;
    }
    if (section.summary.toLowerCase().includes(queryLower)) {
      score += 2;
    }
  }

  return score;
}

// Example usage
const fm = extractFrontmatter('backend-architecture-patterns.md');
const score = scoreRelevance(fm, 'microservices');
console.log(`Relevance score: ${score}`);
```

## Example 5: Progressive Disclosure Workflow

```bash
# Step 1: List documents
node ../shared/scripts/list-docs.js

# Step 2: Read frontmatter for potentially relevant docs
node scripts/extract-frontmatter.js backend-architecture-patterns.md --json
node scripts/extract-frontmatter.js api-design-patterns.md --json
node scripts/extract-frontmatter.js scalability-patterns.md --json

# Step 3: Score relevance in code

# Step 4: Extract only high-relevance sections
node ../extract-segment/scripts/extract-segment.js backend-architecture-patterns.md 45 120
```

This approach:
- ✅ Reads only frontmatter first (fast, low tokens)
- ✅ Scores relevance before full reads
- ✅ Extracts only needed sections
- ✅ Avoids loading entire documents unnecessarily
