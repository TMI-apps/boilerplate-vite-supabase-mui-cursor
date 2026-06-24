# Derive during render, not in effects

**Impact:** MEDIUM

If a value is computable from props/state, derive it in the render body — do not mirror it with `useEffect` + `setState`.

**Incorrect:**

```typescript
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);
```

**Correct:**

```typescript
const fullName = `${first} ${last}`;
```

Reference: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
