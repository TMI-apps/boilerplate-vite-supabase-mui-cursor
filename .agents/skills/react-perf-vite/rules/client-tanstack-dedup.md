# TanStack Query deduplication (not SWR)

**Impact:** MEDIUM-HIGH

**SSOT:** `documentation/DOC_TANSTACK_QUERY.md`, `architecture/RULE.md`.

Multiple components mounting the same query key share one request automatically. Do **not** introduce SWR.

**Incorrect — per-instance fetch in `useEffect`:**

```typescript
useEffect(() => {
  fetch("/api/tasks").then(/* setState */);
}, []);
```

**Correct:**

```typescript
const { data } = useQuery({ queryKey: taskKeys.list(), queryFn: listTasks });
```

For mutations, use optimistic updates + `setQueryData` from the server response — not blanket `invalidateQueries` on the same key.
