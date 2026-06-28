# Immutable sort with toSorted

**Impact:** MEDIUM-HIGH

Do not mutate props/state arrays with `.sort()`. Use `.toSorted()` or copy-then-sort.

**Incorrect:**

```typescript
const sorted = useMemo(() => items.sort((a, b) => a.name.localeCompare(b.name)), [items]);
```

**Correct:**

```typescript
const sorted = useMemo(() => items.toSorted((a, b) => a.name.localeCompare(b.name)), [items]);
```

Fallback for older targets: `[...items].sort(...)`.
