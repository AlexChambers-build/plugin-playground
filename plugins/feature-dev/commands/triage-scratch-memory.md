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

**Goal**: Apply knowledge to .ai-docs with proper structure using a strict two-pass approach with placeholders

**CRITICAL**: This phase uses placeholders (-1) for line numbers to ensure accuracy after all edits are complete.

---

#### Pass 1: Content and Metadata (WITH PLACEHOLDERS)

**Objective**: Add all content and metadata, but use placeholder values for line numbers.

1. **Mark Phase 4 in_progress** in TodoWrite

2. **Process Agent Recommendations - Add Content**
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

3. **Update Frontmatter Metadata with PLACEHOLDERS**

   For each modified document, update frontmatter:

   ```yaml
   ---
   domain: [general|backend|frontend|security|database|deployment|testing|architecture]
   title: "Document Title"
   description: "Updated description mentioning new patterns"

   patterns:
     # ... existing patterns ...
     - new-pattern-name
     - pattern-variation-1
     - pattern-variation-2
     - related-technology-name

   keywords:
     # ... existing keywords ...
     - new-keyword-1
     - new-keyword-2

   sections:
     - name: "Overview"
       line_start: -1          # PLACEHOLDER - will calculate in Pass 2
       line_end: -1            # PLACEHOLDER - will calculate in Pass 2
       summary: "Overview of the document..."
     - name: "Technology Stack"
       line_start: -1          # PLACEHOLDER
       line_end: -1            # PLACEHOLDER
       summary: "Technology stack details..."
     - name: "New Section Name"
       line_start: -1          # PLACEHOLDER
       line_end: -1            # PLACEHOLDER
       summary: "Description with searchable terms, mention code if present..."
     # ... all other sections with -1 placeholders ...

   complexity: [basic|intermediate|advanced]
   line_count: -1              # PLACEHOLDER - will calculate in Pass 2
   last_updated: YYYY-MM-DD

   related:
     - related-doc.md
   ---
   ```

   **CRITICAL RULES**:
   - ⚠️ **DO NOT** run `wc -l` yet
   - ⚠️ **DO NOT** run `grep -n` yet
   - ⚠️ **ALL** line_start values must be -1
   - ⚠️ **ALL** line_end values must be -1
   - ⚠️ **line_count** must be -1
   - ✅ DO update patterns[], keywords[], domain, description, last_updated
   - ✅ DO provide section names and summaries

4. **Pass 1 Validation Checklist**:
   - ✅ All new content sections added
   - ✅ patterns[] includes ALL variations (comprehensive list with 5+ variations per pattern)
   - ✅ keywords[] includes supplementary terms (lowercase)
   - ✅ domain uses exact enum value (general|backend|frontend|security|database|deployment|testing|architecture)
   - ✅ description updated to mention new patterns
   - ✅ last_updated is current date (YYYY-MM-DD)
   - ✅ sections[] has entries for ALL sections with names and summaries
   - ✅ **All line_start values are -1** (placeholders)
   - ✅ **All line_end values are -1** (placeholders)
   - ✅ **line_count is -1** (placeholder)
   - ⚠️ **Document is NOT ready for use** (placeholders present)

5. **Display Pass 1 Complete Message**:
   ```markdown
   ## Pass 1 Complete: Content and Metadata Added

   **Documents Modified**: [count]
   - [document1].md: Added [N] patterns, updated frontmatter with placeholders
   - [document2].md: Added [N] patterns, updated frontmatter with placeholders

   **Status**: ⚠️ Line numbers are placeholders (-1)
   **State**: Documents contain -1 in line_start, line_end, and line_count
   **Next**: Calculate actual line numbers in Pass 2

   **CHECKPOINT**: All content and metadata edits must be 100% complete before proceeding to Pass 2.
   ```

---

#### Pass 2: Calculate and Replace Line Numbers

**Objective**: Calculate actual line numbers from final document state and replace ALL placeholders.

**⚠️ CRITICAL**: Only start Pass 2 after Pass 1 is 100% complete for ALL documents.

