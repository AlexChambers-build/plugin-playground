#!/bin/bash
# Quick test workflow for knowledge base skills

echo "============================================"
echo "Testing Knowledge Base Skills"
echo "============================================"
echo ""

echo "1. DISCOVER - List all documents"
echo "--------------------------------------------"
node shared/scripts/list-docs.js
echo ""

echo "2. SCAN - Read frontmatter from backend-best-practices.md"
echo "--------------------------------------------"
node read-frontmatter/scripts/extract-frontmatter.js backend-best-practices.md --json | head -30
echo "... (truncated for display)"
echo ""

echo "3. RETRIEVE - Extract 'Service Layer Best Practices' section (lines 186-253)"
echo "--------------------------------------------"
node extract-segment/scripts/extract-segment.js backend-best-practices.md 186 253 | head -40
echo "... (truncated for display)"
echo ""

echo "============================================"
echo "Test Complete!"
echo "============================================"
echo ""
echo "Try these commands yourself:"
echo ""
echo "  # List all documents with JSON output"
echo "  node shared/scripts/list-docs.js --json"
echo ""
echo "  # Extract frontmatter from all documents"
echo "  node read-frontmatter/scripts/extract-frontmatter.js --all"
echo ""
echo "  # Extract a section with context"
echo "  node extract-segment/scripts/extract-segment.js backend-best-practices.md 186 253 --offset 5"
echo ""
