# Testing Knowledge Base Skills with Natural Language

These skills are designed to be invoked through natural language prompts. Here's how to test them:

## Available Skills

1. **read-frontmatter** - Scan document metadata without reading full content
2. **extract-segment** - Extract specific sections using line numbers

## Quick Test Prompts

### Test 1: Read Frontmatter

**Prompt to use:**
```
Read the frontmatter of backend-best-practices.md and tell me if it contains topics about dependency injection
```

**Expected behavior:**
- I should use the Bash tool to run the extract-frontmatter.js script
- Parse the JSON output
- Check the `patterns` field for dependency-injection related topics
- Respond with relevant section information

---

### Test 2: List Available Documents

**Prompt to use:**
```
What documents are available in the .ai-docs directory?
```

**Expected behavior:**
- I should run the list-docs.js script
- Present the list of available markdown files

---

### Test 3: Check Document Topics

**Prompt to use:**
```
Scan all documents in .ai-docs and tell me which ones mention testing
```

**Expected behavior:**
- Run extract-frontmatter.js with --all flag
- Parse all frontmatter data
- Search for "testing" in patterns, keywords, and section names
- Report which documents contain testing content

---

### Test 4: Extract Specific Section

**Prompt to use:**
```
Read the section about service layer best practices from backend-best-practices.md
```

**Expected behavior:**
1. First run extract-frontmatter.js to get section metadata
2. Find "Service Layer Best Practices" section and its line numbers
3. Run extract-segment.js with those line numbers
4. Present the section content to the user

---

### Test 5: Section Discovery

**Prompt to use:**
```
What sections are available in backend-best-practices.md?
```

**Expected behavior:**
- Run extract-frontmatter.js for that document
- Parse the `sections` array
- List all section names with their line ranges

---

### Test 6: Topic Search Across Documents

**Prompt to use:**
```
Check if any documents contain information about caching
```

**Expected behavior:**
- Run extract-frontmatter.js --all
- Search all frontmatter for "caching" in patterns/keywords/sections
- Report which documents and sections cover caching

---

### Test 7: Extract with Context

**Prompt to use:**
```
Show me the dependency injection section from backend-best-practices.md with some context around it
```

**Expected behavior:**
1. Use extract-frontmatter.js to find the section line numbers
2. Run extract-segment.js with --offset flag to include context
3. Present the content with surrounding context

---

### Test 8: Compare Topics

**Prompt to use:**
```
What's the difference between what backend-best-practices.md and frontend-best-practices.md cover?
```

**Expected behavior:**
- Run extract-frontmatter.js on both documents
- Compare their patterns and sections
- Highlight unique and common topics

---

## How the Skills Work

### Behind the Scenes

When you ask a question like "Read the frontmatter of backend-best-practices.md", I should:

1. **Recognize the trigger phrase** - "read the frontmatter" matches the read-frontmatter skill
2. **Use the Bash tool** - Run the appropriate script from `plugins/feature-dev/skills/`
3. **Parse the output** - Extract relevant information from JSON or text output
4. **Answer conversationally** - Don't just dump script output, actually answer your question

### Progressive Disclosure Pattern

For complex queries, I should use multiple skills in sequence:

```
User: "What does the backend document say about error handling?"

Step 1: List docs
→ node shared/scripts/list-docs.js

Step 2: Read frontmatter to find section
→ node read-frontmatter/scripts/extract-frontmatter.js backend-best-practices.md --json

Step 3: Find "Error Handling" section at lines X-Y

Step 4: Extract that section
→ node extract-segment/scripts/extract-segment.js backend-best-practices.md X Y

Step 5: Summarize the content for the user
```

## Testing Checklist

Use these prompts to verify the skills work correctly:

- [ ] Can list all available documents
- [ ] Can read frontmatter from a single document
- [ ] Can read frontmatter from all documents
- [ ] Can check if a document contains specific topics
- [ ] Can find which documents mention a keyword
- [ ] Can list all sections in a document
- [ ] Can extract a specific section by name
- [ ] Can extract a section with context (offset)
- [ ] Can compare topics across documents
- [ ] Uses progressive disclosure (frontmatter → segment) for efficiency

## Common User Queries

These are natural ways users might invoke these skills:

**Discovery:**
- "What docs do we have?"
- "List all documentation files"

**Metadata Scanning:**
- "What's in backend-best-practices.md?"
- "Does this document cover X topic?"
- "Which documents mention Y?"
- "What sections are available?"

**Content Extraction:**
- "Read the X section"
- "Show me the content about Y"
- "Extract lines A to B"
- "Get the Z section with context"

**Comparison:**
- "What's the difference between doc A and doc B?"
- "Which documents cover similar topics?"

## Success Criteria

The skills work correctly when:

1. ✅ I recognize natural language triggers
2. ✅ I use Bash tool to run the appropriate scripts
3. ✅ I parse script output correctly
4. ✅ I provide conversational, helpful responses
5. ✅ I use progressive disclosure (scan → extract) for efficiency
6. ✅ I don't just dump raw script output to the user

## Example Session

```
You: What documents are available?
Me: [Runs list-docs.js] We have 4 documents: backend-best-practices.md,
business-logic.md, frontend-best-practices.md, and technical-decisions.md

You: What topics does backend-best-practices.md cover?
Me: [Runs extract-frontmatter.js] This document covers 47 patterns including:
- Architecture principles (clean architecture, hexagonal architecture)
- Directory structure and naming conventions
- Dependency injection and inversion
- Service layer, controller layer, and data access best practices
- Error handling and testing
- Security, logging, and performance optimization

It has 15 main sections spanning 696 lines.

You: Read the section about dependency injection
Me: [First gets frontmatter to find line numbers, then extracts segment]
Here's what the dependency injection section covers:
[Presents the extracted content in a clear, formatted way]
```
