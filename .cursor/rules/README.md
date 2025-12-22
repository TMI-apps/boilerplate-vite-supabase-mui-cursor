# Cursor Rules Structure

This directory contains global User Rules that apply across all your projects.

## Rule Organization

Each rule is a folder containing a `RULE.md` file with:
- Frontmatter metadata (description, alwaysApply, globs)
- Rule content
- Cross-reference section for consistency checks

## Rule Categories

- **code-style**: Naming conventions, formatting, documentation
- **architecture**: Design patterns, module organization, structure
- **testing**: Test coverage, testing patterns, quality gates
- **security**: Security best practices, vulnerability prevention
- **workflow**: Development processes, code review standards

## Adding a New Rule

1. Create a new folder: `rules/[category]/[rule-name]/`
2. Create `RULE.md` with the standard template
3. Update this README with the new rule
4. Add cross-references to related rules

## Consistency Checks

When modifying a rule, check the "Related Rules" section at the bottom of each `RULE.md` file to ensure consistency across related rules.