1. **For Each Modified Document, Calculate Line Numbers**

   ```bash
   # Step 1: Get FINAL line count (after all edits)
   FINAL_LINE_COUNT=$(wc -l < /path/to/document.md)
   echo "Final line count: $FINAL_LINE_COUNT"

   # Step 2: Get ALL section headings with line numbers
   grep -n "^## " /path/to/document.md

   # Example output:
   # 146:## Overview
   # 149:## Technology Stack
   # 155:## Directory Structure
   # 620:## User Interaction Patterns
   # 897:## Key Principles Summary
   ```

2. **Calculate line_end for Each Section**

   For each section found by grep:
   - If NOT the last section: `line_end = next_section_line_start - 1`
   - If IS the last section: `line_end = FINAL_LINE_COUNT`

   Example calculation:
   ```
   Section 1: Overview
     line_start: 146
     line_end: 148 (next section 149 - 1)

   Section 2: Technology Stack
     line_start: 149
     line_end: 154 (next section 155 - 1)

   Section N-1: User Interaction Patterns
     line_start: 620
     line_end: 896 (next section 897 - 1)

   Section N: Key Principles Summary (LAST)
     line_start: 897
     line_end: 875 (FINAL_LINE_COUNT)
   ```

3. **Validate Calculated Numbers BEFORE Updating**

   ```bash
   # Validation checks

   for section in sections:
     # Check 1: line_start must be <= line_end
     if [ $line_start -gt $line_end ]; then
       echo "❌ ERROR: Section '$name' has line_start ($line_start) > line_end ($line_end)"
       echo "   This indicates a calculation error - aborting!"
       exit 1
     fi

     # Check 2: Verify line_start actually points to section heading
     actual_line=$(sed -n "${line_start}p" document.md)
     expected="## $name"
     if [[ ! "$actual_line" =~ ^##[[:space:]].*${name}.* ]]; then
       echo "❌ ERROR: Line $line_start doesn't contain section heading for '$name'"
       echo "   Expected something like: $expected"
       echo "   Found: $actual_line"
       exit 1
     fi
   done

   # Check 3: Last section must end at file end
   last_section_end=${sections[-1].line_end}
   if [ $last_section_end -ne $FINAL_LINE_COUNT ]; then
     echo "❌ ERROR: Last section ends at $last_section_end but file has $FINAL_LINE_COUNT lines"
     exit 1
   fi

   echo "✅ All line numbers validated successfully"
   ```

4. **Replace Placeholders with Actual Values**

   Use Edit tool to replace the frontmatter sections[] and line_count:

   ```yaml
   # FIND (with placeholders):
   sections:
     - name: "Overview"
       line_start: -1
       line_end: -1
       summary: "..."
     - name: "Technology Stack"
       line_start: -1
       line_end: -1
       summary: "..."
     # ... more sections ...

   complexity: intermediate
   line_count: -1
   last_updated: 2026-01-05

   # REPLACE (with actual values from grep/calculation):
   sections:
     - name: "Overview"
       line_start: 146
       line_end: 148
       summary: "..."
     - name: "Technology Stack"
       line_start: 149
       line_end: 154
       summary: "..."
     - name: "User Interaction Patterns"
       line_start: 620
       line_end: 896
       summary: "..."
     - name: "Key Principles Summary"
       line_start: 897
       line_end: 875
       summary: "..."

   complexity: intermediate
   line_count: 875
   last_updated: 2026-01-05
   ```

5. **Pass 2 Validation Checklist**:
   - ✅ All sections have line_start > 0 (no more -1 placeholders)
   - ✅ All sections have line_end > 0 (no more -1 placeholders)
   - ✅ line_count > 0 (no more -1 placeholder)
   - ✅ All sections satisfy: line_start <= line_end
   - ✅ Last section line_end == line_count
   - ✅ No gaps or overlaps between sections
   - ✅ Spot check: Read line at line_start verifies "## Section Name"

