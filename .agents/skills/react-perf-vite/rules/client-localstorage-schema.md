# Versioned, minimal localStorage

**Impact:** MEDIUM

Prefix keys with a version; store only fields the UI needs; wrap in try/catch (private mode / quota).

```typescript
const STORAGE_KEY = "prefs:v1";

function loadPrefs(): Prefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Prefs) : null;
  } catch {
    return null;
  }
}
```

Do not persist tokens or full server user objects.
