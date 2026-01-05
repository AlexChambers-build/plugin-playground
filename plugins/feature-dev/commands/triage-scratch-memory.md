---
description: Review scratch-memory files and promote valuable knowledge to .ai-docs documentation
argument-hint: "[feature-dir] [--all] [--quality-threshold high|medium|low]"
Allowed-tools: Read, Task, Glob, Bash, TodoWrite, Write, Grep
---

# Triage Scratch Memory: $ARGUMENTS

Extract valuable knowledge from scratch-memory.md files and promote it to the .ai-docs knowledge base.

**Documentation Standard**: All promoted knowledge MUST follow the **AI-DOCS-FRONTMATTER-STANDARD.md** for proper metadata structure, comprehensive patterns[], and accurate sections[] with line numbers. This ensures optimal discoverability through the scoring algorithm.

## Variables

**FEATURE_DIR**: $1 (optional)
- Specific feature directory to triage
- Example: "feats/add-user-authentication"
- If not provided and --all not specified, prompts user

**ALL_FLAG**: --all (optional)
- Process all scratch-memory files in feats/ directory
- Example: "/triage-scratch-memory --all"

**QUALITY_THRESHOLD**: --quality-threshold (optional)
- Values: high, medium, low
- Default: high
- Controls what content gets promoted
  - **high**: Only clearly valuable, reusable patterns
  - **medium**: Include moderately valuable insights
  - **low**: Promote most content except obvious project-specifics

**AI_DOCS_DIR**: /home/alex/code/claude-playground/plugins/.ai-docs
- Target directory for knowledge base documentation

**TRIAGE_REPORT_FILE**: {FEATURE_DIR}/triage-report.md or ./triage-report.md
- Generated report of all knowledge promotions

## Instructions

This command orchestrates knowledge extraction through a 5-phase workflow with user approval gates.

### Phase 1: Discovery & Validation

**Goal**: Find scratch-memory files and validate they exist

1. **Parse Arguments**
   - Check for FEATURE_DIR in $1
   - Check for --all flag in $ARGUMENTS
   - Check for --quality-threshold in $ARGUMENTS (extract value)
   - Set QUALITY_THRESHOLD default to "high" if not specified

2. **Find Scratch Memory Files**

   **If FEATURE_DIR provided**:
   ```bash
   # Check if feature directory exists
   if [ ! -d "$FEATURE_DIR" ]; then
     echo "Error: Feature directory not found: $FEATURE_DIR"
     exit 1
   fi

   # Check for scratch-memory.md
   SCRATCH_FILES=["$FEATURE_DIR/scratch-memory.md"]
   if [ ! -f "$FEATURE_DIR/scratch-memory.md" ]; then
     echo "Error: No scratch-memory.md found in $FEATURE_DIR"
     echo "Scratch memory files are created during feature planning (/feat-dev-plan)"
     exit 1
   fi
   ```

   **If --all flag**:
   ```bash
   # Find all scratch-memory.md files in feats/
   find feats/ -type f -name "scratch-memory.md"
   # Filter out already triaged (check for <!-- TRIAGED: --> marker)
   ```

   **If no arguments**:
   ```bash
   # Prompt user or show usage
   echo "Usage: /triage-scratch-memory [feature-dir] [--all] [--quality-threshold high|medium|low]"
   exit 1
   ```

3. **Check for Already Triaged**
   For each scratch-memory file found:
   ```bash
   # Check if file starts with <!-- TRIAGED: -->
   head -n 1 $FILE | grep "<!-- TRIAGED:"
   # If found, skip or warn user
   ```

4. **Initialize Todo List**
   Use TodoWrite to create tracking for all 5 phases:
   - Phase 1: Discovery & Validation (mark completed)
   - Phase 2: Content Analysis
   - Phase 3: Knowledge Extraction
   - Phase 4: Document Updates
   - Phase 5: Report Generation

5. **Display Discovery Summary**
   ```markdown
   ## Phase 1 Complete: Discovery

   **Files Found**: [count]
   **Quality Threshold**: [high/medium/low]
   **Target Directory**: [AI_DOCS_DIR]

   **Scratch Memory Files**:
   - [file1]
   - [file2]

   **Next**: Analyze content in each file

   Ready to proceed to Phase 2? (Please confirm)
   ```

   **WAIT FOR USER APPROVAL**

### Phase 2: Content Analysis

**Goal**: Read scratch-memory files and assess content quality

1. **Mark Phase 2 in_progress** in TodoWrite

2. **Read Each Scratch Memory File**
   ```bash
   # For each file in SCRATCH_FILES
   cat $FILE
   ```