6. **Error Detection: Check for Remaining Placeholders**

   After Pass 2, verify no placeholders remain:

   ```bash
   check_for_placeholders() {
     local doc=$1

     # Check for -1 in line numbers
     if grep -q "line_start: -1" "$doc" || \
        grep -q "line_end: -1" "$doc" || \
        grep -q "line_count: -1" "$doc"; then
       echo "❌ ERROR: Document still contains placeholder line numbers (-1)"
       echo "   Document: $doc"
       echo "   Pass 2 incomplete or failed - aborting!"
       exit 1
     fi

     echo "✅ No placeholders found in $doc"
   }

   # Run for all modified documents
   check_for_placeholders "frontend-best-practices.md"
   check_for_placeholders "backend-best-practices.md"
   check_for_placeholders "technical-decisions.md"
   ```

7. **Display Pass 2 Complete Message**:
   ```markdown
   ## Pass 2 Complete: Line Numbers Calculated and Verified

   **Documents Finalized**: [count]

   **[document1].md**:
   - Line count: [N] (was -1)
   - Sections: [count] (all line numbers calculated and verified)
   - Validation: ✅ All checks passed
   - Placeholders: ✅ None remaining

   **[document2].md**:
   - Line count: [N] (was -1)
   - Sections: [count] (all line numbers calculated and verified)
   - Validation: ✅ All checks passed
   - Placeholders: ✅ None remaining

   **Status**: ✅ Documents ready for use
   **Next**: Generate triage report

   Ready to proceed to Phase 5? (Please confirm)
   ```

---

#### Creating New Documents (if recommended)

If the agent recommends creating new documents, follow this process:

1. **Write Document with Placeholder Frontmatter**:
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
     - name: "Overview"
       line_start: -1        # PLACEHOLDER
       line_end: -1          # PLACEHOLDER
       summary: "..."
     - name: "Pattern Section"
       line_start: -1        # PLACEHOLDER
       line_end: -1          # PLACEHOLDER
       summary: "..."
   complexity: [basic|intermediate|advanced]
   line_count: -1            # PLACEHOLDER
   last_updated: YYYY-MM-DD
   related:
     - related-doc.md
   ---

   # [Document Title]

   ## Overview
   [Introduction to the patterns in this document]

   ## Pattern Section
   [Pattern content]
   ```

2. **Calculate Line Numbers** (same as Pass 2 above):
   ```bash
   wc -l $AI_DOCS_DIR/new-document.md
   grep -n "^## " $AI_DOCS_DIR/new-document.md
   # Calculate line_end for each section
   # Replace placeholders with actual values
   ```

---

#### Summary of Document Updates

8. **Display Update Summary**
   ```markdown
   ## Phase 4 Complete: Document Updates

   **Documents Modified**: [count]
   **Documents Created**: [count]
   **Total Patterns Added**: [count]

   ### Pass 1 Results (Content & Metadata)
   - ✅ All content sections added
   - ✅ All frontmatter metadata updated
   - ✅ Placeholders (-1) used for all line numbers

   ### Pass 2 Results (Line Number Calculation)
   - ✅ All line numbers calculated from final document state
   - ✅ All validations passed (line_start <= line_end)
   - ✅ All placeholders replaced with actual values
   - ✅ No -1 values remaining in any document

   ### Modified Documents

   **backend-best-practices.md**:
   - Added: confirmation-modal-pattern (NEW)
   - Added: immutable-state-updates (NEW)
   - Merged: service-layer-error-handling (combined with existing)
   - Patterns: [old_count] → [new_count] (+[diff] variations)
   - Keywords: [old_count] → [new_count] (+[diff] terms)
   - Line count: [old] → [new] (+[diff] lines)
   - Sections: All line numbers verified ✅

   **frontend-patterns.md**:
   - Added: react-hooks-state-management (NEW)
   - Patterns: [old_count] → [new_count] (+[diff] variations)
   - Line count: [old] → [new] (+[diff] lines)
   - Sections: All line numbers verified ✅

   ### Created Documents

   **integration-patterns.md**:
   - New document with [N] patterns
   - Domain: [domain]
   - Line count: [N] lines
   - Sections: All line numbers verified ✅

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