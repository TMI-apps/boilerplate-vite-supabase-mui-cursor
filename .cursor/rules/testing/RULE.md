---
description: "Testing standards, patterns, and quality requirements"
alwaysApply: true
---

# Testing Standards

## Purpose

This rule defines testing requirements, patterns, and quality standards for ensuring code reliability.

## Test Coverage

### Minimum Requirements
- Aim for 80%+ code coverage on critical paths
- Test all public APIs and exported functions
- Cover edge cases and error conditions

### What to Test
- Business logic and calculations
- User interactions and workflows
- Error handling and edge cases
- Integration points between modules

### What Not to Test
- Third-party library functionality
- Trivial getters/setters without logic
- Implementation details (test behavior, not implementation)

## Test Organization

### File Structure
- Mirror source file structure in test directory
- Use descriptive test file names: `[component].test.ts` or `[component].spec.ts`
- Group related tests using `describe` blocks

### Test Naming
- Use descriptive test names that explain what is being tested
- Follow pattern: "should [expected behavior] when [condition]"
- Avoid generic names like "test1" or "works"

## Testing Patterns

### Unit Tests
- Test individual functions/components in isolation
- Mock external dependencies
- Use test doubles (mocks, stubs, spies) appropriately

### Integration Tests
- Test interactions between modules
- Use real implementations where possible
- Test data flow through the system

### Test Data
- Use factories or builders for test data
- Keep test data minimal and focused
- Avoid hardcoded values that may change

## Examples

### ✅ Good Example

```typescript
describe('calculateTotalPrice', () => {
  it('should return price with tax when given valid inputs', () => {
    const result = calculateTotalPrice(100, 0.20);
    expect(result).toBe(120);
  });
  
  it('should throw error when price is negative', () => {
    expect(() => calculateTotalPrice(-10, 0.20)).toThrow(
      'Price cannot be negative'
    );
  });
  
  it('should handle zero tax rate', () => {
    const result = calculateTotalPrice(100, 0);
    expect(result).toBe(100);
  });
});
```

### ❌ Bad Example

```typescript
// Bad: unclear test names, no edge cases, poor organization
describe('test', () => {
  it('works', () => {
    expect(calculateTotalPrice(100, 0.20)).toBe(120);
  });
});
```

## Test Quality

### Readability
- Tests should read like documentation
- Use clear setup, execution, and assertion phases
- Avoid complex test logic

### Maintainability
- Keep tests independent (no shared state)
- Use beforeEach/afterEach for common setup
- Refactor test code like production code

### Performance
- Keep tests fast (unit tests should run in milliseconds)
- Use appropriate test types for different scenarios
- Avoid unnecessary async operations

---

## Related Rules

**When modifying this rule, check these rules for consistency:**

- `code-style/RULE.md` - Code style standards for test files
- `architecture/RULE.md` - Testing patterns that depend on architecture
- `workflow/RULE.md` - Code review standards for tests

**Rules that reference this rule:**
- `architecture/RULE.md` - May reference testability requirements