3. **Analyze Content Structure**
   For each file:
   - Count which of the 8 categories have content
   - Estimate quality (look for rationales, patterns, decisions)
   - Identify potentially valuable items
   - Note any empty or low-value categories

4. **Quality Pre-Filter**
   Based on QUALITY_THRESHOLD:
   - **high**: Look for clear patterns with rationale, reusable approaches
   - **medium**: Include useful insights even if somewhat project-specific
   - **low**: Include most content with any potential value

5. **Display Analysis Summary**
   ```markdown
   ## Phase 2 Complete: Content Analysis

   **Files Analyzed**: [count]

   ### File: [feature1]/scratch-memory.md
   **Categories with Content**: [count]/8
   - Domain Concepts: [X items]
   - Technical Patterns: [X items]
   - Decisions & Rationale: [X items]
   - Reusable Solutions: [X items]

   **Initial Assessment**: [HIGH VALUE / MEDIUM VALUE / LOW VALUE]
   **Estimated Patterns**: [count] patterns likely to be promoted

   ### File: [feature2]/scratch-memory.md
   [Same structure]

   **Next**: Spawn document-writer agent to extract knowledge

   Ready to proceed to Phase 3? (Please confirm)
   ```

   **WAIT FOR USER APPROVAL**

### Phase 3: Knowledge Extraction

**Goal**: Spawn document-writer agent to process content and extract patterns

1. **Mark Phase 3 in_progress** in TodoWrite

2. **Spawn Document-Writer Agent**

   For each scratch-memory file, use Task tool:
   ```
   Task tool:
     subagent_type: "feature-dev:document-writer"
     description: "Extract knowledge from scratch-memory"
     prompt: "Extract valuable, reusable knowledge from the following scratch-memory file.

   **CRITICAL**: Before starting, read the frontmatter standard at:
   plugins/feature-dev/skills/AI-DOCS-FRONTMATTER-STANDARD.md

   Follow this standard strictly for all metadata generation. Pay special attention to:
   - Comprehensive patterns[] with ALL variations (exact match = +5 scoring)
   - Exact domain enum values (general|backend|frontend|security|database|deployment|testing|architecture)
   - keywords[] for supplementary search terms
   - sections[] with exact line numbers (verify with Read tool)

   **Scratch Memory File**: [file path]
   **Quality Threshold**: [high/medium/low]
   **Existing .ai-docs Files**: [list from glob]

   Please analyze all 8 categories in the scratch memory:
   1. Domain Concepts
   2. Technical Patterns
   3. Integration Points
   4. Gotchas & Constraints
   5. Decisions & Rationale
   6. Assumptions
   7. Questions & Unknowns
   8. Reusable Solutions

   For each valuable insight:
   - Extract the core pattern or concept
   - Abstract project-specific details to general principles
   - Determine target .ai-docs document (existing or new)
   - Format with proper structure
   - **CRITICAL**: For patterns[] field, include ALL variations and related terms
     - Example: authentication → [authentication, auth, jwt, json-web-tokens, oauth]
     - This is critical for the scoring algorithm (exact match = +5 points)

   Apply the quality threshold: only promote items that meet the '[threshold]' standard.

   Return a structured extraction summary with:
   - All patterns extracted WITH comprehensive variation lists
   - Target documents for each pattern
   - Items not promoted (with reasons)
   - Recommendations for document updates
   - Frontmatter updates required (following AI-DOCS-FRONTMATTER-STANDARD.md)
     - Comprehensive patterns[] with all variations
     - keywords[] for supplementary terms
     - sections[] with exact line numbers
     - Correct domain enum values

   This is for the feature-dev plugin knowledge base."
   ```

3. **Collect Agent Responses**
   Store all agent outputs for processing in Phase 4

4. **Display Extraction Summary**
   ```markdown
   ## Phase 3 Complete: Knowledge Extraction

   **Files Processed**: [count]
   **Total Patterns Extracted**: [count]

   ### Extraction Results

   **High Value Patterns**: [count]
   - [pattern-name] → [target-doc.md]
   - [pattern-name] → [target-doc.md]

   **Medium Value Patterns**: [count]
   - [pattern-name] → [target-doc.md]

   **Items Not Promoted**: [count]
   - [brief reason counts]

   ### Recommended Document Updates

   **Existing Documents**:
   - backend-best-practices.md: [count] patterns to add
   - frontend-patterns.md: [count] patterns to add

   **New Documents**:
   - integration-patterns.md: [count] patterns

   **Next**: Apply updates to .ai-docs

   Ready to proceed to Phase 4? (Please confirm)
   ```

   **WAIT FOR USER APPROVAL**

