---
Allowed-tools: Read, Grep, Glob, Task, TodoWrite, AskUserQuestion, Write, Bash
argument-hint: "[documentation-topic] [@context-files...]"
description: "Create comprehensive .ai-docs documentation through intelligent topic analysis and interactive information gathering"
---

# Purpose

Guide the creation of .ai-docs documentation through a structured, interactive workflow that thinks deeply about what needs to be documented, proposes topics to the user, and gathers information efficiently using minimal-context tasks for each topic.

This command helps users create high-quality documentation that adheres to the AI-DOCS-FRONTMATTER-STANDARD, with comprehensive patterns[] fields for optimal search scoring, exact section line numbers, and proper domain categorization.

## Variables

DOCUMENTATION_TOPIC: $1
- The initial description of what to document
- Used for: Understanding the scope and deriving the document name
- Required: If not provided, will prompt user interactively
- Example: "authentication patterns", "API design guidelines", "state management approaches"

CONTEXT_FILES: $2, $3, $4, ...
- Optional file paths (using @ prefix) for additional context
- Used for: Analyzing existing code to extract patterns and examples
- Example: @backend/src/auth.ts @frontend/src/Login.jsx @docs/architecture.md

DOC_NAME: (derived from DOCUMENTATION_TOPIC)
- Automatically generated kebab-case name for the documentation file
- Used for: Creating the output filename
- Example: "authentication patterns" → "authentication-patterns"

OUTPUT_FILE: .ai-docs/{DOC_NAME}.md
- Target location for the generated documentation
- Used for: Final document output location
- Example: .ai-docs/authentication-patterns.md

SCRATCH_MEMORY_FILE: ./write-docs-scratch-memory.md
- Temporary file for capturing insights during the documentation process
- Used for: Tracking decisions, patterns discovered, and metadata
- Automatically cleaned up after completion

## Core Principles

- **Deep Analysis**: Think thoroughly about what topics need documentation before proposing to user
- **User Control**: Let users select topics, provide information sources, and review before finalizing
- **Context Minimization**: Each topic gets its own small-context Task agent to prevent context bloat
- **Smart Merging**: Intelligently merge new content with existing documentation rather than overwriting
- **Quality First**: Follow AI-DOCS-FRONTMATTER-STANDARD strictly for optimal searchability
- **Progressive Disclosure**: Start broad (topics), drill down (details), assemble (final doc)
- **Use TodoWrite**: Track all progress throughout documentation creation
- **Use AskUserQuestion**: ALWAYS use for structured user interaction

## Instructions

You are a technical documentation expert creating high-quality knowledge base documentation. Think deeply about the documentation topic and what would make it most useful for future reference and search.

Follow this systematic five-phase approach, getting user approval before moving to each subsequent phase:

### Phase 1: Topic Discovery & Analysis

**Goal**: Analyze the request and discover potential documentation topics

1. **Create comprehensive todo list** tracking all five phases using TodoWrite

2. **Parse Arguments**
   - Extract DOCUMENTATION_TOPIC from $1
   - If missing or unclear, use AskUserQuestion to ask:
     - What area do you want to document?
     - What problem does this documentation solve?
     - Who is the intended audience?
     - Any specific patterns or approaches to cover?

3. **Derive DOC_NAME**
   - Convert DOCUMENTATION_TOPIC to lowercase
   - Replace spaces with hyphens
   - Remove special characters (keep only alphanumeric and hyphens)
   - Example: "Authentication & Authorization Patterns" → "authentication-authorization-patterns"

4. **Read Context Files** (if provided)
   Use Read tool for each @file to understand:
   - Technologies and frameworks used
   - Patterns and approaches implemented
   - Code structure and organization
   - Best practices evident in the code

5. **Initialize Scratch Memory**
   Use Write tool to create SCRATCH_MEMORY_FILE:
   ```markdown
   # Write Docs Scratch Memory: {DOC_NAME}

   ## Documentation Goal
   <!-- What this documentation aims to achieve -->

   ## Target Document
   - File: .ai-docs/{DOC_NAME}.md
   - Domain: [TBD]
   - Complexity: [TBD]

   ## Topics Considered
   <!-- List of potential topics identified -->

   ## Context Analyzed
   <!-- Files read and key takeaways -->

   ## Decisions & Rationale
   <!-- Key decisions made during documentation creation -->

   ## Patterns Identified
   <!-- Patterns to include in frontmatter patterns[] -->
   ```

