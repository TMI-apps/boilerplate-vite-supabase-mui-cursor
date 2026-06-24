# Lazy-load routes and heavy panels

**Impact:** CRITICAL

Use `React.lazy` + `Suspense` — not `next/dynamic`.

**Incorrect — heavy page in main chunk:**

```typescript
import { TasksPage } from "@/pages/tasks/TasksPage";
```

**Correct — pattern used in `App.tsx`:**

```typescript
const TasksPage = lazy(() =>
  import("@/pages/tasks/TasksPage").then((m) => ({ default: m.TasksPage }))
);

// In router tree:
<Suspense fallback={<PageLoadingState />}>
  <TasksPage />
</Suspense>
```

Set `ssr: false` is **not** applicable — this is a CSR Vite app.
