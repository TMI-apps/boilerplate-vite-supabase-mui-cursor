# Rules Index

Quick reference guide to all rules and their relationships.

## Rule Categories

### Code Style (`code-style/RULE.md`)
- Naming conventions
- Formatting standards
- Documentation requirements
- Code organization
- **GTS linting** (default, with override option)
- **TypeScript strict mode** (required)

**Related to:** All other rules

---

### Architecture (`architecture/RULE.md`)
- Design principles
- Project structure
- Patterns and practices
- Module organization
- **Architecture documentation** (required maintenance)

**Related to:** code-style, testing, security, workflow

---

### Testing (`testing/RULE.md`)
- Test coverage requirements
- Testing patterns
- Test organization
- Quality standards

**Related to:** code-style, architecture, workflow

---

### Security (`security/RULE.md`)
- Authentication & authorization
- Input validation
- Data protection
- Vulnerability prevention

**Related to:** architecture, code-style, workflow

---

### Workflow (`workflow/RULE.md`)
- Code review process
- **Git workflow with changelog synchronization** (mandatory)
- **Semantic versioning** (required: MAJOR.MINOR.PATCH)
- **Commit message format** (version first, matches changelog)
- **Branch patterns** (feature, experimental, develop)
- Development process
- PR standards
- Agent-specific behaviors
- **🚨 CRITICAL: PowerShell/Select-Object piping rules** (prevents IDE crashes)
- Deployment processes

**Related to:** All other rules (references them in review process)

---

### Cloud Functions (`cloud-functions/RULE.md`)
- Function organization by business capability
- Performance and security considerations
- When to create new functions

**Related to:** architecture, workflow, security

---

## Consistency Check Matrix

When modifying a rule, check these related rules:

| Rule | Check These Rules |
|------|-------------------|
| `code-style` | architecture, testing, workflow |
| `architecture` | code-style, testing, security, workflow, cloud-functions |
| `testing` | code-style, architecture, workflow |
| `security` | architecture, code-style, workflow, cloud-functions |
| `workflow` | All rules (references them) |
| `cloud-functions` | architecture, workflow, security |

## Adding a New Rule

1. Create folder: `rules/[category]/[rule-name]/`
2. Create `RULE.md` following the template
3. Add "Related Rules" section at the bottom
4. Update this INDEX.md
5. Update related rules to reference the new rule

