# Cheap sync guard before await

**Impact:** HIGH

When a condition combines a remote/flag check with a cheap local check, evaluate the cheap check first.

**Incorrect:**

```typescript
const enabled = await getFeatureFlag();
if (enabled && user.isAdmin) { /* ... */ }
```

**Correct:**

```typescript
if (user.isAdmin) {
  const enabled = await getFeatureFlag();
  if (enabled) { /* ... */ }
}
```
