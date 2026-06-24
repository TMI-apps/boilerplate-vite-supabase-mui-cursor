# Defer non-critical third-party code

**Impact:** MEDIUM

Analytics, logging, and devtools should not block initial interaction. Load after first paint.

**Pattern (see `QueryDevtoolsGate.tsx`):**

```typescript
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((m) => ({
    default: m.ReactQueryDevtools,
  }))
);
```

For one-off scripts, use dynamic `import()` inside `requestIdleCallback` or after mount — not synchronous top-level imports.