6. **Deep Topic Analysis**
   Think deeply about what should be documented. Consider:

   **Core Concepts & Patterns** (2-3 topics)
   - Fundamental concepts that need explanation
   - Key patterns and architectural approaches
   - Core abstractions and their purpose

   **Implementation Details** (1-2 topics)
   - How to implement the patterns
   - Configuration and setup requirements
   - Code structure and organization

   **Best Practices & Guidelines** (1-2 topics)
   - Recommended approaches and conventions
   - Code quality standards
   - Performance considerations

   **Common Pitfalls & Gotchas** (1 topic)
   - Known issues and edge cases
   - Anti-patterns to avoid
   - Troubleshooting guidance

   **Testing & Security** (0-1 topics, if applicable)
   - Testing strategies
   - Security considerations

   Generate 5-8 specific, actionable topics based on this analysis. Each topic should:
   - Have a clear, descriptive name
   - Include a 1-2 sentence description
   - Indicate estimated information source (files/user/both)
   - Be focused enough for a single small-context task

7. **Update Scratch Memory**
   Add identified topics to SCRATCH_MEMORY_FILE under "Topics Considered"

8. **Display Discovery Summary**
   ```markdown
   ## Phase 1 Complete: Topic Discovery

   **Documentation Target**: {DOC_NAME}.md
   **Context Files Analyzed**: {count} files
   **Topics Identified**: {count} topics

   ### Proposed Topics:
   1. **[Topic Name]** - [Brief description]
   2. **[Topic Name]** - [Brief description]
   ...

   **Next**: User will select which topics to include (Phase 2)

   Ready to proceed to Phase 2? (Please confirm)
   ```

   **WAIT FOR USER APPROVAL**

### Phase 2: Interactive Topic Selection

**Goal**: Let user select which topics to document (maximum 8)

1. **Mark Phase 2 in_progress** in TodoWrite

2. **Use AskUserQuestion with multiSelect**
   Present discovered topics for user selection:

   ```javascript
   AskUserQuestion tool:
   {
     "questions": [
       {
         "question": "Select topics to include in the documentation (maximum 8):",
         "header": "Doc Topics",
         "multiSelect": true,
         "options": [
           {
             "label": "[Topic 1 Name]",
             "description": "[Topic 1 description with information source hint]"
           },
           {
             "label": "[Topic 2 Name]",
             "description": "[Topic 2 description]"
           },
           // ... up to 8 topics
         ]
       }
     ]
   }
   ```

   **Important**: Always include all identified topics as options (up to 8). User can select subset.

3. **Process User Selection**
   - Count selected topics
   - If more than 8 selected, ask user to narrow down to 8
   - If "Other" was selected (via custom input), parse additional topics
   - Validate each topic is clear and actionable

4. **Prioritize Topics**
   Order selected topics by logical flow:
   - Fundamentals and core concepts first
   - Implementation details second
   - Best practices and guidelines third
   - Pitfalls and troubleshooting last

5. **Update Scratch Memory**
   Record final topic selection and prioritization

6. **Display Selection Summary**
   ```markdown
   ## Phase 2 Complete: Topic Selection

   **Topics Selected**: {count} of {total} proposed

   ### Documentation Outline:
   1. [Topic Name] - [Source: files/user/hybrid]
   2. [Topic Name] - [Source: files/user/hybrid]
   ...

   **Next**: Gather detailed information for each topic (Phase 3)

   Ready to proceed to Phase 3? (Please confirm)
   ```

   **WAIT FOR USER APPROVAL**

### Phase 3: Information Gathering

**Goal**: Gather detailed information for each topic using minimal-context Task agents

**CRITICAL**: Each topic gets its own Task agent to keep context small!

1. **Mark Phase 3 in_progress** in TodoWrite

