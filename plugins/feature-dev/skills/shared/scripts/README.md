# Shared Scripts

Common utilities shared across multiple skills for working with `.ai-docs` knowledge base.

## Scripts

### list-docs.js

Lists all markdown files in the `.ai-docs` directory.

**Usage:**
```bash
node list-docs.js              # List all .md files
node list-docs.js --full       # List with full paths
node list-docs.js --json       # Output as JSON array
```

**Example Output:**
```
📚 Found 8 documents in .ai-docs:

  1. api-design-patterns.md
  2. backend-architecture-patterns.md
  3. data-architecture-patterns.md
  4. frontend-architecture-patterns.md
  5. scalability-patterns.md
  6. security-patterns.md
  7. solid-principles.md
  8. testing-patterns.md
```

**JSON Output:**
```json
[
  {
    "name": "api-design-patterns.md",
    "path": "api-design-patterns.md",
    "fullPath": "/path/to/.ai-docs/api-design-patterns.md"
  },
  ...
]
```

**Integration:**

This script is used as the first step in the progressive disclosure workflow:
1. **list-docs.js** - Discover available documents
2. **read-frontmatter** - Scan metadata
3. **extract-segment** - Retrieve specific sections

**Module Usage:**
```javascript
const { listDocs } = require('./list-docs.js');

const docs = listDocs({ json: true });
console.log(`Found ${docs.length} documents`);
```

## Directory Structure

```
shared/
└── scripts/
    ├── README.md          # This file
    └── list-docs.js       # Document discovery utility
```

## Purpose

The shared scripts directory provides common utilities that are used by multiple skills. This avoids code duplication and ensures consistent behavior across skills.

## Used By

- **read-frontmatter** - Uses list-docs.js for document discovery
- **extract-segment** - Uses list-docs.js for batch operations
- **explore** - Uses list-docs.js for research workflows

## Adding New Shared Scripts

When creating a new shared utility:

1. Place it in `shared/scripts/`
2. Make it executable: `chmod +x script.js`
3. Document it in this README
4. Export functions for module usage
5. Support both CLI and module usage patterns

## Example Integration

```javascript
// Example: Scan all documents for a keyword

const { listDocs } = require('../shared/scripts/list-docs.js');
const { extractFrontmatter } = require('./extract-frontmatter.js');

async function findDocumentsWithKeyword(keyword) {
  const docs = listDocs({ json: false });
  const results = [];

  for (const doc of docs) {
    const fm = extractFrontmatter(doc, { json: true });
    if (fm.keywords && fm.keywords.includes(keyword)) {
      results.push({
        file: doc,
        title: fm.title,
        description: fm.description
      });
    }
  }

  return results;
}
```
