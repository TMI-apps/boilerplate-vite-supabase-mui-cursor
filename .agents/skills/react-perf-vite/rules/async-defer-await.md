# Defer await until the branch needs it

**Impact:** HIGH

Move `await` into the branch that uses the result so unused paths do not block.

**Incorrect:**

```typescript
async function load(userId: string, skip: boolean) {
  const profile = await fetchProfile(userId);
  if (skip) return { skipped: true };
  return profile;
}
```

**Correct:**

```typescript
async function load(userId: string, skip: boolean) {
  if (skip) return { skipped: true };
  return fetchProfile(userId);
}
```
