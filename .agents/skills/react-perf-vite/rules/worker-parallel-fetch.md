# Parallel fetches in Worker handlers

**Impact:** CRITICAL (Workers)

Start independent work before awaiting — same pattern as API routes, applied to `cloud-functions/` and Workers.

**Incorrect:**

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const session = await auth(request);
    const config = await loadConfig(env);
    const data = await loadData(session.userId);
    return Response.json({ data, config });
  },
};
```

**Correct:**

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const sessionPromise = auth(request);
    const configPromise = loadConfig(env);
    const session = await sessionPromise;
    const [config, data] = await Promise.all([
      configPromise,
      loadData(session.userId),
    ]);
    return Response.json({ data, config });
  },
};
```

See also: `documentation/DOC_CLOUDFLARE_WORKERS.md`.
