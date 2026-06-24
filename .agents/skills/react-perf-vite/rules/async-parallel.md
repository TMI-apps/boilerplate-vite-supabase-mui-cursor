# Parallel independent async work

**Impact:** CRITICAL

When operations have no interdependencies, run them concurrently with `Promise.all` (or start promises early and await together).

**Incorrect — sequential round trips:**

```typescript
const user = await fetchUser();
const tasks = await fetchTasks();
```

**Correct:**

```typescript
const [user, tasks] = await Promise.all([fetchUser(), fetchTasks()]);
```

Applies to: feature services, hook loaders, Cloudflare Worker handlers.