2. **For Each Selected Topic, Spawn a Task**

   Process topics in batches of 3 for parallel execution:
   - Batch 1: Topics 1-3 (spawn in parallel)
   - Wait for completion
   - Batch 2: Topics 4-6 (spawn in parallel)
   - Wait for completion
   - Batch 3: Topics 7-8 (spawn in parallel)

   For each topic, use Task tool:
   ```
   Task tool:
     subagent_type: "general-purpose"
     model: "sonnet"
     description: "Gather info: {TOPIC_NAME}"
     prompt: "Gather comprehensive information for documenting this topic:

**Topic**: {TOPIC_NAME}
**Description**: {TOPIC_DESCRIPTION}
**Documentation Goal**: Creating .ai-docs documentation for {DOCUMENTATION_TOPIC}

## Your Task

First, determine the best way to gather information for this topic.

Use AskUserQuestion with these options:
1. 'Analyze code files' - User will provide file paths to analyze
2. 'User will describe' - User will provide a written description
3. 'Hybrid approach' - Combination of files and user description
4. 'Search codebase' - Search for relevant patterns using Grep/Glob
5. 'Skip this topic' - Don't document this topic

Based on the user's response:

**If 'Analyze code files':**
- Ask user for file paths using AskUserQuestion
- Read each file using Read tool
- Extract relevant patterns, code examples, approaches
- Identify best practices evident in the code

**If 'User will describe':**
- Use AskUserQuestion to ask:
  - What is this topic about? (2-3 paragraphs)
  - What are the key concepts?
  - Are there implementation details to include?
  - Any best practices or pitfalls?
  - Related patterns or technologies?

**If 'Hybrid approach':**
- Do both file analysis AND user description
- Combine insights from code with user explanations

**If 'Search codebase':**
- Use Grep to search for relevant patterns
- Use Glob to find related files
- Read and analyze found code
- Extract patterns and examples

**If 'Skip this topic':**
- Return: { \"topic\": \"{TOPIC_NAME}\", \"status\": \"skipped\", \"reason\": \"user requested skip\" }

## Required Output Format

Return structured content in this exact format:

```json
{
  \"topic\": \"{TOPIC_NAME}\",
  \"status\": \"completed\",
  \"content\": {
    \"overview\": \"[2-3 paragraph overview of the topic]\",
    \"key_concepts\": [
      \"Concept 1 with brief explanation\",
      \"Concept 2 with brief explanation\"
    ],
    \"implementation_details\": \"[How to implement, configure, or use this pattern]\",
    \"code_examples\": [
      {
        \"language\": \"typescript\",
        \"code\": \"[complete code example]\",
        \"explanation\": \"[what this demonstrates]\"
      }
    ],
    \"best_practices\": [
      \"Best practice 1\",
      \"Best practice 2\"
    ],
    \"common_pitfalls\": [
      \"Pitfall 1 and how to avoid it\",
      \"Pitfall 2 and how to avoid it\"
    ],
    \"related_patterns\": [
      \"Related pattern 1\",
      \"Related pattern 2\"
    ],
    \"keywords\": [
      \"keyword1\",
      \"keyword2\"
    ]
  }
}
```

Be thorough and comprehensive. This information will be used to create professional documentation."
   ```

3. **Collect Task Results**
   Store each completed task's output in a list for Phase 4:
   ```javascript
   GATHERED_INFORMATION = [
     { topic: "Topic 1", status: "completed", content: {...} },
     { topic: "Topic 2", status: "completed", content: {...} },
     ...
   ]
   ```

4. **Handle Failed Tasks**
   If a task fails:
   - Check error message
   - Decide if retry is possible
   - If retry fails, mark topic as "failed" and continue
   - User will be notified in summary

5. **Update Scratch Memory**
   Add gathered information summary to SCRATCH_MEMORY_FILE

6. **Display Gathering Summary**
   ```markdown
   ## Phase 3 Complete: Information Gathering

   **Topics Processed**: {count}
   **Successful**: {success_count}
   **Failed**: {failed_count}
   **Skipped**: {skipped_count}

   ### Gathered Information Summary:
   - {Topic 1}: ✅ Complete ({source})
   - {Topic 2}: ✅ Complete ({source})
   - {Topic 3}: ⚠️ Partial ({issue})

   **Next**: Assemble documentation from gathered information (Phase 4)

   Ready to proceed to Phase 4? (Please confirm)
   ```

   **WAIT FOR USER APPROVAL**

### Phase 4: Document Assembly

**Goal**: Combine gathered information into well-structured .ai-docs documentation

1. **Mark Phase 4 in_progress** in TodoWrite

2. **Check for Existing Documentation**
   ```bash
   # Check if target document already exists
   if [ -f ".ai-docs/{DOC_NAME}.md" ]; then
     MODE="SMART_MERGE"
     EXISTING_CONTENT=$(cat .ai-docs/{DOC_NAME}.md)
   else
     MODE="CREATE_NEW"
     EXISTING_CONTENT=""
   fi
   ```

   Use Glob tool to check: `.ai-docs/{DOC_NAME}.md`

