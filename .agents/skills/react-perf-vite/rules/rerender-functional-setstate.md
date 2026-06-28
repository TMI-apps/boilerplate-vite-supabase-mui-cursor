# Functional setState updates

**Impact:** MEDIUM

When the next state depends on the previous state, use the functional updater — stable callbacks, no stale closures.

**Incorrect:**

```typescript
const remove = useCallback((id: string) => {
  setItems(items.filter((i) => i.id !== id));
}, [items]);
```

**Correct:**

```typescript
const remove = useCallback((id: string) => {
  setItems((curr) => curr.filter((i) => i.id !== id));
}, []);
```
