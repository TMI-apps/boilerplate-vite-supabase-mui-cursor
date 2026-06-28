# Hoist static I/O in Workers

**Impact:** HIGH (Workers)

Load static config, templates, or fonts at module scope — not on every request.

**Incorrect — reads every invocation:**

```typescript
export default {
  async fetch() {
    const config = JSON.parse(await env.CONFIG.get());
    // ...
  },
};
```

**Correct — module-level promise:**

```typescript
let configPromise: Promise<Config> | null = null;

function getConfig(env: Env) {
  if (!configPromise) {
    configPromise = env.CONFIG.get().then((raw) => JSON.parse(raw));
  }
  return configPromise;
}
```

Safe for immutable assets only — not per-user or per-request data.