3. **Determine Domain**
   Analyze topics and content to determine appropriate domain:
   - backend: Server, API, database patterns
   - frontend: UI, state management, components
   - security: Authentication, authorization, encryption
   - testing: Test patterns, mocking, coverage
   - architecture: System design, patterns
   - general: Cross-cutting concerns, project setup
   - database: Data modeling, queries, migrations
   - deployment: CI/CD, hosting, monitoring

4. **Spawn Document-Writer Agent**

   Use Task tool to invoke document-writer:
   ```
   Task tool:
     subagent_type: "feature-dev:document-writer"
     model: "sonnet"
     description: "Assemble {DOC_NAME} documentation"
     prompt: "Create comprehensive .ai-docs documentation from gathered information.

**CRITICAL**: First read the frontmatter standard:
File: plugins/feature-dev/skills/AI-DOCS-FRONTMATTER-STANDARD.md

## Task Details

**Target Document**: {DOC_NAME}.md
**Mode**: {MODE} (CREATE_NEW or SMART_MERGE)
**Domain**: {DETERMINED_DOMAIN}
**Complexity**: {basic/intermediate/advanced based on topics}

{If MODE == SMART_MERGE}
**Existing Content**:
```markdown
{EXISTING_CONTENT}
```

**Merge Strategy**:
- Preserve all existing sections and content
- Add new sections for new topics
- Enhance existing sections if new information relates
- Update patterns[] to include new patterns
- Add to keywords[] for new search terms
- Update sections[] with new sections (use -1 placeholders)
- Update last_updated date
{End if}

## Information Gathered

{For each topic in GATHERED_INFORMATION}
### Topic: {topic.topic}
**Status**: {topic.status}

**Overview**: {topic.content.overview}

**Key Concepts**:
{topic.content.key_concepts}

**Implementation Details**: {topic.content.implementation_details}

**Code Examples**:
{topic.content.code_examples}

**Best Practices**:
{topic.content.best_practices}

**Common Pitfalls**:
{topic.content.common_pitfalls}

**Related Patterns**:
{topic.content.related_patterns}

**Keywords**: {topic.content.keywords}

---
{End for}

## Requirements

1. **Frontmatter** (follow AI-DOCS-FRONTMATTER-STANDARD.md EXACTLY):
   - domain: {DETERMINED_DOMAIN} (exact enum value)
   - title: \"{Title Case, 3-7 words}\"
   - description: \"1-2 sentences mentioning key patterns\"
   - patterns: [COMPREHENSIVE list in kebab-case]
     - Include ALL topic names in kebab-case
     - Include ALL variations (e.g., auth, authentication, jwt, json-web-tokens)
     - Include ALL technologies mentioned
     - Include ALL related terms from keywords
     - **CRITICAL**: This drives search scoring (exact match = +5 points)
   - keywords: [lowercase supplementary terms]
   - sections: [with -1 placeholders for line numbers]
     - Each topic should have its own section
     - Include Overview at the start
     - Include Related Documentation at the end
     - Use clear, searchable section names
     - Write descriptive summaries mentioning code/patterns
   - complexity: {basic/intermediate/advanced}
   - line_count: -1 (placeholder for two-pass approach)
   - last_updated: {TODAY_DATE}
   - related: [list of related .ai-docs files if applicable]

2. **Document Structure**:
   ```markdown
   ---
   [frontmatter as above]
   ---

   # {Title}

   ## Overview
   [2-3 paragraphs introducing the documentation scope]

   ## {Topic 1 Name}
   [Content from gathered information]

   ### When to Use
   [Specific scenarios]

   ### Implementation
   [How to implement]

   ```[language]
   [code example]
   ```

   ### Best Practices
   - [practice 1]
   - [practice 2]

   ### Common Pitfalls
   - [pitfall 1]
   - [pitfall 2]

   ## {Topic 2 Name}
   [Same structure]

   ...

   ## Related Documentation
   - [cross-references to other .ai-docs]
   ```

3. **Code Examples**:
   - Include complete, runnable examples
   - Use proper syntax highlighting language tags
   - Add explanatory comments in code
   - Show both good and bad examples where helpful

4. **Quality Standards**:
   - Clear, technical writing
   - Avoid vague statements
   - Include specific examples
   - Proper markdown formatting
   - Searchable section names

## Output

Return the COMPLETE document content with frontmatter and all sections. Do not truncate or summarize."
   ```

5. **Process Agent Output**
   - Extract the complete document content
   - Validate frontmatter structure
   - Ensure patterns[] is comprehensive
   - Verify sections[] has placeholders (-1)

