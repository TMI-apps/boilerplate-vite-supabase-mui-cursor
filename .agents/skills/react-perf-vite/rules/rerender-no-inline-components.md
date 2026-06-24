# Do not define components inside components

**Impact:** HIGH

Nested component definitions create a new type every render → full remount, lost state, repeated effects.

**Incorrect:**

```typescript
function TaskList({ items }: Props) {
  const Row = ({ item }: { item: Task }) => <li>{item.title}</li>;
  return items.map((item) => <Row key={item.id} item={item} />);
}
```

**Correct — extract and pass props:**

```typescript
function TaskRow({ item }: { item: Task }) {
  return <li>{item.title}</li>;
}

function TaskList({ items }: Props) {
  return items.map((item) => <TaskRow key={item.id} item={item} />);
}
```