### Phase 4: Document Updates

**Goal**: Apply knowledge to .ai-docs with proper structure

1. **Mark Phase 4 in_progress** in TodoWrite

2. **Process Agent Recommendations**
   For each pattern to be promoted:

   **For Existing Documents**:
   ```bash
   # Read existing document
   cat $AI_DOCS_DIR/[document].md

   # Check if pattern already exists
   grep "^## [Pattern Name]" $AI_DOCS_DIR/[document].md

   # If exists: MERGE content (add new insights to existing section)
   # If not exists: INSERT new section
   ```

   **Merge Strategy** (when pattern exists):
   - Read existing pattern section
   - Combine new insights with existing content
   - Preserve all valuable information
   - Update "When to Use" if new use cases
   - Enhance "Tradeoffs" if new considerations
   - Add to "Related Patterns" if new connections

   **Insert Strategy** (new pattern):
   - Find appropriate section location
   - Insert formatted pattern content
   - Maintain document flow and organization

3. **Update Frontmatter** (Following AI-DOCS-FRONTMATTER-STANDARD.md)
   For each modified document:
   ```yaml
   # Add new patterns to patterns list (COMPREHENSIVE - include ALL variations)
   patterns:
     # ... existing patterns ...
     - new-pattern-name
     - pattern-variation-1
     - pattern-variation-2
     - related-technology-name

   # Add keywords if applicable (lowercase supplementary terms)
   keywords:
     # ... existing keywords ...
     - abbreviation
     - synonym

   # Update sections array with EXACT line numbers (verify with Read tool)
   sections:
     - name: "New Pattern Name"
       line_start: N
       line_end: M
       summary: "Descriptive summary with searchable terms, mention code if present"

   # Update last_updated
   last_updated: YYYY-MM-DD

   # Recalculate line_count
   line_count: N

   # Add related documents if cross-references exist
   related:
     - related-doc.md
   ```

   **Validation Checklist**:
   - ✅ patterns[] includes all variations and related terms (for +5 scoring)
   - ✅ domain uses exact enum value (general|backend|frontend|security|database|deployment|testing|architecture)
   - ✅ sections[] line numbers verified with Read tool
   - ✅ sections[] summaries include searchable terms
   - ✅ complexity is basic|intermediate|advanced
   - ✅ line_count matches `wc -l` output

4. **Create New Documents** (if recommended)
   Follow AI-DOCS-FRONTMATTER-STANDARD.md structure:
   ```markdown
   ---
   domain: [general|backend|frontend|security|database|deployment|testing|architecture]
   title: "[Document Title]"
   description: "[1-2 sentences mentioning key patterns]"
   patterns:
     - pattern-one
     - pattern-one-variation
     - pattern-two
     - pattern-two-variation
     - related-technology
   keywords:
     - lowercase-term
     - abbreviation
   sections:
     - name: "[Pattern Name]"
       line_start: N
       line_end: M
       summary: "[Descriptive with searchable terms, mention code if present]"
   complexity: [basic|intermediate|advanced]
   line_count: N
   last_updated: YYYY-MM-DD
   related:
     - related-doc.md
   ---

   # [Document Title]

   ## Overview
   [Introduction to the patterns in this document]

   [Pattern sections follow]
   ```

   **IMPORTANT**: Ensure comprehensive patterns[] list with all variations for optimal discovery

5. **Track All Changes**
   Keep detailed log of:
   - Which documents were modified
   - Which patterns were added
   - Which patterns were merged
   - Which documents were created
   - Any errors or warnings

6. **Display Update Summary**
   ```markdown
   ## Phase 4 Complete: Document Updates

   **Documents Modified**: [count]
   **Documents Created**: [count]
   **Total Patterns Added**: [count]

   ### Modified Documents

   **backend-best-practices.md**:
   - Added: confirmation-modal-pattern
   - Added: immutable-state-updates
   - Merged: service-layer-error-handling (combined with existing)
   - Updated frontmatter: 3 new patterns, sections updated

   **frontend-patterns.md**:
   - Added: react-hooks-state-management
   - Updated frontmatter: 1 new pattern

   ### Created Documents

   **integration-patterns.md**:
   - New document with 4 patterns
   - Domain: general
   - 156 lines

   **Next**: Generate triage report

   Ready to proceed to Phase 5? (Please confirm)
   ```

   **WAIT FOR USER APPROVAL**

### Phase 5: Report Generation & Cleanup

**Goal**: Generate comprehensive triage report and mark scratch-memory as triaged

1. **Mark Phase 5 in_progress** in TodoWrite