6. **Apply Two-Pass Line Number Approach**

   **Pass 1: Write with Placeholders**
   ```bash
   # Write document with -1 placeholders
   cat > .ai-docs/{DOC_NAME}.md << 'EOF'
   {AGENT_OUTPUT}
   EOF
   ```

   **Pass 2: Calculate Real Line Numbers**
   ```bash
   # Get total line count
   LINE_COUNT=$(wc -l < .ai-docs/{DOC_NAME}.md)

   # Find all section headers with line numbers
   SECTIONS=$(grep -n "^## " .ai-docs/{DOC_NAME}.md)

   # Calculate line ranges for each section
   # Section N starts at line X, ends at line Y (one before next section or EOF)
   ```

   Read the document, find section boundaries, replace all `-1` placeholders with actual line numbers using Edit tool

7. **Validate Document**
   - Check frontmatter has all required fields
   - Verify no -1 placeholders remain
   - Ensure line_count matches actual count
   - Test patterns[] has variations

8. **Update Scratch Memory**
   Record final document statistics

9. **Display Assembly Summary**
   ```markdown
   ## Phase 4 Complete: Document Assembly

   **Mode**: {CREATE_NEW or SMART_MERGE}
   **Document**: .ai-docs/{DOC_NAME}.md
   **Domain**: {domain}
   **Sections**: {count}
   **Patterns Indexed**: {count}
   **Line Count**: {count}

   ### Frontmatter Summary:
   - Domain: {domain}
   - Complexity: {complexity}
   - Patterns: {count} patterns with variations
   - Keywords: {count} search terms
   - Sections: {count} sections with exact line numbers

   **Next**: Finalize and test documentation (Phase 5)

   Ready to proceed to Phase 5? (Please confirm)
   ```

   **WAIT FOR USER APPROVAL**

### Phase 5: Finalization & Integration

**Goal**: Validate documentation and integrate with knowledge base

1. **Mark Phase 5 in_progress** in TodoWrite

2. **Final Validation**

   Read OUTPUT_FILE and verify:
   - Frontmatter compliance with AI-DOCS-FRONTMATTER-STANDARD.md
   - No -1 placeholders remain
   - line_count matches actual file line count
   - All sections[] have valid line ranges
   - patterns[] is comprehensive
   - domain is valid enum value

3. **Test Document Discovery**

   Simulate search scoring to verify patterns[] work:
   ```bash
   # Test exact match scoring (+5 points)
   echo "Testing pattern discovery..."

   # Extract first 3 patterns from frontmatter
   PATTERN1=$(grep -A 20 "^patterns:" .ai-docs/{DOC_NAME}.md | grep "  -" | head -1 | sed 's/.*- //')
   PATTERN2=$(grep -A 20 "^patterns:" .ai-docs/{DOC_NAME}.md | grep "  -" | head -2 | tail -1 | sed 's/.*- //')

   echo "✓ Pattern 1: ${PATTERN1} (exact match should score +5)"
   echo "✓ Pattern 2: ${PATTERN2} (exact match should score +5)"
   ```

4. **Check for Related Documentation Updates**

   If other .ai-docs files are related:
   - List them in the "related" field (done in Phase 4)
   - Consider if cross-references should be added to those docs
   - Inform user of potential updates

5. **Clean Up Scratch Memory**
   ```bash
   # Remove temporary scratch memory file
   rm -f ./write-docs-scratch-memory.md
   ```

6. **Generate Summary Report**
   ```markdown
   ✅ Documentation Complete: {DOC_NAME}.md

   **Location**: .ai-docs/{DOC_NAME}.md
   **Mode**: {CREATE_NEW or Updated existing}

   **Documentation Statistics**:
   - Domain: {domain}
   - Complexity: {complexity}
   - Topics Documented: {count}
   - Sections: {count}
   - Patterns Indexed: {count}
   - Keywords: {count}
   - Line Count: {count}
   - Code Examples: {count}

   **Search Optimization**:
   - Patterns with variations for high scoring
   - Exact line numbers for section extraction
   - Descriptive summaries for relevance matching

   **Integration Points**:
   The documentation is now available for:
   - `/research [topic]` - Search this documentation
   - `/explore` - Reference during codebase exploration
   - `/review` - Cite as best practices
   - `/feat-dev-plan` - Reference during planning

   **Test Search**:
   Try: `/research "{PATTERN1}"` or `/research "{PATTERN2}"`

   **Next Steps**:
   - Test search functionality with `/research`
   - Consider adding cross-references to related docs
   - Share with team for feedback
   ```

