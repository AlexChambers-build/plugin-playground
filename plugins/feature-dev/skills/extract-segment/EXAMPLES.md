# Extract Segment Examples

## Example 1: Basic Section Extraction

```bash
# Extract a specific section (lines 45-120)
node scripts/extract-segment.js backend-architecture-patterns.md 45 120
```

**Output:**
```
======================================================================
📄 backend-architecture-patterns.md
📍 Lines 45-120
======================================================================

 45 │ ## Microservices Architecture
 46 │
 47 │ Microservices architecture is an approach to developing a single
 48 │ application as a suite of small services, each running in its own
 49 │ process and communicating with lightweight mechanisms...
 ...
120 │ - Consider operational complexity and team experience
======================================================================
✓ Extracted 76 lines
======================================================================
```

## Example 2: Adding Context with Offset

```bash
# Extract section with 10 lines of context on each side
node scripts/extract-segment.js api-design-patterns.md 100 150 --offset 10
```

This extracts lines 90-160 (100-150 plus 10 line offset), providing context before and after the target section.

**Use case:** When you need to see what comes before/after a section for better understanding.

## Example 3: JSON Output for Programmatic Use

```bash
# Get segment as JSON
node scripts/extract-segment.js security-patterns.md 200 300 --json
```

**Output:**
```json
{
  "file": "security-patterns.md",
  "start": 200,
  "end": 300,
  "offset": 0,
  "actualStart": 200,
  "actualEnd": 300,
  "lineCount": 101,
  "totalLines": 850,
  "content": "## OAuth 2.0 Patterns\n\nOAuth 2.0 is an authorization framework..."
}
```

## Example 4: Multiple Section Extraction

```bash
# Extract introduction section
node scripts/extract-segment.js patterns.md 1 40

# Extract specific pattern
node scripts/extract-segment.js patterns.md 150 200

# Extract examples section
node scripts/extract-segment.js patterns.md 500 600
```

**Use case:** Building a targeted summary from multiple non-contiguous sections.

## Example 5: Working with Frontmatter Metadata

```bash
# Step 1: Get section metadata from frontmatter
node ../read-frontmatter/scripts/extract-frontmatter.js backend-architecture-patterns.md --json

# Output shows sections with line ranges:
# {
#   "sections": [
#     {
#       "name": "Microservices Architecture",
#       "line_start": 45,
#       "line_end": 120
#     },
#     {
#       "name": "Event-Driven Architecture",
#       "line_start": 121,
#       "line_end": 200
#     }
#   ]
# }

# Step 2: Extract specific section using those line numbers
node scripts/extract-segment.js backend-architecture-patterns.md 45 120

# Step 3: Extract another section
node scripts/extract-segment.js backend-architecture-patterns.md 121 200
```

## Example 6: Hiding Line Numbers

```bash
# Get clean content without line numbers
node scripts/extract-segment.js patterns.md 50 100 --no-numbers
```

**Output:**
```
======================================================================
📄 patterns.md
📍 Lines 50-100
======================================================================

## Factory Pattern

The Factory pattern provides an interface for creating objects in a
superclass, but allows subclasses to alter the type of objects that
will be created...
======================================================================
✓ Extracted 51 lines
======================================================================
```

**Use case:** When you want clean markdown content for processing or display.

## Example 7: Extracting Code Examples

```bash
# Many documentation sections contain code examples
# Extract just the section with the code

node scripts/extract-segment.js api-design-patterns.md 450 520
```

**Output includes code blocks:**
```
450 │ ### Example: Rate Limiting Middleware
451 │
452 │ ```javascript
453 │ const rateLimit = require('express-rate-limit');
454 │
455 │ const limiter = rateLimit({
456 │   windowMs: 15 * 60 * 1000, // 15 minutes
457 │   max: 100 // limit each IP to 100 requests per windowMs
458 │ });
459 │ ```
```

## Example 8: Building a Custom Reader

```javascript
// Custom script that uses extract-segment programmatically
const { extractSegment } = require('./scripts/extract-segment.js');
const { extractFrontmatter } = require('../read-frontmatter/scripts/extract-frontmatter.js');
const path = require('path');

async function readRelevantSections(filename, query) {
  const filepath = path.join(process.cwd(), '.ai-docs', filename);

  // Get frontmatter
  const fm = extractFrontmatter(filepath, { json: true });

  // Find relevant sections
  const relevantSections = fm.frontmatter.sections.filter(section =>
    section.name.toLowerCase().includes(query.toLowerCase()) ||
    section.summary.toLowerCase().includes(query.toLowerCase())
  );

  // Extract each relevant section
  const results = [];
  for (const section of relevantSections) {
    const content = extractSegment(
      filepath,
      section.line_start,
      section.line_end,
      { json: true }
    );
    results.push({
      section: section.name,
      content: content.content
    });
  }

  return results;
}

// Usage
readRelevantSections('backend-architecture-patterns.md', 'microservices')
  .then(results => {
    results.forEach(({ section, content }) => {
      console.log(`\n### ${section}\n`);
      console.log(content);
    });
  });
```

## Example 9: Validating Line Ranges

```bash
# If you try invalid line ranges, you get clear errors

# Start line less than 1
node scripts/extract-segment.js patterns.md 0 100
# ❌ Start line must be >= 1

# End before start
node scripts/extract-segment.js patterns.md 100 50
# ❌ End line must be >= start line

# File not found
node scripts/extract-segment.js nonexistent.md 1 100
# ❌ File not found: .ai-docs/nonexistent.md
```

## Example 10: Research Agent Integration

```javascript
// How a research agent might use extract-segment

class DocumentResearcher {
  constructor() {
    this.aiDocsDir = path.join(process.cwd(), '.ai-docs');
  }

  async research(query) {
    // 1. List all documents
    const docs = listDocs();

    // 2. Scan frontmatter for each
    const scored = [];
    for (const doc of docs) {
      const fm = extractFrontmatter(path.join(this.aiDocsDir, doc));
      const score = this.scoreRelevance(fm, query);
      if (score > 5) {
        scored.push({ doc, fm, score });
      }
    }

    // 3. Sort by score
    scored.sort((a, b) => b.score - a.score);

    // 4. Extract top sections
    const findings = [];
    for (const { doc, fm, score } of scored.slice(0, 3)) {
      // Find most relevant section
      const section = this.findBestSection(fm.sections, query);
      if (section) {
        const content = extractSegment(
          path.join(this.aiDocsDir, doc),
          section.line_start,
          section.line_end,
          { showLineNumbers: false }
        );
        findings.push({
          doc,
          section: section.name,
          score,
          content
        });
      }
    }

    return this.synthesizeFindings(findings, query);
  }

  scoreRelevance(fm, query) {
    // Scoring logic...
  }

  findBestSection(sections, query) {
    // Find best matching section...
  }

  synthesizeFindings(findings, query) {
    // Combine and format findings...
  }
}
```

## Performance Comparison

```bash
# ❌ Inefficient: Read entire document
time cat .ai-docs/backend-architecture-patterns.md  # ~100ms, 4000 tokens

# ✅ Efficient: Read only needed section
time node scripts/extract-segment.js backend-architecture-patterns.md 45 120  # ~20ms, 400 tokens
```

**Result:** 5x faster, 10x fewer tokens
