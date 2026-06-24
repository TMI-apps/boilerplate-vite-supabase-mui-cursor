# Preload on user intent

**Impact:** MEDIUM

Start loading a code-split chunk before navigation when the user hovers or focuses a link.

```typescript
function NavLink({ to, preload }: { to: string; preload: () => Promise<unknown> }) {
  return (
    <Link
      to={to}
      onMouseEnter={() => void preload()}
      onFocus={() => void preload()}
    >
      Tasks
    </Link>
  );
}

// preload: () => import("@/pages/tasks/TasksPage")
```

Reduces perceived latency on route changes.