2. **Generate Triage Report**

   Create TRIAGE_REPORT_FILE with Write tool:
   ```markdown
   # Knowledge Triage Report

   **Date**: [YYYY-MM-DD HH:MM:SS]
   **Quality Threshold**: [high/medium/low]
   **Files Processed**: [count]
   **Total Patterns Promoted**: [count]

   ---

   ## Executive Summary

   Extracted [count] valuable patterns from [count] scratch-memory files and promoted them to the .ai-docs knowledge base. [count] documents were updated and [count] new documents were created.

   **Key Achievements**:
   - [count] architectural patterns documented
   - [count] design decisions with rationale preserved
   - [count] reusable solutions identified
   - [count] integration patterns captured

   ---

   ## Promoted Knowledge by Source

   ### [feature1]/scratch-memory.md

   **Patterns Extracted**: [count]

   #### High Value
   - **confirmation-modal-pattern** → backend-best-practices.md
     - Source: Decisions & Rationale
     - Value: Reusable UI pattern for destructive actions

   - **immutable-state-updates** → frontend-patterns.md
     - Source: Technical Patterns
     - Value: Critical React state management approach

   #### Medium Value
   - **file-based-storage-considerations** → backend-best-practices.md (merged)
     - Source: Gotchas & Constraints
     - Value: Tradeoffs for simple storage approaches

   ### [feature2]/scratch-memory.md
   [Same structure]

   ---

   ## Document Updates

   ### Modified Documents

   #### backend-best-practices.md
   **Patterns Added**: 3
   - confirmation-modal-pattern (NEW)
   - immutable-state-updates (NEW)
   - file-based-storage-considerations (MERGED with existing content)

   **Frontmatter Updates**:
   - Added 3 patterns to patterns list
   - Added 2 sections to sections array
   - Updated line_count: 850 → 923
   - Updated last_updated: 2026-01-02

   #### frontend-patterns.md
   **Patterns Added**: 1
   - react-hooks-state-management (NEW)

   **Frontmatter Updates**:
   - Added 1 pattern to patterns list
   - Added 1 section to sections array
   - Updated line_count: 645 → 701
   - Updated last_updated: 2026-01-02

   ### Created Documents

   #### integration-patterns.md
   **Domain**: general
   **Patterns**: 4
   - rest-api-design-pattern
   - fetch-api-integration
   - json-file-storage
   - backend-frontend-contract

   **Line Count**: 156
   **Complexity**: intermediate

   ---

   ## Items Not Promoted

   **Total**: [count]

   ### Too Project-Specific
   - "backend/data/todos.json storage location" - File path without generalization
   - "App.jsx:82-90 implementation" - Specific line references

   ### Low Value
   - "TODO: Add tests" - Incomplete thought
   - "Need to fix styling" - Temporary note

   ### Incomplete
   - "Consider caching..." - Unresolved question

   ---

   ## Quality Metrics

   **Extraction Rate**: [count promoted] / [count analyzed] = [percentage]%
   **Quality Distribution**:
   - High Value: [count] ([percentage]%)
   - Medium Value: [count] ([percentage]%)
   - Low Value: [count] ([percentage]%)

   **Category Distribution**:
   - Technical Patterns: [count] patterns
   - Decisions & Rationale: [count] patterns
   - Reusable Solutions: [count] patterns
   - Integration Points: [count] patterns
   - Gotchas & Constraints: [count] patterns
   - Domain Concepts: [count] patterns
   - Assumptions: [count] patterns
   - Questions & Unknowns: [count] patterns

   ---

   ## Next Steps

   1. ✅ Knowledge has been promoted to .ai-docs
   2. 🔍 Review updated documents for accuracy
   3. 🔄 Scratch-memory files marked as triaged
   4. 📚 New patterns now available for /research and /explore commands
   5. 🧪 Consider testing patterns in new features

   ---

   ## Scratch Memory Files Processed

   All processed files have been marked as triaged:
   - [feature1]/scratch-memory.md - TRIAGED
   - [feature2]/scratch-memory.md - TRIAGED

   Original content preserved for reference.
   ```

3. **Mark Scratch Memory Files as Triaged**

   For each processed scratch-memory file:
   ```bash
   # Read existing content
   CONTENT=$(cat $FILE)

   # Prepend triaged marker
   echo "<!-- TRIAGED: $(date +%Y-%m-%d) - Knowledge promoted to .ai-docs -->" > $FILE.tmp
   echo "" >> $FILE.tmp
   echo "$CONTENT" >> $FILE.tmp
   mv $FILE.tmp $FILE
   ```

