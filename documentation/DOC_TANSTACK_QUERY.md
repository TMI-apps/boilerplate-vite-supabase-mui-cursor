# TanStack Query – Server State Management

## Overview

TanStack Query manages server state with caching, deduplication, and stale-while-revalidate. This addresses the following problems:

- Slow back navigation (data reloading)
- Duplicate API calls for the same data
- Stale information without refresh

## Query Keys

### Shared keys (cross-cutting)

`src/shared/utils/queryKeys.ts`:

```typescript
export const sharedQueryKeys = {
  user: {
    all: ["user"] as const,
    profile: (userId: string) => ["user", "profile", userId] as const,
  },
  config: {
    all: ["config"] as const,
    section: (section: string) => ["config", section] as const,
  },
} as const;
```

### Feature-based keys

Per feature: `features/[feature]/api/keys.ts`:

```typescript
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  detail: (id: string) => [...projectKeys.all, "detail", id] as const,
} as const;
```

### Conventions

- Hierarchy: `[resource, subResource?, ...params]`
- Use `as const` for type-safety
- Use spread for derived keys: `[...keys.all, "detail", id]`

## Mutations and Invalidation Patterns

### Rule

Only invalidate directly related keys. Avoid broad `invalidateQueries({ queryKey: [] })`.

### Patterns per mutation type

| Mutation | Invalidate | Do not invalidate |
|----------|------------|-------------------|
| Create project | `projectKeys.lists()` | Detail (not yet existing) |
| Update project | `projectKeys.detail(id)`, `projectKeys.lists()` | Other features |
| Delete project | `projectKeys.detail(id)`, `projectKeys.lists()` | User, config |
| Update user profile | `sharedQueryKeys.user.profile(userId)` | Config, projects |

### Example: useUpdateUserProfile

```typescript
// features/auth/hooks/useUpdateUserProfile.ts
export const useUpdateUserProfile = (userId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfileUpdate) => updateUserProfile(userId!, data),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: sharedQueryKeys.user.profile(userId),
        });
      }
    },
  });
};
```

### Optimistic updates (optional)

Only for fast, reversible actions (toggles, likes). Not for: payments, account changes.

```typescript
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: projectKeys.detail(id) });
  const previous = queryClient.getQueryData(projectKeys.detail(id));
  queryClient.setQueryData(projectKeys.detail(id), newData);
  return { previous };
},
onError: (_err, _vars, context) => {
  if (context?.previous) {
    queryClient.setQueryData(projectKeys.detail(id), context.previous);
  }
},
```

## Auth Boundary

On logout: `queryClient.clear()` in `authService.logout`, before `signOut()`. Prevents user A's data from being visible after user B logs in.

## Stale/gc Times

- Defaults: 5 min stale, 30 min gc (in `queryClient.ts`)
- Override per query when needed (e.g. `staleTime: 0` for realtime data)

| Data type | staleTime | gcTime | Notes |
|-----------|----------|--------|-------|
| User profile | 5 min (default) | 30 min (default) | Invalidated on profile update |
| Config sections | 10 min | 1 hour | Setup wizard data, rarely changes |
| Lists (e.g. projects) | 5 min | 30 min | Invalidate on create/update/delete |
| Detail (e.g. project) | 2–5 min | 30 min | Invalidate on update/delete |
| Realtime data | 0 | 5 min | Polling or websocket-driven |

## Testing

**File:** `tests/test-utils.tsx`

- `createTestQueryClient()` – QueryClient with `retry: false`, `gcTime: 0` for fast, deterministic tests
- `createQueryClientWrapper()` – Returns a wrapper component for `render(..., { wrapper })`

### Example

```tsx
import { render, screen } from "@testing-library/react";
import { createQueryClientWrapper } from "@/../tests/test-utils";
import { ProfileMenu } from "../ProfileMenu";

// When testing components that use useQuery/useMutation without mocking:
render(<ProfileMenu />, {
  wrapper: createQueryClientWrapper(),
});
```

### When to use

- **Use wrapper:** When rendering components that call `useUserProfile`, `useConfigurationData`, or other query hooks without mocking them
- **Mock instead:** When you want to control the returned data (e.g. `vi.mock("@features/auth/hooks/useUserProfile")`)

### Service tests

Mock `queryClient` in service tests when the service uses it (e.g. invalidation on logout).

### Not covered by automated tests

Unit tests cover hooks and services. The following require **manual verification**:

- Login/logout flow and cache clear on logout
- Prefetching on hover over Setup links
- Cached data when navigating back

See `documentation/jobs/implementation-plan-tanstack-query.md` – Step 9 "Not covered by automated tests".

## Prefetching

**File:** `src/shared/hooks/usePrefetch.ts`

- Use `prefetchSetup` on hover over Setup links to preload config data
- **Rule:** Only prefetch for critical routes; measure before adding more

```tsx
const { prefetchSetup } = usePrefetch();
<Link to="/setup" onMouseEnter={prefetchSetup}>Setup</Link>
```

## Lazy loading + Suspense

- Lazy load heavy pages: `lazy(() => import("@pages/SetupPage"))`
- Wrap routes in `<Suspense fallback={<PageLoadingState />}>`
- Cached query data + code splitting = fast navigation on return visits

## Error Boundary

**File:** `src/components/common/QueryErrorBoundary/QueryErrorBoundary.tsx`

- Wraps route-level content to catch render errors (including failed lazy loads)
- Default fallback: "Something went wrong" + Retry button (reloads page)
- **Placement:** Around `Suspense` + `Routes` in App.tsx

## Retry Logic

Configured in `queryClient.ts`:

- **Queries:** Retry up to 2 times, exponential backoff (1s, 2s, max 30s). No retry on 404.
- **Mutations:** No retry (default).
- **Tests:** `createTestQueryClient()` uses `retry: false` for deterministic tests.

## Migration Strategy for New Features

For new features that fetch server data, use these patterns:

### useEntityList

```typescript
// features/projects/hooks/useProjectList.ts
export const useProjectList = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => ProjectService.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};
```

### useEntityDetail

```typescript
// features/projects/hooks/useProjectDetail.ts
export const useProjectDetail = (id: string | null) => {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ""),
    queryFn: () => ProjectService.getById(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};
```

### Checklist for new features

1. Add query keys in `features/[feature]/api/keys.ts`
2. Create fetch function in service (or use existing)
3. Create `useXxxQuery` hook with `useQuery`
4. Optionally keep legacy `useXxx` as thin wrapper for backward compatibility
5. Add mutation hooks with `onSuccess` invalidation