7. **Mark Phase 5 complete** in TodoWrite

## Error Handling

### No Topic Provided
```
❌ No documentation topic specified

Usage: /write-docs [topic] [@context-files...]

Examples:
  /write-docs "authentication patterns"
  /write-docs "frontend state management" @src/store.js @src/App.jsx
  /write-docs "API design guidelines"
  /write-docs "error handling strategies" @backend/src/errors/

Provide a clear topic and optional context files to begin.
```

### Task Failures
```
⚠️ Failed to gather information for: {TOPIC}

The information gathering task encountered an error: {ERROR_MESSAGE}

Options:
1. Retry with different approach
2. Skip this topic and continue with others
3. Provide information manually
4. Abort documentation creation

What would you like to do? (Use AskUserQuestion)
```

### Document Write Failure
```
❌ Failed to create documentation

Could not write to .ai-docs directory.

Possible issues:
- Directory doesn't exist (run: mkdir -p .ai-docs)
- Permission denied (check file permissions)
- Disk space full
- Path is invalid

The documentation content has been saved to: ./write-docs-output.md

You can manually move it to: .ai-docs/{DOC_NAME}.md
```

### Invalid Frontmatter
```
⚠️ Validation Warning: Frontmatter Issues Detected

The following issues were found:
- {ISSUE_1}
- {ISSUE_2}

These issues may affect searchability. Options:
1. Auto-fix (recommended)
2. Continue anyway
3. Edit manually

What would you like to do? (Use AskUserQuestion)
```

### Merge Conflicts
```
⚠️ Smart Merge Conflict Detected

Existing content overlaps with new content in section: {SECTION_NAME}

Existing:
{EXISTING_EXCERPT}

New:
{NEW_EXCERPT}

Resolution strategy:
1. Keep existing, add new as separate section
2. Replace existing with new
3. Merge both (combine content)
4. Skip new content

What would you like to do? (Use AskUserQuestion)
```

## Example Usage

### Basic Usage
```bash
# Create new documentation
/write-docs "authentication patterns"

# With context files
/write-docs "React hooks patterns" @frontend/src/hooks/useAuth.js @frontend/src/hooks/useApi.js

# Complex topic
/write-docs "microservices communication patterns" @backend/src/messaging/
```

### Workflow Example
```bash
$ /write-docs "state management patterns" @frontend/src/store.js

Phase 1: Topic Discovery
→ Analyzed 1 context file
→ Identified 6 topics
→ Ready for topic selection

Phase 2: Topic Selection
→ User selected 5 topics
→ Prioritized by logical flow

Phase 3: Information Gathering
→ Spawned 5 Task agents
→ Gathered from code + user descriptions
→ All topics completed successfully

Phase 4: Document Assembly
→ Created new document
→ Domain: frontend
→ 5 sections with 23 patterns
→ Line numbers calculated

Phase 5: Finalization
✅ Documentation Complete!

File: .ai-docs/state-management-patterns.md
Test with: /research "redux patterns"
```

## Integration with Other Commands

### With /research
Created documentation is immediately searchable:
```bash
/write-docs "caching strategies"
# Later...
/research "caching strategies" # Finds your documentation
```

### With /triage-scratch-memory
Extract patterns from scratch files into documentation:
```bash
# After feature development
/triage-scratch-memory feats/my-feature/scratch-memory.md

# Review extracted patterns
# Then create focused documentation
/write-docs "patterns from my-feature"
```

### With /feat-dev-plan
Reference documentation during planning:
```bash
/feat-dev-plan "implement caching"
# Agent will reference .ai-docs/caching-strategies.md
```

### With /review
Documentation serves as best practices reference:
```bash
/review feats/my-feature
# Code-reviewer agent checks against .ai-docs patterns
```

## Notes

- **Progressive Context Management**: Each topic uses a separate Task agent to prevent context bloat
- **Smart Merge**: Preserves existing content while adding new sections
- **Search Optimization**: Comprehensive patterns[] field for high scoring (exact match = +5)
- **Quality Standards**: Follows AI-DOCS-FRONTMATTER-STANDARD.md strictly
- **Two-Pass Line Numbers**: Ensures exact section boundaries for extraction
- **User Control**: Multiple approval gates ensure user satisfaction
- **Flexible Information Gathering**: Supports files, user input, hybrid, or codebase search
- **Error Resilience**: Handles task failures gracefully, continues with available information
- **Integration Ready**: Works seamlessly with research, review, and planning commands