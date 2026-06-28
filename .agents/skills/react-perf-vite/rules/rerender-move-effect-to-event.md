# Interaction logic in event handlers

**Impact:** MEDIUM

User actions (submit, click, toggle) should run in handlers — not as `useState` + `useEffect`.

**Incorrect:**

```typescript
const [submitted, setSubmitted] = useState(false);
useEffect(() => {
  if (submitted) saveDraft();
}, [submitted]);
```

**Correct:**

```typescript
function handleSubmit() {
  saveDraft();
}
```