4. **Mark Phase 5 completed** in TodoWrite

5. **Display Final Summary**
   ```markdown
   ## ✅ Triage Complete: Knowledge Successfully Promoted

   **Files Processed**: [count]
   **Patterns Promoted**: [count]
   **Documents Updated**: [count]
   **Documents Created**: [count]

   ### Key Achievements

   📚 **Knowledge Base Enhanced**:
   - [count] new patterns documented
   - [count] existing patterns enriched
   - [count] domains covered

   📄 **Documents Modified**:
   - backend-best-practices.md (+[count] patterns)
   - frontend-patterns.md (+[count] patterns)
   - [new-doc].md (created)

   🎯 **Quality Metrics**:
   - Extraction Rate: [percentage]%
   - High Value: [count] patterns
   - Medium Value: [count] patterns

   📋 **Report Location**: [TRIAGE_REPORT_FILE]

   ### What's Next?

   1. Review the triage report for details: `cat [TRIAGE_REPORT_FILE]`
   2. Verify updated .ai-docs: `ls -la [AI_DOCS_DIR]`
   3. Test with /research to query new patterns
   4. Scratch-memory files marked as triaged

   ✨ Your project knowledge base is now richer and more reusable!
   ```

## Error Handling

### No Scratch Memory Files Found
```
❌ No scratch-memory files found

Usage: /triage-scratch-memory [feature-dir] [--all] [--quality-threshold high|medium|low]

Examples:
  /triage-scratch-memory feats/my-feature
  /triage-scratch-memory --all
  /triage-scratch-memory feats/my-feature --quality-threshold medium

Note: Scratch-memory files are created during feature planning (/feat-dev-plan)
```

### Already Triaged
```
⚠️  File already triaged: [file]

This scratch-memory was triaged on [date].

Options:
  - View triage report for details
  - Re-triage with: /triage-scratch-memory [feature-dir] --force
  - Skip and continue with other files
```

### Agent Failure
```
❌ Knowledge extraction failed for [file]

The document-writer agent encountered an error.
Possible issues:
- Malformed scratch-memory content
- Empty or corrupted file
- Agent timeout

Recovery:
  1. Verify file is readable: cat [file]
  2. Check file has valid content
  3. Try again with: /triage-scratch-memory [feature-dir]
  4. Report issue if problem persists
```

### .ai-docs Write Failure
```
❌ Failed to update [document.md]

Could not write to .ai-docs directory.
Possible issues:
- Permission denied
- Disk space issue
- Malformed document structure

Recovery:
  1. Check permissions: ls -la [AI_DOCS_DIR]
  2. Verify disk space: df -h
  3. Review triage report for what was attempted
  4. Manual update may be required
```

## Integration with Workflow

Complete feature development lifecycle:

```bash
# 1. Plan feature
/feat-dev-plan "Add authentication"
# → Creates: plan.md, tasks.md, scratch-memory.md

# 2. Build feature
/feat-plan-build feats/add-authentication
# → Updates: scratch-memory.md, creates: development-report.md

# 3. Review code
/review feats/add-authentication
# → Creates: code-review.md

# 4. Fix issues
/review-fix feats/add-authentication/code-review.md
# → Updates: scratch-memory.md

# 5. Triage knowledge (NEW)
/triage-scratch-memory feats/add-authentication
# → Promotes knowledge to .ai-docs
# → Creates: triage-report.md
# → Marks: scratch-memory.md as triaged

# 6. Knowledge now available
/research "authentication patterns"
# → Finds newly documented patterns
```

## Example Usage

```bash
# Triage single feature
/triage-scratch-memory feats/delete-task

# Triage all features
/triage-scratch-memory --all

# Triage with medium threshold
/triage-scratch-memory feats/my-feature --quality-threshold medium

# Triage all with low threshold
/triage-scratch-memory --all --quality-threshold low
```

## Notes

- **Auto-write mode**: Documents are updated automatically but full audit trail in report
- **Merge strategy**: When patterns exist, new insights are combined with existing content
- **Quality first**: Default "high" threshold ensures only valuable patterns are promoted
- **Preservation**: Original scratch-memory content kept for reference
- **Integration**: Promoted patterns immediately available to /research and /explore
- **Frontmatter Compliance**: All updates strictly follow AI-DOCS-FRONTMATTER-STANDARD.md:
  - Comprehensive patterns[] with ALL variations (critical for +5 exact match scoring)
  - Exact line numbers for sections[] (verified with Read tool)
  - Correct domain enum values
  - keywords[] for supplementary search terms
  - This ensures maximum discoverability and proper knowledge retrieval