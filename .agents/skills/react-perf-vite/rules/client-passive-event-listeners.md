# Passive scroll/touch listeners

**Impact:** MEDIUM

Use `{ passive: true }` when the handler does not call `preventDefault()`.

```typescript
useEffect(() => {
  const onScroll = () => { /* track only */ };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

Omit `passive` only for custom gestures that must cancel default behavior.
