# Explicit conditional render

**Impact:** LOW

Use ternary when the condition can be `0` or `NaN` — `&&` would render `"0"`.

**Incorrect:**

```typescript
{count && <Badge>{count}</Badge>}
```

**Correct:**

```typescript
{count > 0 ? <Badge>{count}</Badge> : null}
```
